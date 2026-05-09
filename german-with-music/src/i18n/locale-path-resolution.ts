import {
  defaultLocale,
  isValidLocale,
  looksLikeLocaleSegment,
  type Locale,
} from "./settings";

/**
 * Next.js middleware matcher paths. Keep prefix rules in sync with
 * {@link shouldSkipLocaleMiddleware}. Paths whose last segment looks like a static file
 * (`*.ext`) still match here; middleware returns early via {@link shouldSkipLocaleMiddleware}.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export const localeMiddlewareMatcher = [
  "/((?!api(?:/|$)|_next(?:/|$)|favicon.ico|robots.txt|sitemap.xml|images(?:/|$)).*)",
];

export type LocalePathResolution =
  | { kind: "skip" }
  | { kind: "pass-through"; localeSegment: string }
  | { kind: "rewrite"; internalPath: string; activeLocale: Locale }
  | { kind: "redirect-default-prefix"; unprefixedPath: string };

export function shouldSkipLocaleMiddleware(pathname: string): boolean {
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/api")) return true;
  if (
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return true;
  }
  const last = pathname.split("/").pop() ?? "";
  if (last.includes(".") && /\.[a-zA-Z0-9]+$/.test(last)) return true;
  return false;
}

export function resolveLocalePath(pathname: string): LocalePathResolution {
  if (shouldSkipLocaleMiddleware(pathname)) return { kind: "skip" };

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return {
      kind: "rewrite",
      internalPath: `/${defaultLocale}`,
      activeLocale: defaultLocale,
    };
  }

  const first = segments[0]!;

  if (isValidLocale(first)) {
    if (first === defaultLocale) {
      const rest =
        segments.length === 1 ? "/" : `/${segments.slice(1).join("/")}`;
      return { kind: "redirect-default-prefix", unprefixedPath: rest };
    }
    return { kind: "pass-through", localeSegment: first };
  }

  if (looksLikeLocaleSegment(first)) {
    return { kind: "pass-through", localeSegment: first };
  }

  return {
    kind: "rewrite",
    internalPath: `/${defaultLocale}${pathname}`,
    activeLocale: defaultLocale,
  };
}
