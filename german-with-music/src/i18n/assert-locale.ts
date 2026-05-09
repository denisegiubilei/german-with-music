import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/i18n/settings";

/** Use in Server Components / `generateMetadata` instead of repeating `isValidLocale` + `notFound()`. */
export function assertLocale(value: string): Locale {
  if (!isValidLocale(value)) notFound();
  return value;
}
