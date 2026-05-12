/** Client-safe Lyric Palette exports (RTK, config, request path). Do not import server fetch from here. */
export { lyricPaletteBaseQuery } from "./client/base-query";
export {
  lyricPaletteApi,
  useGetReleaseVersesQuery,
  useGetYoutubeReleaseByIdQuery,
  useGetYoutubeReleasesQuery,
} from "./client/youtube-releases-api.slice";
export { getLyricPaletteApiBaseUrl } from "./config";
export { getReleaseVersesRequestPath } from "./releases/release-verses-path";
export { getYoutubeReleaseByIdRequestPath } from "./releases/youtube/release-by-id-path";
export { getYoutubeReleasesRequestPath } from "./releases/youtube/request-path";
