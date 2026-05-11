"use client";

import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react";
import type { Locale } from "@/i18n/settings";
import { localizedPath } from "@/lib/localized-path";

const LocaleContext = createContext<Locale | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

/** Current route locale (set in `app/[locale]/layout.tsx`). */
export function useLocale(): Locale {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useLocale must be used within app/[locale] (LocaleProvider).");
  }
  return value;
}

/** Returns a function that prefixes `path` for the current locale. */
export function useLocalizedPath(): (path: string) => string {
  const locale = useLocale();
  return useCallback((path: string) => localizedPath(path, locale), [locale]);
}
