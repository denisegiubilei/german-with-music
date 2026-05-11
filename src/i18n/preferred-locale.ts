import type { NextRequest } from "next/server";
import {
  cookieName,
  isValidLocale,
  locales,
  type Locale,
} from "@/i18n/settings";

/**
 * Map an Accept-Language header to a supported {@link Locale}, respecting q-values.
 */
export function localeFromAcceptLanguage(
  acceptLanguage: string | undefined,
): Locale | null {
  if (!acceptLanguage) return null;

  const candidates = acceptLanguage
    .split(",")
    .map((part) => {
      const [tagPart, ...params] = part.trim().split(";");
      const tag = tagPart?.trim().toLowerCase() ?? "";
      let q = 1;
      for (const p of params) {
        const s = p.trim();
        if (s.startsWith("q=")) {
          const n = Number.parseFloat(s.slice(2));
          if (!Number.isNaN(n)) q = n;
        }
      }
      return { tag, q };
    })
    .filter((c) => c.tag.length > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of candidates) {
    for (const loc of locales) {
      if (loc.toLowerCase() === tag) return loc;
    }
    const primary = tag.split("-")[0] ?? "";
    if (!primary) continue;
    for (const loc of locales) {
      if (loc.toLowerCase().startsWith(`${primary.toLowerCase()}-`)) {
        return loc;
      }
    }
    if (isValidLocale(primary)) return primary;
  }

  return null;
}

/**
 * Preferred UI locale from the i18next cookie, then Accept-Language.
 */
export function getPreferredLocale(request: NextRequest): Locale | null {
  const raw = request.cookies.get(cookieName)?.value;
  if (raw) {
    try {
      const decoded = decodeURIComponent(raw);
      if (isValidLocale(decoded)) return decoded;
    } catch {
      if (isValidLocale(raw)) return raw;
    }
  }
  return localeFromAcceptLanguage(
    request.headers.get("accept-language") ?? undefined,
  );
}
