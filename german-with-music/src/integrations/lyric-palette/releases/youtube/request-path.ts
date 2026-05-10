import type { GetYoutubeReleasesQueryArgs } from "@/entities/youtube-release";

/** Path + query string for `GET /releases/youtube` (no leading slash). */
export function getYoutubeReleasesRequestPath(
  args?: GetYoutubeReleasesQueryArgs | void,
): string {
  const params = new URLSearchParams();
  if (args?.page != null && args.page >= 1) {
    params.set("page", String(args.page));
  }
  if (args?.pageSize != null) {
    params.set("pageSize", String(args.pageSize));
  }
  if (args?.artist) params.set("artist", args.artist);
  if (args?.title) params.set("title", args.title);
  if (args?.glossary) params.set("glossary", args.glossary);
  if (typeof args?.featured === "boolean") {
    params.set("featured", String(args.featured));
  }
  const qs = params.toString();
  return qs ? `releases/youtube?${qs}` : "releases/youtube";
}
