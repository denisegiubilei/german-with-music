import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SongDetailView } from "@/features/song/SongDetailView";
import { assertLocale } from "@/i18n/assert-locale";
import type { Locale } from "@/i18n/settings";
import { getT } from "@/i18n/server";
import { MarketingShell } from "@/layouts/marketing-shell/MarketingShell";
import { canonicalForLocale } from "@/lib/hreflang";
import { alternatesForPath } from "@/lib/page-metadata";
import {
  songPageDescription,
  songPageKeywords,
  songPageTitle,
} from "@/lib/song-page-seo";
import { buildSongPageJsonLd } from "@/lib/structured-data/song-page-json-ld";
import { isLikelyYoutubeReleaseSlug } from "@/lib/youtube-release-slug";
import {
  fetchYoutubeReleaseBySlug,
  getYoutubeReleaseNeighborSlugs,
} from "@/integrations/lyric-palette/server";
import { youtubeWatchUrlToEmbedUrl, youtubeWatchUrlToThumbnailUrl } from "@/shared/lib/youtube";

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

  const pageTitle = songPageTitle(release);
  const description = songPageDescription(release, t);
  const keywords = songPageKeywords(release, t);
  const canonical = canonicalForLocale(`/song/${slug}`, locale);
  const thumbnail = youtubeWatchUrlToThumbnailUrl(release.url);
  const embedUrl = youtubeWatchUrlToEmbedUrl(release.url);

  return {
    title: pageTitle,
    description,
    keywords,
    openGraph: {
      type: embedUrl ? "video.other" : "website",
      siteName,
      title: pageTitle,
      description,
      ...(canonical ? { url: canonical } : {}),
      ...(thumbnail
        ? {
            images: [
              {
                url: thumbnail,
                width: 480,
                height: 360,
                alt: pageTitle,
              },
            ],
          }
        : {}),
      ...(embedUrl ? { videos: [{ url: embedUrl }] } : {}),
    },
    twitter: {
      card: thumbnail ? "summary_large_image" : "summary",
      title: pageTitle,
      description,
      ...(thumbnail ? { images: [thumbnail] } : {}),
    },
    ...(alternatesForPath(`/song/${slug}`, locale) ?? {}),
  };
}

function SongPageJsonLd({
  locale,
  release,
  pageName,
  pageDescription,
  siteName,
  breadcrumbHomeName,
  breadcrumbLibraryName,
}: {
  locale: Locale;
  release: NonNullable<Awaited<ReturnType<typeof fetchYoutubeReleaseBySlug>>>;
  pageName: string;
  pageDescription: string;
  siteName: string;
  breadcrumbHomeName: string;
  breadcrumbLibraryName: string;
}) {
  const jsonLd = buildSongPageJsonLd({
    locale,
    release,
    pageName,
    pageDescription,
    siteName,
    breadcrumbHomeName,
    breadcrumbLibraryName,
  });
  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
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
  const { t } = await getT(locale);
  const pageTitle = songPageTitle(release);

  return (
    <MarketingShell>
      <SongPageJsonLd
        locale={locale}
        release={release}
        pageName={pageTitle}
        pageDescription={songPageDescription(release, t)}
        siteName={t("seo.siteName")}
        breadcrumbHomeName={t("about.breadcrumbHome")}
        breadcrumbLibraryName={t("nav.library")}
      />
      <SongDetailView
        release={release}
        locale={locale}
        neighborPrevSlug={neighbors.prevSlug}
        neighborNextSlug={neighbors.nextSlug}
      />
    </MarketingShell>
  );
}
