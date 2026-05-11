import "server-only";

import { getLyricPaletteApiBaseUrl } from "../config";

export type LyricPaletteFetchInit = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

export async function lyricPaletteGetJson<T>(
  path: string,
  init?: LyricPaletteFetchInit,
): Promise<T | null> {
  const base = getLyricPaletteApiBaseUrl().replace(/\/$/, "");
  const normalizedPath = path.replace(/^\//, "");
  const url = `${base}/${normalizedPath}`;

  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
