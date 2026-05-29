import type { YoutubeRelease } from "@/entities/youtube-release";

type SongSeoTranslator = (
  key: string,
  options?: Record<string, unknown>,
) => string;

export function songPageTitle(release: YoutubeRelease): string {
  const title = release.title.trim();
  const artist = release.artist?.trim();
  return artist ? `${title} — ${artist}` : title;
}

export function songPageDescription(
  release: YoutubeRelease,
  t: SongSeoTranslator,
): string {
  const title = release.title.trim();
  const artist = release.artist?.trim();
  if (artist) {
    return t("songPage.metaDescription", { title, artist });
  }
  return t("songPage.metaDescriptionNoArtist", { title });
}

export function songPageKeywords(
  release: YoutubeRelease,
  t: SongSeoTranslator,
): string[] {
  const base = t("songPage.metaKeywords", { returnObjects: true });
  const baseKeywords = Array.isArray(base) ? (base as string[]) : [];
  const title = release.title.trim();
  const artist = release.artist?.trim();
  const dynamic = [
    title,
    ...(artist ? [artist, `${title} ${artist}`, `${artist} lyrics`] : []),
  ];
  return [...new Set([...dynamic, ...baseKeywords])];
}
