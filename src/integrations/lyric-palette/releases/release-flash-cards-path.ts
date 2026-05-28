/** Path for `GET /releases/:releaseSlug/cards` (no leading slash). */
export function getReleaseFlashCardsRequestPath(slug: string): string {
  return `releases/${encodeURIComponent(slug)}/cards`;
}
