import type { Metadata } from "next";
import { LocalizedLink } from "@/components/localized-link/LocalizedLink";
import { assertLocale } from "@/i18n/assert-locale";
import { getT, getTForRequest } from "@/i18n/server";
import { MarketingShell } from "@/layouts/marketing-shell/MarketingShell";
import { alternatesForPath } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = assertLocale((await params).locale);

  const { t } = await getT(locale);
  const siteName = t("seo.siteName");
  const pageTitle = t("footer.about");
  const description = t("seo.about.description");
  const keywords = t("seo.about.keywords", { returnObjects: true }) as string[];
  const openGraphDescription = t("seo.about.openGraphDescription");
  const twitterDescription = t("seo.about.twitterDescription");

  return {
    title: pageTitle,
    description,
    keywords: [...keywords],
    openGraph: {
      type: "website",
      siteName,
      title: pageTitle,
      description: openGraphDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: twitterDescription,
    },
    ...(alternatesForPath("/about", locale) ?? {}),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  assertLocale((await params).locale);

  const { t } = await getTForRequest();

  return (
    <MarketingShell>
      <div className="container py-5">
        <h1 className="h2 mb-4">{t("footer.about")}</h1>
        <p className="text-body-secondary mb-4">{t("seo.about.description")}</p>
        <LocalizedLink href="/" className="link-warning">
          {t("brand")}
        </LocalizedLink>
      </div>
    </MarketingShell>
  );
}
