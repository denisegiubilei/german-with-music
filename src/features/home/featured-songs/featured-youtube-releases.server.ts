import type { YoutubeReleasesListResponse } from "@/entities/youtube-release";
import { fetchYoutubeReleases } from "@/integrations/lyric-palette/server";

export const FEATURED_YOUTUBE_RELEASES_PAGE_SIZE = 4;

export async function getFeaturedYoutubeReleasesForHome(): Promise<YoutubeReleasesListResponse | null> {
  return fetchYoutubeReleases({
    featured: true,
    artist: "LERNIKA",
    page: 1,
    pageSize: FEATURED_YOUTUBE_RELEASES_PAGE_SIZE,
  });
}
