"use client";

import i18n from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import en from "@/locales/en.json";
import ptBR from "@/locales/pt-br.json";

function ensureI18n() {
  if (i18n.isInitialized) return;

  i18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "pt-br"],
    resources: {
      en: { translation: en },
      "pt-br": { translation: ptBR },
    },
    interpolation: { escapeValue: false },
  });
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  ensureI18n();
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
