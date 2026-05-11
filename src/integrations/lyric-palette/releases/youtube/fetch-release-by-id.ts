import { cache } from "react";
import type {
  YoutubeRelease,
  YoutubeReleaseDetailResponse,
} from "@/entities/youtube-release";
import { lyricPaletteGetJson } from "../../http/fetch-json";
import { getYoutubeReleaseByIdRequestPath } from "./release-by-id-path";

const YOUTUBE_RELEASE_DETAIL_REVALIDATE_SECONDS = 300;

async function fetchYoutubeReleaseByIdUncached(
  releaseId: string,
): Promise<YoutubeRelease | null> {
  const path = getYoutubeReleaseByIdRequestPath(releaseId);
  const body = await lyricPaletteGetJson<YoutubeReleaseDetailResponse>(path, {
    next: { revalidate: YOUTUBE_RELEASE_DETAIL_REVALIDATE_SECONDS },
  });
  return body?.data ?? null;
}

/** Dedupes `generateMetadata` + page for the same `releaseId` in one RSC tree. */
export const fetchYoutubeReleaseById = cache(fetchYoutubeReleaseByIdUncached);
