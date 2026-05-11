import type {
  GetYoutubeReleasesQueryArgs,
  YoutubeReleasesListResponse,
} from "@/entities/youtube-release";
import { lyricPaletteGetJson } from "../../http/fetch-json";
import { getYoutubeReleasesRequestPath } from "./request-path";

/** Default `fetch` cache revalidate (seconds) for `GET /releases/youtube` in RSC. */
export const YOUTUBE_RELEASES_LIST_REVALIDATE_SECONDS = 120;

export async function fetchYoutubeReleases(
  args?: GetYoutubeReleasesQueryArgs | void,
): Promise<YoutubeReleasesListResponse | null> {
  const path = getYoutubeReleasesRequestPath(args);
  return lyricPaletteGetJson<YoutubeReleasesListResponse>(path, {
    next: { revalidate: YOUTUBE_RELEASES_LIST_REVALIDATE_SECONDS },
  });
}
