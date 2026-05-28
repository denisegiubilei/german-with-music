import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  GetYoutubeReleasesQueryArgs,
  ReleaseFlashCardsPayload,
  ReleaseFlashCardsResponse,
  YoutubeRelease,
  YoutubeReleaseDetailResponse,
  YoutubeReleasesListResponse,
} from "@/entities/youtube-release";
import type { User } from "@/entities/user";
import { getReleaseFlashCardsRequestPath } from "../releases/release-flash-cards-path";
import { getYoutubeReleaseBySlugRequestPath } from "../releases/youtube/release-by-slug-path";
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
    getYoutubeReleaseBySlug: build.query<YoutubeRelease, string>({
      query: (slug) => getYoutubeReleaseBySlugRequestPath(slug),
      transformResponse: (response: YoutubeReleaseDetailResponse) =>
        response.data,
    }),
    getReleaseFlashCards: build.query<ReleaseFlashCardsPayload, string>({
      query: (slug) => getReleaseFlashCardsRequestPath(slug),
      transformResponse: (response: ReleaseFlashCardsResponse) => response.data,
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetReleaseFlashCardsQuery,
  useGetYoutubeReleaseBySlugQuery,
  useGetYoutubeReleasesQuery,
} = lyricPaletteApi;
