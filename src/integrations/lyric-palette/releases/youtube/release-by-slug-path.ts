/** Path for `GET /releases/youtube/:slug` (no leading slash). */
export function getYoutubeReleaseBySlugRequestPath(slug: string): string {
  return `releases/youtube/${encodeURIComponent(slug)}`;
}
