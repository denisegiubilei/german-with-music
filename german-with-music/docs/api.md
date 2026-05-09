```markdown
## GET `/releases/youtube`

List all releases tagged `youtube` across all projects, newest `datePublished` first, paginated. Each item is a flat projection that mixes project and version fields.

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
      "featured": false
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
- `artist`, `lang`, and `glossary` may be `null` when not set on the underlying project/config/video description.
- `featured` is a boolean (defaults to `false`); manage it via `PUT /releases/:releaseId` or `PUT /versions/:versionId/release`.
- Only releases with `tag = "youtube"` are returned. Use `GET /projects/:projectId/releases` to see all releases for one project regardless of tag.
```

