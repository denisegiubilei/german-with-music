/** Path for `GET /releases/:releaseId/verses` (no leading slash). */
export function getReleaseVersesRequestPath(releaseId: string): string {
  return `releases/${encodeURIComponent(releaseId)}/verses`;
}
