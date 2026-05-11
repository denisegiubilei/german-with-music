import type { Metadata } from "next";
import type { Locale } from "@/i18n/settings";
import { canonicalForLocale, hreflangLanguageMap } from "@/lib/hreflang";

/** Canonical + hreflang alternates for a path without locale prefix (e.g. `/`, `/about`). */
export function alternatesForPath(
  pathWithoutLocale: string,
  locale: Locale,
): Pick<Metadata, "alternates"> | undefined {
  const languages = hreflangLanguageMap(pathWithoutLocale);
  const canonical = canonicalForLocale(pathWithoutLocale, locale);
  if (!languages || !canonical) return undefined;
  return {
    alternates: {
      canonical,
      languages,
    },
  };
}
