import type { Metadata } from "next";
import { FeaturedSongs } from "@/features/home/featured-songs/FeaturedSongs";
import { HeroSection } from "@/features/home/hero-section/HeroSection";
import { HowItWorks } from "@/features/home/how-it-works/HowItWorks";
import { LyricsSection } from "@/features/home/lyrics-section/LyricsSection";
import { assertLocale } from "@/i18n/assert-locale";
import { getT } from "@/i18n/server";
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
  const titleTagline = t("seo.titleTagline");
  const description = t("seo.description");
  const keywords = t("seo.keywords", { returnObjects: true }) as string[];
  const openGraphDescription = t("seo.openGraphDescription");
  const twitterDescription = t("seo.twitterDescription");
  const defaultTitle = `${siteName} — ${titleTagline}`;

  return {
    title: { absolute: defaultTitle },
    description,
    keywords: [...keywords],
    openGraph: {
      type: "website",
      siteName,
      title: defaultTitle,
      description: openGraphDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: twitterDescription,
    },
    ...(alternatesForPath("/", locale) ?? {}),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  assertLocale((await params).locale);

  return (
    <MarketingShell>
      <HeroSection />
      <FeaturedSongs />
      <HowItWorks />
      <LyricsSection />
    </MarketingShell>
  );
}
