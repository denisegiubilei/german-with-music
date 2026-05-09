/** Extract YouTube video id from common watch / embed URLs. */
export function extractYoutubeVideoId(input: string): string | null {
  try {
    const u = new URL(input);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ?? null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.slice("/embed/".length).split("/")[0] || null;
      }
      if (u.pathname === "/watch") {
        return u.searchParams.get("v");
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function youtubeWatchUrlToEmbedUrl(watchUrl: string): string | null {
  const id = extractYoutubeVideoId(watchUrl);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
