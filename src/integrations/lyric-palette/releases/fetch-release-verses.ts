import { cache } from "react";
import type {
  ReleaseVersesPayload,
  ReleaseVersesResponse,
} from "@/entities/youtube-release";
import { lyricPaletteGetJson } from "../http/fetch-json";
import { getReleaseVersesRequestPath } from "./release-verses-path";

const RELEASE_VERSES_REVALIDATE_SECONDS = 300;

async function fetchReleaseVersesUncached(
  slug: string,
): Promise<ReleaseVersesPayload | null> {
  const path = getReleaseVersesRequestPath(slug);
  const body = await lyricPaletteGetJson<ReleaseVersesResponse>(path, {
    next: { revalidate: RELEASE_VERSES_REVALIDATE_SECONDS },
  });
  return body?.data ?? null;
}

/** Dedupes repeated fetches for the same `slug` in one RSC tree. */
export const fetchReleaseVerses = cache(fetchReleaseVersesUncached);
