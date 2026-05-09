import { defaultLocale, locales, type Locale } from "@/i18n/settings";
import { localizedPath } from "@/lib/localized-path";

function normalizePath(pathWithoutLocale: string): string {
  if (pathWithoutLocale === "" || pathWithoutLocale === "/") return "/";
  return pathWithoutLocale.startsWith("/")
    ? pathWithoutLocale
    : `/${pathWithoutLocale}`;
}

/** `alternates.languages` for Next `Metadata` (default locale URLs stay unprefixed). */
export function hreflangLanguageMap(
  pathWithoutLocale: string,
): Record<string, string> | undefined {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return undefined;
  const base = siteUrl.replace(/\/$/, "");
  const path = normalizePath(pathWithoutLocale);

  const languages: Record<string, string> = {};
  for (const lng of locales) {
    languages[lng] = `${base}${localizedPath(path, lng)}`;
  }
  languages["x-default"] = `${base}${localizedPath(path, defaultLocale)}`;
  return languages;
}

export function canonicalForLocale(
  pathWithoutLocale: string,
  locale: Locale,
): string | undefined {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return undefined;
  const base = siteUrl.replace(/\/$/, "");
  const path = normalizePath(pathWithoutLocale);
  return `${base}${localizedPath(path, locale)}`;
}
