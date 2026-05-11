import type { I18nConfig } from "next-i18next/proxy";
import type { Locale } from "./src/i18n/settings";
import {
  cookieName,
  defaultLocale,
  i18nHeaderName,
  locales,
} from "./src/i18n/settings";

const resourceLoaders: Record<
  Locale,
  () => Promise<Record<string, unknown>>
> = {
  en: () => import("./src/locales/en/common.json").then((m) => m.default),
  "pt-BR": () => import("./src/locales/pt-BR/common.json").then((m) => m.default),
};

const i18nConfig: I18nConfig = {
  supportedLngs: [...locales],
  fallbackLng: defaultLocale,
  defaultNS: "common",
  ns: ["common"],
  cookieName,
  headerName: i18nHeaderName,
  resourceLoader: async (language) => {
    const load = resourceLoaders[language as Locale];
    if (!load) {
      throw new Error(`Unsupported locale: ${language}`);
    }
    return load();
  },
};

export default i18nConfig;
