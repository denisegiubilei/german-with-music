import Link from "next/link";
import { getRequestLocale } from "@/i18n/request-locale";
import { localizedPath } from "@/lib/localized-path";
import type { LocalizedLinkProps } from "@/components/localized-link/localized-link-props";

/**
 * Server `Link` with locale prefix from the request header (middleware), not from props or context.
 * For client-only trees, use {@link LocalizedLinkClient}.
 */
export async function LocalizedLink({ href, ...rest }: LocalizedLinkProps) {
  const locale = await getRequestLocale();
  return <Link href={localizedPath(href, locale)} {...rest} />;
}
