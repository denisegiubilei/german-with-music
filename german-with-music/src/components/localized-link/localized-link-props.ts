import type Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

/** Props shared by server {@link LocalizedLink} and client {@link LocalizedLinkClient}. */
export type LocalizedLinkProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href"
> & {
  /** Path without locale prefix (e.g. `/about`, `/`). */
  href: string;
};
