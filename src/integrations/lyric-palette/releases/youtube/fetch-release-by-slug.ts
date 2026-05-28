import { cache } from "react";
import type {
  YoutubeRelease,
  YoutubeReleaseDetailResponse,
} from "@/entities/youtube-release";
import { lyricPaletteGetJson } from "../../http/fetch-json";
import { getYoutubeReleaseBySlugRequestPath } from "./release-by-slug-path";

const YOUTUBE_RELEASE_DETAIL_REVALIDATE_SECONDS = 300;

async function fetchYoutubeReleaseBySlugUncached(
  slug: string,
): Promise<YoutubeRelease | null> {
  const path = getYoutubeReleaseBySlugRequestPath(slug);
  const body = await lyricPaletteGetJson<YoutubeReleaseDetailResponse>(path, {
    next: { revalidate: YOUTUBE_RELEASE_DETAIL_REVALIDATE_SECONDS },
  });
  return body?.data ?? null;
}

/** Dedupes `generateMetadata` + page for the same `slug` in one RSC tree. */
export const fetchYoutubeReleaseBySlug = cache(fetchYoutubeReleaseBySlugUncached);
