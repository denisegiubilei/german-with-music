import { cache } from "react";
import type { YoutubeRelease } from "@/entities/youtube-release";
import { fetchYoutubeReleases } from "./fetch-releases";

const LIST_PAGE_SIZE = 100;

const fetchAllPublicYoutubeReleasesOrdered = cache(
  async (): Promise<YoutubeRelease[] | null> => {
    const first = await fetchYoutubeReleases({
      page: 1,
      pageSize: LIST_PAGE_SIZE,
    });
    if (!first) {
      return null;
    }

    const { totalPages } = first.meta;
    if (totalPages <= 1) {
      return first.data;
    }

    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        fetchYoutubeReleases({
          page: i + 2,
          pageSize: LIST_PAGE_SIZE,
        }),
      ),
    );

    const combined = [...first.data];
    for (const page of rest) {
      if (page?.data?.length) {
        combined.push(...page.data);
      }
    }
    return combined;
  },
);

/**
 * Adjacent release ids in `GET /releases/youtube` order (newest `datePublished` first).
 * Prev = newer neighbor; next = older neighbor.
 */
export async function getYoutubeReleaseNeighborIds(
  releaseId: string,
): Promise<{ prevId: string | null; nextId: string | null }> {
  const all = await fetchAllPublicYoutubeReleasesOrdered();
  if (!all?.length) {
    return { prevId: null, nextId: null };
  }

  const idx = all.findIndex((r) => r.id === releaseId);
  if (idx < 0) {
    return { prevId: null, nextId: null };
  }

  return {
    prevId: idx > 0 ? all[idx - 1]!.id : null,
    nextId: idx < all.length - 1 ? all[idx + 1]!.id : null,
  };
}
