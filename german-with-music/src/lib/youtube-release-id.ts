/** Loose UUID shape for route params (Lyric Palette release ids). */
const RELEASE_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isLikelyYoutubeReleaseId(value: string): boolean {
  return RELEASE_ID_RE.test(value.trim());
}
