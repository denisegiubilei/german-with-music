import type { Metadata } from "next";
import { LocalizedLink } from "@/components/localized-link/LocalizedLink";
import { assertLocale } from "@/i18n/assert-locale";
import type { Locale } from "@/i18n/settings";
import { getT, getTForRequest } from "@/i18n/server";
import { MarketingShell } from "@/layouts/marketing-shell/MarketingShell";
import { canonicalForLocale } from "@/lib/hreflang";
import { alternatesForPath } from "@/lib/page-metadata";
import { buildAboutPageJsonLd } from "@/lib/structured-data/about-page-json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = assertLocale((await params).locale);

  const { t } = await getT(locale);
  const siteName = t("seo.siteName");
  const pageTitle = t("about.title");
  const description = t("seo.about.description");
  const keywords = t("seo.about.keywords", { returnObjects: true }) as string[];
  const openGraphDescription = t("seo.about.openGraphDescription");
  const twitterDescription = t("seo.about.twitterDescription");
  const canonical = canonicalForLocale("/about", locale);

  return {
    title: pageTitle,
    description,
    keywords: [...keywords],
    openGraph: {
      type: "website",
      siteName,
      title: pageTitle,
      description: openGraphDescription,
      ...(canonical ? { url: canonical } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: twitterDescription,
    },
    ...(alternatesForPath("/about", locale) ?? {}),
  };
}

function AboutPageJsonLd({
  locale,
  pageName,
  pageDescription,
  siteName,
  breadcrumbHomeName,
}: {
  locale: Locale;
  pageName: string;
  pageDescription: string;
  siteName: string;
  breadcrumbHomeName: string;
}) {
  const jsonLd = buildAboutPageJsonLd({
    locale,
    pageName,
    pageDescription,
    siteName,
    breadcrumbHomeName,
  });
  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = assertLocale((await params).locale);

  const { t } = await getTForRequest();
  const offerItems = t("about.offerItems", {
    returnObjects: true,
  }) as string[];

  return (
    <MarketingShell>
      <AboutPageJsonLd
        locale={locale}
        pageName={t("about.title")}
        pageDescription={t("seo.about.description")}
        siteName={t("seo.siteName")}
        breadcrumbHomeName={t("about.breadcrumbHome")}
      />
      <div className="container py-5">
        <article className="mx-auto" style={{ maxWidth: "42rem" }}>
          <nav aria-label={t("about.breadcrumbLabel")}>
            <ol className="breadcrumb mb-4">
              <li className="breadcrumb-item">
                <LocalizedLink href="/">{t("about.breadcrumbHome")}</LocalizedLink>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t("about.title")}
              </li>
            </ol>
          </nav>

          <header className="mb-5">
            <h1 className="h2 fw-bold mb-3">{t("about.title")}</h1>
            <p className="lead text-body-secondary mb-0">{t("about.lead")}</p>
          </header>

          <section className="mb-5" aria-labelledby="about-mission">
            <h2 id="about-mission" className="h4 fw-semibold mb-3">
              {t("about.missionTitle")}
            </h2>
            <p className="text-body-secondary mb-0">{t("about.missionBody")}</p>
          </section>

          <section className="mb-5" aria-labelledby="about-offer">
            <h2 id="about-offer" className="h4 fw-semibold mb-3">
              {t("about.offerTitle")}
            </h2>
            <ul className="text-body-secondary mb-0 ps-3">
              {offerItems.map((item) => (
                <li key={item} className="mb-2">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-5" aria-labelledby="about-audience">
            <h2 id="about-audience" className="h4 fw-semibold mb-3">
              {t("about.audienceTitle")}
            </h2>
            <p className="text-body-secondary mb-0">{t("about.audienceBody")}</p>
          </section>

          <section aria-labelledby="about-explore">
            <h2 id="about-explore" className="h4 fw-semibold mb-3">
              {t("about.exploreTitle")}
            </h2>
            <ul className="list-unstyled d-flex flex-wrap gap-3 mb-0">
              <li>
                <LocalizedLink href="/" className="link-warning">
                  {t("about.exploreHome")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/library" className="link-warning">
                  {t("about.exploreLibrary")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/contact" className="link-warning">
                  {t("about.exploreContact")}
                </LocalizedLink>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </MarketingShell>
  );
}
