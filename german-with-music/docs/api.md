# Lyric Pallete API — Public

Base URL: `http://localhost:3000/api`

These are the read-only, consumer-facing endpoints served by `controllers/public/song.controller.ts`. They expose the catalog of published youtube releases with a flat per-item shape that mixes project and version fields. Admin endpoints (CRUD for projects, versions, translations, video descriptions, generic release records, etc.) live in [`api.admin.md`](./api.admin.md).

## Visibility rules

These endpoints only return rows where `tag = "youtube"` and `public = true` on the underlying record in `releases`. A non-public or non-youtube release is excluded from the list (and from `meta.total`) and returns `404` from the detail endpoint, even if its id is known.

In addition, the **list** endpoint also hides rows whose `datePublished > now` (server time), so future-scheduled videos don't leak into the public catalog. The **detail** endpoint does not currently apply that gate — see the per-endpoint notes below.

## Common Response Formats

### Success

`{ "data": <payload> }`

For paginated endpoints the response also includes a `meta` object.

### Error

- `400` validation errors (Zod):
  ```json
  {
    "status": "error",
    "message": "Validation error",
    "issues": { "formErrors": [], "fieldErrors": {} }
  }
  ```
- `404` not found:
  ```json
  { "status": "error", "message": "Youtube release not found" }
  ```
- `500` internal error:
  ```json
  {
    "status": "error",
    "message": "Internal server error"
  }
  ```

## Endpoints

## GET `/releases/youtube`

List all published youtube releases across all projects, newest `datePublished` first, paginated. Each item is a flat projection that mixes project and version fields.

**Query params**

| Name | Type | Default | Notes |
|------|------|---------|--------|
| `page` | integer | `1` | 1-based page index, minimum `1` |
| `pageSize` | integer | `20` | Items per page, `1` to `100`. `page_size` is also accepted. |
| `artist` | string | — | Optional case-insensitive substring on the project artist |
| `title` | string | — | Optional case-insensitive substring on the project title (the song title) |
| `glossary` | string | — | Optional case-insensitive substring on the released version's `videoDescription.glossary` |
| `featured` | boolean | — | Optional. `true`/`1` returns only featured releases, `false`/`0` returns only non-featured. Omit to include both. |

**Examples**

- `GET /releases/youtube`
- `GET /releases/youtube?page=2&pageSize=10`
- `GET /releases/youtube?artist=kraft&title=liam`
- `GET /releases/youtube?glossary=montag`
- `GET /releases/youtube?featured=true`

**Response:** `200`
```json
{
  "data": [
    {
      "id": "UUID",
      "url": "https://youtube.com/watch?v=...",
      "artist": "Artist name",
      "title": "Example Song title",
      "lang": "en",
      "glossary": "glossary text",
      "featured": false,
      "public": true
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

Notes:
- `artist`, `lang`, and `glossary` may be `null` when not set on the underlying project / config / video description.
- `featured` is a boolean (defaults to `false`); manage it through the admin PUT endpoints.
- `public` is always `true` here — non-public releases are filtered out. Toggle the flag from the admin endpoints; it ships back in the response so the consumer can see the gate is set.
- Future-scheduled releases (`datePublished > now`) are excluded from both `data` and `total`.
- Only releases tagged `youtube` are returned; `shorts` are not.

## GET `/releases/youtube/:releaseId`

Get a single published youtube release by its UUID, using the same flat projection as the list above.

**Response:** `200`
```json
{
  "data": {
    "id": "UUID",
    "url": "https://youtube.com/watch?v=...",
    "artist": "Artist name",
    "title": "Example Song title",
    "lang": "en",
    "glossary": "glossary text",
    "featured": false,
    "public": true
  }
}
```

`404 Youtube release not found` is returned when the release does not exist, is not tagged `youtube`, or has `public = false`. The three cases are deliberately collapsed to the same status so the public endpoint never reveals private metadata.

Unlike the list endpoint, this endpoint does **not** currently filter by `datePublished <= now` — a future-scheduled but `public: true` release can still be fetched here by id. If you need that gate, ask and the service can be tightened to match the list.
