import { defaultLocale, locales, type Locale } from "@/i18n/settings";

/**
 * Normalized app path without a locale prefix (always starts with `/`).
 * Handles unprefixed default URLs and `/pt-BR/...` style prefixes.
 */
export function pathWithoutLocale(pathname: string): string {
  for (const loc of locales) {
    if (loc === defaultLocale) continue;
    const prefix = `/${loc}`;
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      const rest = pathname.slice(prefix.length);
      return rest === "" ? "/" : rest;
    }
  }
  if (pathname.startsWith(`/${defaultLocale}/`)) {
    return pathname.slice(`/${defaultLocale}`.length) || "/";
  }
  if (pathname === `/${defaultLocale}`) return "/";
  return pathname || "/";
}

/**
 * Build a pathname for links: default locale stays unprefixed; others use `/${locale}…`.
 * Query strings are preserved; any existing locale prefix is stripped first.
 */
export function localizedPath(path: string, locale: Locale): string {
  const queryIndex = path.indexOf("?");
  const pathnameRaw = queryIndex === -1 ? path : path.slice(0, queryIndex);
  const search = queryIndex === -1 ? "" : path.slice(queryIndex);

  const normalized =
    pathnameRaw === "" || pathnameRaw === "/"
      ? "/"
      : pathnameRaw.startsWith("/")
        ? pathnameRaw
        : `/${pathnameRaw}`;

  const pathname = pathWithoutLocale(normalized);

  if (locale === defaultLocale) {
    return pathname + search;
  }

  if (pathname === "/") {
    return `/${locale}${search}`;
  }

  return `/${locale}${pathname}${search}`;
}
