import { extractYoutubeVideoId } from "./embed-url";

/** `hqdefault` is available for virtually all uploads; `maxresdefault` often 404s. */
export type YoutubeThumbnailSize =
  | "default"
  | "mqdefault"
  | "hqdefault"
  | "sddefault"
  | "maxresdefault";

/**
 * YouTube static thumbnail URL for a watch / embed / youtu.be / shorts URL.
 * @see https://developers.google.com/youtube/v3/docs/thumbnails
 */
export function youtubeWatchUrlToThumbnailUrl(
  watchUrl: string,
  size: YoutubeThumbnailSize = "hqdefault",
): string | null {
  const id = extractYoutubeVideoId(watchUrl);
  return id ? `https://img.youtube.com/vi/${id}/${size}.jpg` : null;
}
