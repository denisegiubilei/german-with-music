import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import type { RootState } from "@/store";
import { setCredentials, clearCredentials } from "@/features/auth";
import { getLyricPaletteApiBaseUrl } from "../config";

/** Plain base query — used by authApi to avoid circular refresh loops. */
export const lyricPaletteBaseQuery = fetchBaseQuery({
  baseUrl: getLyricPaletteApiBaseUrl(),
});

const plainBaseQuery = fetchBaseQuery({
  baseUrl: getLyricPaletteApiBaseUrl(),
});

/**
 * One refresh at a time.
 * If multiple requests get 401 simultaneously, only the first acquires the lock
 * and calls /api/auth/refresh. The rest wait, then retry with the rotated token —
 * preventing token-reuse detection from triggering a forced full logout.
 */
const refreshMutex = new Mutex();

/**
 * Base query that injects Authorization: Bearer from Redux state and
 * silently refreshes the access token on 401 via the Next.js Route Handler
 * (which reads/rotates the httpOnly refresh cookie — never touches JS).
 */
export const authenticatedBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await refreshMutex.waitForUnlock();

  const token = (api.getState() as RootState).auth.accessToken;
  const argsWithAuth =
    typeof args === "string"
      ? {
          url: args,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      : {
          ...args,
          headers: {
            ...(args.headers as Record<string, string> | undefined),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        };

  let result = await plainBaseQuery(argsWithAuth, api, extraOptions);

  if (result.error?.status === 401) {
    if (!refreshMutex.isLocked()) {
      const release = await refreshMutex.acquire();
      try {
        const refreshResult = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "same-origin",
        });

        if (refreshResult.ok) {
          const refreshData = (await refreshResult.json()) as {
            user: RootState["auth"]["user"];
            accessToken: string;
          };
          if (refreshData.user && refreshData.accessToken) {
            api.dispatch(
              setCredentials({
                user: refreshData.user!,
                accessToken: refreshData.accessToken,
              }),
            );
          } else {
            api.dispatch(clearCredentials());
            return result;
          }
        } else {
          api.dispatch(clearCredentials());
          return result;
        }
      } catch {
        api.dispatch(clearCredentials());
        return result;
      } finally {
        release();
      }
    } else {
      await refreshMutex.waitForUnlock();
    }

    const newToken = (api.getState() as RootState).auth.accessToken;
    if (!newToken) return result;

    const retryArgs =
      typeof args === "string"
        ? { url: args, headers: { Authorization: `Bearer ${newToken}` } }
        : {
            ...args,
            headers: {
              ...(args.headers as Record<string, string> | undefined),
              Authorization: `Bearer ${newToken}`,
            },
          };

    result = await plainBaseQuery(retryArgs, api, extraOptions);
  }

  return result;
};
