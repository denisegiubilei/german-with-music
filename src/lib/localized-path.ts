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
 */
export function localizedPath(path: string, locale: Locale): string {
  const normalized =
    path === "" || path === "/"
      ? "/"
      : path.startsWith("/")
        ? path
        : `/${path}`;

  if (locale === defaultLocale) {
    return normalized;
  }

  if (normalized === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalized}`;
}
