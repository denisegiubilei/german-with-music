"use client";

import Link from "next/link";
import { forwardRef, type ComponentRef } from "react";
import { useLocale } from "@/i18n/locale-context";
import { localizedPath } from "@/lib/localized-path";
import type { LocalizedLinkProps } from "@/components/localized-link/localized-link-props";

/**
 * Client-only localized `Link` (uses {@link useLocale}).
 * Use inside interactive client components (e.g. Bootstrap `NavbarBrand as={…}`).
 * Prefer {@link LocalizedLink} in Server Components — it reads the locale from request headers.
 */
export const LocalizedLinkClient = forwardRef<
  ComponentRef<typeof Link>,
  LocalizedLinkProps
>(function LocalizedLinkClient({ href, ...rest }, ref) {
  const locale = useLocale();
  return <Link ref={ref} href={localizedPath(href, locale)} {...rest} />;
});
