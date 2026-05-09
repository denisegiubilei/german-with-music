import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  GetYoutubeReleasesQueryArgs,
  YoutubeReleasesListResponse,
} from "@/entities/youtube-release";
import { lyricPaletteBaseQuery } from "./base-query";

export const lyricPaletteApi = createApi({
  reducerPath: "lyricPaletteApi",
  baseQuery: lyricPaletteBaseQuery,
  endpoints: (build) => ({
    getYoutubeReleases: build.query<
      YoutubeReleasesListResponse,
      GetYoutubeReleasesQueryArgs | void
    >({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.page != null && args.page >= 1) {
          params.set("page", String(args.page));
        }
        if (args?.pageSize != null) {
          params.set("pageSize", String(args.pageSize));
        }
        if (args?.artist) params.set("artist", args.artist);
        if (args?.title) params.set("title", args.title);
        if (args?.glossary) params.set("glossary", args.glossary);
        if (typeof args?.featured === "boolean") {
          params.set("featured", String(args.featured));
        }
        const qs = params.toString();
        return qs ? `releases/youtube?${qs}` : "releases/youtube";
      },
      transformResponse: (response: YoutubeReleasesListResponse) =>
        response,
    }),
  }),
});

export const { useGetYoutubeReleasesQuery } = lyricPaletteApi;
