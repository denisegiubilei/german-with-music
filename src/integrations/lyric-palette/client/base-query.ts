import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getLyricPaletteApiBaseUrl } from "../config";

export const lyricPaletteBaseQuery = fetchBaseQuery({
  baseUrl: getLyricPaletteApiBaseUrl(),
});
