import { getTForRequest } from "@/i18n/server";
import { HeaderInteractive } from "./HeaderInteractive";

export type { HeaderCopy } from "./header-copy";

export async function Header() {
  const { t } = await getTForRequest();
  const copy = {
    brand: t("brand"),
    navSongs: t("nav.songs"),
    navLibrary: t("nav.library"),
    navHowItWorks: t("nav.howItWorks"),
    navStart: t("nav.start"),
    languageAriaLabel: t("nav.language"),
    themeAriaLabel: t("nav.themeAriaLabel"),
  };

  return <HeaderInteractive copy={copy} />;
}
