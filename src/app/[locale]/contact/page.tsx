import type { Metadata } from "next";
import { LocalizedLink } from "@/components/localized-link/LocalizedLink";
import { assertLocale } from "@/i18n/assert-locale";
import { getT, getTForRequest } from "@/i18n/server";
import { MarketingShell } from "@/layouts/marketing-shell/MarketingShell";
import { alternatesForPath } from "@/lib/page-metadata";
import { SUPPORT_EMAIL } from "@/lib/support-email";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = assertLocale((await params).locale);

  const { t } = await getT(locale);
  const siteName = t("seo.siteName");
  const pageTitle = t("contact.title");
  const description = t("seo.contact.description");
  const keywords = t("seo.contact.keywords", {
    returnObjects: true,
  }) as string[];
  const openGraphDescription = t("seo.contact.openGraphDescription");
  const twitterDescription = t("seo.contact.twitterDescription");

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
    ...(alternatesForPath("/contact", locale) ?? {}),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  assertLocale((await params).locale);

  const { t } = await getTForRequest();

  return (
    <MarketingShell>
      <div className="container py-5">
        <article className="mx-auto" style={{ maxWidth: "42rem" }}>
          <nav aria-label={t("about.breadcrumbLabel")}>
            <ol className="breadcrumb mb-4">
              <li className="breadcrumb-item">
                <LocalizedLink href="/">{t("about.breadcrumbHome")}</LocalizedLink>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t("contact.title")}
              </li>
            </ol>
          </nav>

          <h1 className="h2 mb-4">{t("contact.title")}</h1>
        <p className="text-body-secondary mb-4">{t("contact.intro")}</p>
        <dl className="mb-4">
          <dt className="small text-body-secondary fw-semibold text-uppercase mb-1">
            {t("contact.emailLabel")}
          </dt>
          <dd className="mb-0">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="link-warning text-decoration-none"
            >
              {SUPPORT_EMAIL}
            </a>
          </dd>
        </dl>
        </article>
      </div>
    </MarketingShell>
  );
}
