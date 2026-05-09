import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getLyricPaletteApiBaseUrl } from "@/shared/config/lyric-palette-api-base-url";

export const lyricPaletteBaseQuery = fetchBaseQuery({
  baseUrl: getLyricPaletteApiBaseUrl(),
});
