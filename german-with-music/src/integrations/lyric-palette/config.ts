/** Base URL for Lyric Palette JSON API (`docs/api.md`), without trailing slash. */
export function getLyricPaletteApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_LYRIC_PALETTE_API_BASE_URL ??
    "http://localhost:3000/api"
  );
}
