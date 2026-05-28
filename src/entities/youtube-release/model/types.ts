/** Row from `GET /releases/youtube` — see docs/api.md. */
export interface YoutubeRelease {
  slug: string;
  url: string;
  artist: string | null;
  title: string;
  lang: string | null;
  glossary: string | null;
  featured: boolean;
}

/** Pagination block on `GET /releases/youtube` — see docs/api.md. */
export interface YoutubeReleasesListMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Success body for `GET /releases/youtube`. */
export interface YoutubeReleasesListResponse {
  data: YoutubeRelease[];
  meta: YoutubeReleasesListMeta;
}

/** Success body for `GET /releases/youtube/:slug`. */
export interface YoutubeReleaseDetailResponse {
  data: YoutubeRelease;
}

/** One verse line from `GET /releases/:slug/verses` — see docs/api.md. */
export interface ReleaseVerseFace {
  text: string;
  words: string[];
}

export interface ReleaseVerseLine {
  verseIndex: number;
  verseIds: number[];
  chorus?: boolean;
  original: ReleaseVerseFace;
  translation: ReleaseVerseFace;
}

/** Payload inside `data` for `GET /releases/:slug/verses`. */
export interface ReleaseVersesPayload {
  slug: string;
  translationLang: string | null;
  verses: ReleaseVerseLine[];
}

export interface ReleaseVersesResponse {
  data: ReleaseVersesPayload;
}

export interface GetYoutubeReleasesQueryArgs {
  /** 1-based; omit for server default (`1`). */
  page?: number;
  /** `1`–`100`; omit for server default (`20`). */
  pageSize?: number;
  artist?: string;
  title?: string;
  glossary?: string;
  /**
   * `true` → only featured; `false` → only non-featured; omit → both.
   * Serialized as `featured=true` / `featured=false`.
   */
  featured?: boolean;
}
