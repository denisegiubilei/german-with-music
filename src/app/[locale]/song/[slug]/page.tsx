import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SongDetailView } from "@/features/song/SongDetailView";
import { assertLocale } from "@/i18n/assert-locale";
import { getT } from "@/i18n/server";
import { MarketingShell } from "@/layouts/marketing-shell/MarketingShell";
import { alternatesForPath } from "@/lib/page-metadata";
import { isLikelyYoutubeReleaseSlug } from "@/lib/youtube-release-slug";
import {
  fetchYoutubeReleaseBySlug,
  getYoutubeReleaseNeighborSlugs,
} from "@/integrations/lyric-palette/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = assertLocale(localeParam);

  if (!isLikelyYoutubeReleaseSlug(slug)) {
    const { t } = await getT(locale);
    return { title: t("songPage.notFoundTitle") };
  }

  const release = await fetchYoutubeReleaseBySlug(slug);
  const { t } = await getT(locale);
  const siteName = t("seo.siteName");

  if (!release) {
    return { title: t("songPage.notFoundTitle") };
  }

  const artist = release.artist?.trim() ? release.artist : "";
  const titleTag = artist
    ? `${release.title} — ${artist} | ${siteName}`
    : `${release.title} | ${siteName}`;
  const description =
    release.glossary?.trim() ?? t("songPage.metaDescriptionFallback");

  return {
    title: titleTag,
    description,
    openGraph: {
      type: "website",
      siteName,
      title: release.title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: release.title,
      description,
    },
    ...(alternatesForPath(`/song/${slug}`, locale) ?? {}),
  };
}

export default async function SongBySlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = assertLocale(localeParam);

  if (!isLikelyYoutubeReleaseSlug(slug)) {
    notFound();
  }

  const release = await fetchYoutubeReleaseBySlug(slug);
  if (!release) {
    notFound();
  }

  const neighbors = await getYoutubeReleaseNeighborSlugs(slug);

  return (
    <MarketingShell>
      <SongDetailView
        release={release}
        locale={locale}
        neighborPrevSlug={neighbors.prevSlug}
        neighborNextSlug={neighbors.nextSlug}
      />
    </MarketingShell>
  );
}
