/** Path for `GET /releases/youtube/:releaseId` (no leading slash). */
export function getYoutubeReleaseByIdRequestPath(releaseId: string): string {
  return `releases/youtube/${encodeURIComponent(releaseId)}`;
}
