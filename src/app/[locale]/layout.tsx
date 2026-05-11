import type { Metadata } from "next";
import { I18nProvider } from "next-i18next/client";
import { getResources, getT } from "next-i18next/server";
import { assertLocale } from "@/i18n/assert-locale";
import { LocaleProvider } from "@/i18n/locale-context";
import { getT as getTForMeta } from "@/i18n/server";
import { defaultLocale, locales } from "@/i18n/settings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = assertLocale((await params).locale);

  const { t } = await getTForMeta(locale);
  const siteName = t("seo.siteName");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = assertLocale((await params).locale);

  const { i18n } = await getT("common", { lng: locale });
  const resources = getResources(i18n, ["common"]);

  return (
    <I18nProvider
      language={locale}
      resources={resources}
      supportedLngs={[...locales]}
      fallbackLng={defaultLocale}
      defaultNS="common"
    >
      <LocaleProvider locale={locale}>{children}</LocaleProvider>
    </I18nProvider>
  );
}
