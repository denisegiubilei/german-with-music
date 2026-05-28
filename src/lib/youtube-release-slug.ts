/** Public catalog slug (`GET /releases/youtube/:slug`) — lowercase segments separated by hyphens. */
const RELEASE_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isLikelyYoutubeReleaseSlug(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= 200 && RELEASE_SLUG_RE.test(trimmed);
}
