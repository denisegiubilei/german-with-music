import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SongDetailView } from "@/features/song/song-detail/SongDetailView";
import { assertLocale } from "@/i18n/assert-locale";
import { getT } from "@/i18n/server";
import { MarketingShell } from "@/layouts/marketing-shell/MarketingShell";
import { alternatesForPath } from "@/lib/page-metadata";
import { isLikelyYoutubeReleaseId } from "@/lib/youtube-release-id";
import {
  fetchYoutubeReleaseById,
  getYoutubeReleaseNeighborIds,
} from "@/integrations/lyric-palette/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, id } = await params;
  const locale = assertLocale(localeParam);

  if (!isLikelyYoutubeReleaseId(id)) {
    const { t } = await getT(locale);
    return { title: t("songPage.notFoundTitle") };
  }

  const release = await fetchYoutubeReleaseById(id);
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
    ...(alternatesForPath(`/song/${id}`, locale) ?? {}),
  };
}

export default async function SongByIdPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeParam, id } = await params;
  const locale = assertLocale(localeParam);

  if (!isLikelyYoutubeReleaseId(id)) {
    notFound();
  }

  const release = await fetchYoutubeReleaseById(id);
  if (!release) {
    notFound();
  }

  const neighbors = await getYoutubeReleaseNeighborIds(id);

  return (
    <MarketingShell>
      <SongDetailView
        release={release}
        locale={locale}
        neighborPrevId={neighbors.prevId}
        neighborNextId={neighbors.nextId}
      />
    </MarketingShell>
  );
}
