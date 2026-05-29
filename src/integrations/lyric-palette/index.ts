/** Client-safe Lyric Palette exports (RTK, config, request path). Do not import server fetch from here. */
export { lyricPaletteBaseQuery, authenticatedBaseQuery } from "./client/base-query";
export {
  lyricPaletteApi,
  useGetMeQuery,
  useUpdatePasswordMutation,
  useUpdateMeMutation,
  useGetReleaseFlashCardsQuery,
  useGetYoutubeReleaseBySlugQuery,
  useGetYoutubeReleasesQuery,
} from "./client/youtube-releases-api.slice";
export {
  authApi,
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
} from "./client/auth-api.slice";
export { getLyricPaletteApiBaseUrl } from "./config";
export { getReleaseFlashCardsRequestPath } from "./releases/release-flash-cards-path";
export { getYoutubeReleaseBySlugRequestPath } from "./releases/youtube/release-by-slug-path";
export { getYoutubeReleasesRequestPath } from "./releases/youtube/request-path";
