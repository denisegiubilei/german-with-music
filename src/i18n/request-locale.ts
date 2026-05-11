import { cache } from "react";
import { headers } from "next/headers";
import {
  defaultLocale,
  i18nHeaderName,
  isValidLocale,
  type Locale,
} from "@/i18n/settings";

/**
 * Active locale for this request (set by {@link src/middleware.ts} on `i18nHeaderName`).
 * Use from Server Components instead of threading `locale` from `params`.
 */
export const getRequestLocale = cache(async (): Promise<Locale> => {
  const headerLocale = (await headers()).get(i18nHeaderName);
  if (headerLocale && isValidLocale(headerLocale)) {
    return headerLocale;
  }
  return defaultLocale;
});
