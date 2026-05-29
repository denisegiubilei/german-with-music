import type { YoutubeRelease } from "@/entities/youtube-release";
import type { Locale } from "@/i18n/settings";
import { canonicalForLocale } from "@/lib/hreflang";
import {
  youtubeWatchUrlToEmbedUrl,
  youtubeWatchUrlToThumbnailUrl,
} from "@/shared/lib/youtube";

type SongPageJsonLdInput = {
  locale: Locale;
  release: YoutubeRelease;
  pageName: string;
  pageDescription: string;
  siteName: string;
  breadcrumbHomeName: string;
  breadcrumbLibraryName: string;
};

/** WebPage + VideoObject + MusicRecording + BreadcrumbList for `/song/[slug]`. */
export function buildSongPageJsonLd({
  locale,
  release,
  pageName,
  pageDescription,
  siteName,
  breadcrumbHomeName,
  breadcrumbLibraryName,
}: SongPageJsonLdInput): object | null {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const pageUrl = canonicalForLocale(`/song/${release.slug}`, locale);
  const homeUrl = canonicalForLocale("/", locale);
  const libraryUrl = canonicalForLocale("/library", locale);
  if (!siteUrl || !pageUrl || !homeUrl || !libraryUrl) return null;

  const thumbnail = youtubeWatchUrlToThumbnailUrl(release.url);
  const embedUrl = youtubeWatchUrlToEmbedUrl(release.url);
  const lyricLanguage = release.lang?.trim() || "de";
  const videoId = `${pageUrl}#video`;
  const recordingId = `${pageUrl}#recording`;

  const graph: object[] = [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: pageName,
      description: pageDescription,
      inLanguage: locale,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteName,
        url: siteUrl,
      },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      ...(release.url
        ? { mainEntity: { "@id": videoId } }
        : release.artist
          ? { mainEntity: { "@id": recordingId } }
          : {}),
      ...(thumbnail
        ? {
            thumbnailUrl: thumbnail,
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: thumbnail,
            },
          }
        : {}),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
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
          name: breadcrumbLibraryName,
          item: libraryUrl,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: pageName,
          item: pageUrl,
        },
      ],
    },
  ];

  if (release.url) {
    graph.push({
      "@type": "VideoObject",
      "@id": videoId,
      name: release.title,
      description: pageDescription,
      contentUrl: release.url,
      ...(embedUrl ? { embedUrl } : {}),
      ...(thumbnail ? { thumbnailUrl: [thumbnail] } : {}),
      inLanguage: lyricLanguage,
      ...(release.artist
        ? { creator: { "@type": "Person", name: release.artist } }
        : {}),
    });
  }

  if (release.artist) {
    graph.push({
      "@type": "MusicRecording",
      "@id": recordingId,
      name: release.title,
      byArtist: { "@type": "MusicGroup", name: release.artist },
      inLanguage: lyricLanguage,
      ...(release.url ? { url: release.url } : {}),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
