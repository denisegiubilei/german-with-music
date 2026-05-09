import { getTForRequest } from "@/i18n/server";
import { HeaderInteractive } from "./HeaderInteractive";

export type { HeaderCopy } from "./header-copy";

export async function Header() {
  const { t } = await getTForRequest();
  const copy = {
    brand: t("brand"),
    navSongs: t("nav.songs"),
    navHowItWorks: t("nav.howItWorks"),
    navLyrics: t("nav.lyrics"),
    navStart: t("nav.start"),
    languageAriaLabel: t("nav.language"),
  };

  return <HeaderInteractive copy={copy} />;
}
