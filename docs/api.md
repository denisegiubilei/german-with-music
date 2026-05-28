# Lyric Pallete API — Public

Base URL: `http://localhost:3000/api`

This document covers **unauthenticated** read-only catalog endpoints (`controllers/public/song.controller.ts`) and **authentication** endpoints (`controllers/auth.controller.ts`) used to register, sign in, and read the current session. They do not require an admin account.

The published youtube catalog uses a flat per-item shape that mixes project and version fields. **Admin** endpoints (projects, versions, glossary, user management, etc.) require a valid JWT for an admin account; see [`api.admin.md`](./api.admin.md).

## Authentication

Passwords are stored as bcrypt hashes; responses never include a password field.

Auth uses two tokens:
- **`accessToken`** — short-lived JWT (15 min). Send as `Authorization: Bearer <accessToken>` on protected routes.
- **`refreshToken`** — long-lived opaque token (30 days). Use `POST /auth/refresh` to obtain a new pair. Store securely; never log or expose it.

### POST `/auth/register`

Create a new user. `login` must be a unique email (stored lowercased). `password` is required (minimum 8 characters). `name` is optional.

Rate limited: 20 requests per 15-minute window.

**Response:** `201 Created`
```json
{
  "data": {
    "user": {
      "id": "UUID",
      "login": "user@example.com",
      "name": "Display name or null"
    },
    "accessToken": "<JWT>",
    "refreshToken": "<opaque-token>"
  }
}
```

- `409` with `Login already in use` if `login` is taken.

### POST `/auth/login`

Sign in with `login` (email) and `password`.

Rate limited: 20 requests per 15-minute window.

**Response:** `200 OK` — same shape as register.

- `401` with `Invalid login or password` if credentials are wrong (including unknown email).

### POST `/auth/refresh`

Exchange a valid refresh token for a new access token + refresh token pair. The old refresh token is immediately revoked (rotation). Presenting an already-revoked token revokes the entire token family and forces re-login.

Rate limited: 20 requests per 15-minute window.

**Body**
```json
{ "refreshToken": "<opaque-token>" }
```

**Response:** `200 OK`
```json
{
  "data": {
    "accessToken": "<new-JWT>",
    "refreshToken": "<new-opaque-token>"
  }
}
```

- `401` if the token is not found, already expired, or already revoked (reuse detected).

### POST `/auth/logout`

Revoke a refresh token. Always returns success — use to clean up on sign-out regardless of token state.

**Body**
```json
{ "refreshToken": "<opaque-token>" }
```

**Response:** `200 OK`
```json
{ "data": { "success": true } }
```

### GET `/auth/me`

Returns the current user row from the database using a valid access token.

**Headers**

| Name | Value |
|------|--------|
| `Authorization` | `Bearer <accessToken>` |

**Response:** `200 OK`
```json
{
  "data": {
    "id": "UUID",
    "login": "user@example.com",
    "name": "Display name or null"
  }
}
```

- `401` if the header is missing/invalid, the access token is expired, or the user row no longer exists.

Use the returned `accessToken` as `Authorization: Bearer …` on admin routes only when signed in as an admin; see [`api.admin.md`](./api.admin.md) for how access is enforced.

## Visibility rules

These endpoints only return rows where `tag = "youtube"` and `public = true` on the underlying record in `releases`. A non-public or non-youtube release is excluded from the list (and from `meta.total`) and returns `404` from the detail endpoint, even if its id is known.

In addition, the **list** endpoint also hides rows whose `datePublished > now` (server time), so future-scheduled videos don't leak into the public catalog. The **detail** and **`/releases/:releaseId/verses`** endpoints do not currently apply that gate — see the per-endpoint notes below.

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
- `401` unauthorized (auth endpoints), e.g.:
  ```json
  { "status": "error", "message": "Invalid login or password" }
  ```
- `404` not found:
  ```json
  { "status": "error", "message": "Youtube release not found" }
  ```
- `409` conflict on register:
  ```json
  { "status": "error", "message": "Login already in use" }
  ```
- `500` internal error:
  ```json
  {
    "status": "error",
    "message": "Internal server error"
  }
  ```

## Endpoints

## GET `/health`

Liveness check for load balancers and deploy smoke tests. No authentication.

**Response:** `200 OK` — `{ "status": "ok" }`

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
      "wordClassification": "default",
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
- `wordClassification` is a string from the version’s song config; it defaults to `"default"` and is always present.
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
    "wordClassification": "default",
    "glossary": "glossary text",
    "featured": false,
    "public": true
  }
}
```

`404 Youtube release not found` is returned when the release does not exist, is not tagged `youtube`, or has `public = false`. The three cases are deliberately collapsed to the same status so the public endpoint never reveals private metadata.

Unlike the list endpoint, this endpoint does **not** currently filter by `datePublished <= now` — a future-scheduled but `public: true` release can still be fetched here by id. If you need that gate, ask and the service can be tightened to match the list.

## GET `/releases/:releaseId/verses`

Returns a **random sample** of up to **10** lyric lines from the release’s song version. Each item includes the **original** line (`verses` / source language) and the **translation** for the version’s configured language (`songVersion.config.translationLang` → matching `translations` row). **`text`** is always the **full** line (original from `verses` JSON; translation = all tokens for that `verse` joined in `word_index` order). **`words`** lists only **highlighted** tokens from `original` / translation `content` (same order): `wordLabel` / `code` ≠ `0`, or a non-empty string `label` other than `None`; supports `word_label` / `wordIndex` / `word_index` aliases.

**Visibility:** Same as `GET /releases/youtube/:releaseId` — only releases with `tag = "youtube"` and `public = true`. Otherwise `404` with `Youtube release not found` (same collapsed message as the detail endpoint).

**Scheduling:** Like the youtube detail route, this endpoint does **not** filter by `datePublished <= now`.

**Deduplication:** Lines are considered duplicates when the **original** line text matches after normalizing whitespace (trim + collapse runs of spaces). Repeated choruses collapse to one sampled row; **`verseIds`** lists every distinct verse index that shared that line (sorted ascending). **`verseIndex`** is the first of those in song order and is the key used to read `original` / translation token rows.

**Translation:** `translationLang` in the payload is the config value (or `null`). When it is missing or empty, or there is no `translations` row for that language, `translation.text` is `""` and `translation.words` is `[]`. Otherwise `translation.text` joins **all** translation tokens for the verse; `translation.words` is only the **highlighted** subset (same rules as `original.words`).

**Response:** `200`
```json
{
  "data": {
    "releaseId": "UUID",
    "translationLang": "en",
    "verses": [
      {
        "verseIndex": 0,
        "verseIds": [0, 12, 24],
        "chorus": false,
        "original": {
          "text": "Full line from verses JSON",
          "words": ["highlighted", "tokens"]
        },
        "translation": {
          "text": "Full translation line from all tokens",
          "words": ["highlighted", "gloss"]
        }
      }
    ]
  }
}
```

- `verses` may be shorter than 10 when the song has fewer unique lines after deduplication.
- `original.text` is always the full stored line from `verses` JSON; `original.words` is the **highlighted subset** of tokens for `verseIndex` in `songVersion.original`.
- `translation.text` joins **all** tokens for that verse from translation `content`; `translation.words` is the **highlighted** subset only.
- `chorus` is included only when the underlying verse object includes a boolean `chorus` field.
- Stored `verses` JSON may be line objects (`verse`, `original`, optional `chorus`), plain strings, or arrays of per-token strings; the service maps them to `verseIndex` / `original.text` consistently with how `original[].verse` and translation `content[].verse` are keyed.
