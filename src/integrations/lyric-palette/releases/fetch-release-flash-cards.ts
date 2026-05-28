import { cache } from "react";
import type {
  ReleaseFlashCardsPayload,
  ReleaseFlashCardsResponse,
} from "@/entities/youtube-release";
import { lyricPaletteGetJson } from "../http/fetch-json";
import { getReleaseFlashCardsRequestPath } from "./release-flash-cards-path";

const RELEASE_FLASH_CARDS_REVALIDATE_SECONDS = 300;

async function fetchReleaseFlashCardsUncached(
  slug: string,
): Promise<ReleaseFlashCardsPayload | null> {
  const path = getReleaseFlashCardsRequestPath(slug);
  const body = await lyricPaletteGetJson<ReleaseFlashCardsResponse>(path, {
    next: { revalidate: RELEASE_FLASH_CARDS_REVALIDATE_SECONDS },
  });
  return body?.data ?? null;
}

/** Dedupes repeated fetches for the same `slug` in one RSC tree. */
export const fetchReleaseFlashCards = cache(fetchReleaseFlashCardsUncached);
