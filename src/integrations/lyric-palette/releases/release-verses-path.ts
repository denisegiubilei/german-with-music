/** Path for `GET /releases/:slug/verses` (no leading slash). */
export function getReleaseVersesRequestPath(slug: string): string {
  return `releases/${encodeURIComponent(slug)}/verses`;
}
