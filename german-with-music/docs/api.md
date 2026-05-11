# Lyric Pallete API — Public

Base URL: `http://localhost:3000/api`

This document covers **unauthenticated** read-only catalog endpoints (`controllers/public/song.controller.ts`) and **authentication** endpoints (`controllers/auth.controller.ts`) used to register, sign in, and read the current session. They do not require an admin account.

The published youtube catalog uses a flat per-item shape that mixes project and version fields. **Admin** endpoints (projects, versions, glossary, user management, etc.) require a JWT for a user with `level = 1` in the database; see [`api.admin.md`](./api.admin.md).

## Authentication

Passwords are stored as bcrypt hashes; responses never include a password field.

### POST `/auth/register`

Create a new user. `login` must be a unique email (stored lowercased). `password` is required (minimum 8 characters). `level` is optional `0` or `1` (default `0`). `name` is optional.

**Response:** `201 Created`
```json
{
  "data": {
    "user": {
      "id": "UUID",
      "login": "user@example.com",
      "level": 0,
      "name": "Display name or null"
    },
    "token": "<JWT>"
  }
}
```

- `409` with `Login already in use` if `login` is taken.

### POST `/auth/login`

Sign in with `login` (email) and `password`.

**Response:** `200 OK` — same `{ "data": { "user", "token" } }` shape as register.

- `401` with `Invalid login or password` if credentials are wrong (including unknown email).

### GET `/auth/me`

Returns the current user row from the database (not stale JWT claims beyond identifying the session).

**Headers**

| Name | Value |
|------|--------|
| `Authorization` | `Bearer <JWT>` |

**Response:** `200 OK`
```json
{
  "data": {
    "id": "UUID",
    "login": "user@example.com",
    "level": 0,
    "name": "Display name or null"
  }
}
```

- `401` if the header is missing/invalid, the token is expired, or the user row no longer exists.

Use the returned `token` as `Authorization: Bearer …` on admin routes when the account has **level `1`** (see [`api.admin.md`](./api.admin.md)).

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
