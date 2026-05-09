import { getT as getTFromNext } from "next-i18next/server";
import { getRequestLocale } from "@/i18n/request-locale";

/**
 * Server-only translation helper (wraps next-i18next `getT` with explicit locale).
 */
export function getT(locale: string, namespace: string = "common") {
  return getTFromNext(namespace, { lng: locale });
}

/** `getT` using the locale from the request header (see {@link getRequestLocale}). */
export async function getTForRequest(namespace: string = "common") {
  const locale = await getRequestLocale();
  return getT(locale, namespace);
}
