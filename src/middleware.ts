import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  resolveLocalePath,
  shouldSkipLocaleMiddleware,
} from "@/i18n/locale-path-resolution";
import { getPreferredLocale } from "@/i18n/preferred-locale";
import { defaultLocale, i18nHeaderName, isValidLocale } from "@/i18n/settings";
import { localizedPath } from "@/lib/localized-path";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  if (shouldSkipLocaleMiddleware(pathname)) {
    return NextResponse.next();
  }

  const resolved = resolveLocalePath(pathname);

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
