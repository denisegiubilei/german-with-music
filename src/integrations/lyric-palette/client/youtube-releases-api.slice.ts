import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  GetYoutubeReleasesQueryArgs,
  ReleaseFlashCardsPayload,
  ReleaseFlashCardsResponse,
  YoutubeRelease,
  YoutubeReleaseDetailResponse,
  YoutubeReleasesListResponse,
} from "@/entities/youtube-release";
import type { UpdateProfileRequest, User } from "@/entities/user";
import { setCredentials } from "@/features/auth";
import type { RootState } from "@/store";
import { getReleaseFlashCardsRequestPath } from "../releases/release-flash-cards-path";
import { getYoutubeReleaseBySlugRequestPath } from "../releases/youtube/release-by-slug-path";
import { getYoutubeReleasesRequestPath } from "../releases/youtube/request-path";
import { authenticatedBaseQuery } from "./base-query";

export const lyricPaletteApi = createApi({
  reducerPath: "lyricPaletteApi",
  baseQuery: authenticatedBaseQuery,
  tagTypes: ["Me"],
  endpoints: (build) => ({
    getMe: build.query<User, void>({
      query: () => "/auth/me",
      transformResponse: (response: { data: User }) => response.data,
      providesTags: ["Me"],
    }),
    updateMe: build.mutation<User, UpdateProfileRequest>({
      query: (body) => ({
        url: "/auth/me",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: { data: User }) => response.data,
      invalidatesTags: ["Me"],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled, getState }) => {
        try {
          const { data: updatedUser } = await queryFulfilled;
          const accessToken = (getState() as RootState).auth.accessToken;
          if (accessToken) {
            dispatch(setCredentials({ user: updatedUser, accessToken }));
          }
        } catch {
          // credentials unchanged on failure
        }
      },
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
  useUpdateMeMutation,
  useGetReleaseFlashCardsQuery,
  useGetYoutubeReleaseBySlugQuery,
  useGetYoutubeReleasesQuery,
} = lyricPaletteApi;
