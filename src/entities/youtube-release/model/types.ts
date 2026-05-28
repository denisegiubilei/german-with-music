/** Row from `GET /releases/youtube` — see docs/api.md. */
export interface YoutubeRelease {
  slug: string;
  url: string;
  artist: string | null;
  title: string;
  lang: string | null;
  wordClassification: string;
  glossary: string | null;
  featured: boolean;
  public: boolean;
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

/** Translation row on `GET /releases/:releaseSlug/cards` — see docs/api.md. */
export interface ReleaseFlashCardTranslation {
  lang: string;
  translation: string;
  verseTranslation: string;
}

/** One flash card from `GET /releases/:releaseSlug/cards` — see docs/api.md. */
export interface ReleaseFlashCard {
  content: string;
  number: number;
  verse: string;
  code: number;
  translations: ReleaseFlashCardTranslation[];
}

/** Payload inside `data` for `GET /releases/:releaseSlug/cards`. */
export interface ReleaseFlashCardsPayload {
  slug: string;
  cards: ReleaseFlashCard[];
}

export interface ReleaseFlashCardsResponse {
  data: ReleaseFlashCardsPayload;
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
