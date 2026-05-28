import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  GetYoutubeReleasesQueryArgs,
  ReleaseVersesPayload,
  ReleaseVersesResponse,
  YoutubeRelease,
  YoutubeReleaseDetailResponse,
  YoutubeReleasesListResponse,
} from "@/entities/youtube-release";
import type { User } from "@/entities/user";
import { getReleaseVersesRequestPath } from "../releases/release-verses-path";
import { getYoutubeReleaseByIdRequestPath } from "../releases/youtube/release-by-id-path";
import { getYoutubeReleasesRequestPath } from "../releases/youtube/request-path";
import { authenticatedBaseQuery } from "./base-query";

export const lyricPaletteApi = createApi({
  reducerPath: "lyricPaletteApi",
  baseQuery: authenticatedBaseQuery,
  endpoints: (build) => ({
    getMe: build.query<User, void>({
      query: () => "/auth/me",
      transformResponse: (response: { data: User }) => response.data,
    }),
    getYoutubeReleases: build.query<
      YoutubeReleasesListResponse,
      GetYoutubeReleasesQueryArgs | void
    >({
      query: (args) => getYoutubeReleasesRequestPath(args),
      transformResponse: (response: YoutubeReleasesListResponse) =>
        response,
    }),
    getYoutubeReleaseById: build.query<YoutubeRelease, string>({
      query: (releaseId) => getYoutubeReleaseByIdRequestPath(releaseId),
      transformResponse: (response: YoutubeReleaseDetailResponse) =>
        response.data,
    }),
    getReleaseVerses: build.query<ReleaseVersesPayload, string>({
      query: (releaseId) => getReleaseVersesRequestPath(releaseId),
      transformResponse: (response: ReleaseVersesResponse) => response.data,
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetReleaseVersesQuery,
  useGetYoutubeReleaseByIdQuery,
  useGetYoutubeReleasesQuery,
} = lyricPaletteApi;
