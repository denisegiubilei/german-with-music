import { defaultLocale, isValidLocale, type Locale } from "./settings";

export type LocalePathResolution =
  | { kind: "skip" }
  | { kind: "pass-through"; localeSegment: string }
  | { kind: "rewrite"; internalPath: string; activeLocale: Locale }
  | { kind: "redirect-default-prefix"; unprefixedPath: string };

/**
 * Paths the locale middleware should not touch. Prefix rules must stay in sync with the
 * literal `matcher` array in `src/proxy.ts` (Next requires static matchers there).
 * Paths whose last segment looks like `*.ext` still match the matcher and return early here.
 */
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

  return {
    kind: "rewrite",
    internalPath: `/${defaultLocale}${pathname}`,
    activeLocale: defaultLocale,
  };
}
