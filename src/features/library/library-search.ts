import type { GetYoutubeReleasesQueryArgs } from "@/entities/youtube-release";

export const LIBRARY_PAGE_SIZE = 10;

export type LibrarySearchState = {
  page: number;
  artist: string;
  title: string;
};

function firstString(
  value: string | string[] | undefined,
): string | undefined {
  if (value === undefined) return undefined;
  const s = Array.isArray(value) ? value[0] : value;
  return typeof s === "string" ? s : undefined;
}

export function parseLibrarySearchParams(
  sp: Record<string, string | string[] | undefined>,
): LibrarySearchState {
  const artistRaw = firstString(sp.artist)?.trim() ?? "";
  const titleRaw = firstString(sp.title)?.trim() ?? "";
  const pageRaw = firstString(sp.page);
  const pageParsed = pageRaw ? Number.parseInt(pageRaw, 10) : 1;
  const page =
    Number.isFinite(pageParsed) && pageParsed >= 1 ? pageParsed : 1;
  return { page, artist: artistRaw, title: titleRaw };
}

export function librarySearchToApiArgs(
  state: LibrarySearchState,
): GetYoutubeReleasesQueryArgs {
  return {
    page: state.page,
    pageSize: LIBRARY_PAGE_SIZE,
    ...(state.artist ? { artist: state.artist } : {}),
    ...(state.title ? { title: state.title } : {}),
  };
}

export function serializeLibrarySearchParams(state: LibrarySearchState): string {
  const params = new URLSearchParams();
  if (state.artist) params.set("artist", state.artist);
  if (state.title) params.set("title", state.title);
  if (state.page > 1) params.set("page", String(state.page));
  return params.toString();
}
