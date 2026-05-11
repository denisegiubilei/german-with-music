import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  GetYoutubeReleasesQueryArgs,
  YoutubeRelease,
  YoutubeReleaseDetailResponse,
  YoutubeReleasesListResponse,
} from "@/entities/youtube-release";
import { getYoutubeReleaseByIdRequestPath } from "../releases/youtube/release-by-id-path";
import { getYoutubeReleasesRequestPath } from "../releases/youtube/request-path";
import { lyricPaletteBaseQuery } from "./base-query";

export const lyricPaletteApi = createApi({
  reducerPath: "lyricPaletteApi",
  baseQuery: lyricPaletteBaseQuery,
  endpoints: (build) => ({
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
  }),
});

export const { useGetYoutubeReleaseByIdQuery, useGetYoutubeReleasesQuery } =
  lyricPaletteApi;
