/** URL + i18next language codes (BCP 47). */
export const locales = ["en", "pt-BR"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Human-readable names for the language switcher (keep in sync with `locales`). */
export const localeDisplayNames: Record<Locale, string> = {
  en: "English",
  "pt-BR": "Português",
};

/** Align with next-i18next / i18next cookie default naming. */
export const cookieName = "i18next";

/** Must match `headerName` in `i18n.config.ts` (next-i18next server detection). */
export const i18nHeaderName = "x-i18next-current-language";

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
