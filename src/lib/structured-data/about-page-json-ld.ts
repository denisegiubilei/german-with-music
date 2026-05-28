import type { Locale } from "@/i18n/settings";
import { canonicalForLocale } from "@/lib/hreflang";

type AboutPageJsonLdInput = {
  locale: Locale;
  pageName: string;
  pageDescription: string;
  siteName: string;
  breadcrumbHomeName: string;
};

/** AboutPage + BreadcrumbList for /about (omit when `NEXT_PUBLIC_SITE_URL` is unset). */
export function buildAboutPageJsonLd({
  locale,
  pageName,
  pageDescription,
  siteName,
  breadcrumbHomeName,
}: AboutPageJsonLdInput): object | null {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const aboutUrl = canonicalForLocale("/about", locale);
  const homeUrl = canonicalForLocale("/", locale);
  if (!siteUrl || !aboutUrl || !homeUrl) return null;

  const inLanguage = locale === "pt-BR" ? "pt-BR" : "en";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${aboutUrl}#aboutpage`,
        name: pageName,
        description: pageDescription,
        url: aboutUrl,
        inLanguage,
        isPartOf: {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          name: siteName,
          url: siteUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: breadcrumbHomeName,
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: pageName,
            item: aboutUrl,
          },
        ],
      },
    ],
  };
}
