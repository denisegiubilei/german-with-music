import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  resolveLocalePath,
  shouldSkipLocaleMiddleware,
} from "@/i18n/locale-path-resolution";
import { getPreferredLocale } from "@/i18n/preferred-locale";
import { defaultLocale, i18nHeaderName, isValidLocale } from "@/i18n/settings";
import { localizedPath, pathWithoutLocale } from "@/lib/localized-path";

const REFRESH_COOKIE = "lp_refresh";

/** Routes that require a logged-in session (matched after locale prefix is stripped). */
const PROTECTED_SEGMENTS = ["/me"];

/** Routes that authenticated users should be bounced away from (already have a session). */
const AUTH_ONLY_SEGMENTS = ["/signin", "/signup"];

/** Locale-agnostic app path for auth checks (only strips known locale prefixes). */
function stripLocale(pathname: string): string {
  return pathWithoutLocale(pathname);
}

function isProtected(pathname: string): boolean {
  const stripped = stripLocale(pathname);
  return PROTECTED_SEGMENTS.some(
    (seg) => stripped === seg || stripped.startsWith(seg + "/"),
  );
}

function isAuthOnly(pathname: string): boolean {
  const stripped = stripLocale(pathname);
  return AUTH_ONLY_SEGMENTS.some(
    (seg) => stripped === seg || stripped.startsWith(seg + "/"),
  );
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  if (shouldSkipLocaleMiddleware(pathname)) {
    return NextResponse.next();
  }

  // Resolve locale once so both auth redirects and locale handling use the same result.
  const resolved = resolveLocalePath(pathname);

  // Derive the active locale from the resolved path for correctly localized redirects.
  // e.g. "/pt-BR/me" → "pt-BR", "/me" → defaultLocale
  const activeLocale =
    resolved.kind === "pass-through" && isValidLocale(resolved.localeSegment)
      ? resolved.localeSegment
      : resolved.kind === "rewrite"
        ? resolved.activeLocale
        : defaultLocale;

  // Optimistic auth check — presence of the httpOnly cookie means a session exists.
  // Actual token validity is always enforced by the backend. This check is for UX only.
  const hasSession = !!request.cookies.get(REFRESH_COOKIE)?.value;

  // Redirect unauthenticated users away from protected routes.
  if (isProtected(pathname) && !hasSession) {
    const returnTo = encodeURIComponent(pathname + search);
    const signinPath = localizedPath("/signin", activeLocale) + `?returnTo=${returnTo}`;
    return NextResponse.redirect(new URL(signinPath, request.url));
  }

  // Redirect authenticated users away from auth-only routes.
  if (isAuthOnly(pathname) && hasSession) {
    const homePath = localizedPath("/", activeLocale);
    return NextResponse.redirect(new URL(homePath, request.url));
  }

  // --- Locale proxy ---

  if (resolved.kind === "rewrite") {
    const preferred = getPreferredLocale(request);
    if (preferred && preferred !== defaultLocale) {
      const url = new URL(
        localizedPath(pathname, preferred) + search,
        request.url,
      );
      return NextResponse.redirect(url);
    }
  }

  switch (resolved.kind) {
    case "skip":
      return NextResponse.next();
    case "pass-through": {
      const headers = new Headers(request.headers);
      if (isValidLocale(resolved.localeSegment)) {
        headers.set(i18nHeaderName, resolved.localeSegment);
      }
      return NextResponse.next({ request: { headers } });
    }
    case "redirect-default-prefix": {
      const url = new URL(resolved.unprefixedPath + search, request.url);
      return NextResponse.redirect(url);
    }
    case "rewrite": {
      const url = new URL(resolved.internalPath + search, request.url);
      const headers = new Headers(request.headers);
      headers.set(i18nHeaderName, resolved.activeLocale);
      return NextResponse.rewrite(url, { request: { headers } });
    }
  }
}

/**
 * Must be static string literals (Next parses `config` at compile time).
 * Keep prefix rules in sync with {@link shouldSkipLocaleMiddleware} in
 * `@/i18n/locale-path-resolution`; extension-like paths still hit middleware
 * and return early there.
 */
export const config = {
  matcher: [
    "/((?!api(?:/|$)|_next(?:/|$)|favicon.ico|robots.txt|sitemap.xml|images(?:/|$)).*)",
  ],
};
