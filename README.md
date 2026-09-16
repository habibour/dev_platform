# Dev Community

A full-stack developer community: auth, posts, comments/replies, reactions, developer profiles, and a ranked feed.

Built for a 7-day agentic-engineering internship assignment (one day of features per day). Day-by-day requirements and plans live in `doc/` locally (gitignored — planning material, not part of this submission).

## Status

| Day | Feature | Status |
| :---- | :---- | :---- |
| 1 | Scaffold + health check (FE ↔ BE ↔ DB) | ✅ done |
| 2 | Auth (signup/login, JWT, roles) | ✅ done |
| 3 | Developer profiles (skills, experiences) | ✅ done |
| 4 | Posts (create/list/detail) | ⏳ not started |
| 5 | Comments and replies | ⏳ not started |
| 6 | Reactions (like/dislike) | ⏳ not started |
| 7 | Ranking, Swagger, polish | ⏳ not started |

## Stack

- **Backend:** NestJS + MongoDB (Mongoose)
- **Frontend:** Next.js (App Router)
- **Auth:** JWT (access tokens), roles `admin` | `user`

## Project structure

```
backend/    # NestJS API
  src/
    health/  # GET /health (public), GET /health/secure (JWT-guarded), GET /health/admin (role:"admin"-guarded)
    users/   # User schema + persistence (UsersService)
    auth/    # signup/login/me, JWT strategy, JwtAuthGuard, RolesGuard, @Roles()
  scripts/
    seed-admin.ts  # idempotent bootstrap for one role:"admin" user
frontend/   # Next.js app
  app/
    page.tsx        # feed placeholder (app-shell layout) + calls /health for connection status
    signup/, login/  # auth forms — full-bleed pages, outside the app shell
    dashboard/       # sample protected page (behind proxy.ts, app-shell layout)
    api/auth/        # signup/login/logout/me route handlers — own the httpOnly cookie
    api/proxy/[...path]/  # generic authenticated proxy to the backend for every other call
  components/
    Header.tsx        # top navbar — logo, wordmark, auth actions
    LeftNavRail.tsx    # sticky left nav (Home/Dashboard, more as routes land)
    AppShell.tsx        # wraps rail + content in the shared max-width layout (Home/Dashboard only)
    AboutWidget.tsx     # right-sidebar "About" card
  lib/
    auth-context.tsx  # AuthProvider/useAuth — hydrates from /api/auth/me
    api.ts            # client fetch wrapper for /api/proxy/*
    cookies.ts         # httpOnly cookie get/set/clear (server-only)
  proxy.ts    # redirects unauthenticated visits to protected pages (Next.js 16 "proxy", formerly middleware)
```

## Frontend design

Reddit-inspired layout matched to a concrete reference (`https://sixsense-devplatform-client.onrender.com/` — visuals only, not its stack): white navbar with a teal logo mark, sticky left nav rail, card-based feed with a right "About" sidebar, and full-bleed auth pages. Palette (Tailwind v4 `@theme` tokens in `frontend/app/globals.css`), pulled from the reference's own compiled CSS:

| Token | Hex | Role |
| :---- | :---- | :---- |
| `brand-500` / `brand-600` | `#008080` / `#006666` | Primary / hover — buttons, links, logo, active nav |
| `brand-50` / `brand-100` | `#eaf5f5` / `#b2d8d8` | Light tints — auth-page bg, active-nav bg |
| `chrome-0` … `chrome-900` | `#fff` … `#141918` | Neutral scale — backgrounds, borders, text |
| `like` / `dislike` | `#ff4500` / `#006666` | Reaction colors (Day 6) — heart icon / thumbs-down icon |

Full rollout plan per day lives in the local `doc/specs/design-system.md` (planning material, not part of this repo — see `CLAUDE.md` for the summary above, which is).

## Setup

### Prerequisites

- Node.js 20+
- A MongoDB connection string (local `mongod`, Docker, or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)

### Backend

```bash
cd backend
cp .env.example .env   # then fill in MONGODB_URI
npm install
npm run start:dev
```

Runs on `http://localhost:4000`. `GET /health` returns `{ "api": "ok", "db": "ok" }` once Mongo is reachable.

**Env vars** (`backend/.env`):

| Var | Description |
| :---- | :---- |
| `MONGODB_URI` | MongoDB connection string, e.g. `mongodb+srv://<user>:<password>@<cluster>/dev-community` |
| `PORT` | Backend port (default `4000`) |
| `FRONTEND_URL` | Origin allowed by CORS (default `http://localhost:3000`) |
| `JWT_SECRET` | Secret used to sign/verify access tokens |
| `JWT_EXPIRES_IN` | Access token lifetime (default `1d`) |
| `SEED_ADMIN_NAME` / `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Used by `npm run seed:admin` to bootstrap one `role: "admin"` user |

To seed the admin user (after setting the `SEED_ADMIN_*` vars):

```bash
npm run seed:admin
```

Idempotent — safe to re-run; it's a no-op if the admin email already exists.

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Runs on `http://localhost:3000`. The home page calls the backend's `/health` endpoint and shows connection status.

**Env vars** (`frontend/.env.local`):

| Var | Description |
| :---- | :---- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (default `http://localhost:4000`) — used only by the Day 1 home page's direct health check |
| `BACKEND_URL` | Server-only base URL of the backend API, used by the Next.js Route Handlers under `app/api/` (default `http://localhost:4000`) |

## Auth strategy

The JWT the backend issues is never exposed to browser JavaScript. Next.js Route Handlers under `app/api/auth/*` call the NestJS backend directly (server-to-server) and store the returned access token in an **httpOnly cookie** (`accessToken`, `sameSite: lax`, `secure` in production). `app/api/proxy/[...path]/route.ts` is a single generic route that every other authenticated frontend call goes through — it reads the cookie server-side and attaches `Authorization: Bearer <token>` before forwarding to the backend, so adding a new feature (posts, comments, reactions in later days) never requires a new proxy route.

Why httpOnly cookies over `localStorage`: the token is unreachable from injected/XSS JavaScript. The tradeoff is the extra proxy hop for every backend call — accepted here since `lib/api.ts` + `app/api/proxy/[...path]` make that hop a one-time cost, not a per-feature one.

Route protection uses `proxy.ts` (Next.js 16 renamed `middleware.ts` to `proxy.ts`), which checks only for the cookie's **presence** and redirects to `/login` if absent — it does not verify the JWT signature. The backend remains the actual source of truth for validity on every real request through the proxy route; an expired-but-present cookie surfaces as a 401 from `/api/auth/me` or the proxy, which `AuthProvider`/pages handle instead.

No Redis: this week's stack is Nest/Next/Mongo only, and Day 2 only needs plain stateless JWTs (no revocation before expiry). If refresh-token revocation is picked up later as a bonus item, it belongs in a Mongo collection with a TTL index, not a new datastore.

**Roles:** `GET /health/secure` requires any authenticated user (`JwtAuthGuard`); `GET /health/admin` additionally requires `role: "admin"` (`RolesGuard` + `@Roles('admin')`) — a non-admin gets `403 { success:false, message:"Insufficient role" }`. Seed the one bootstrap admin with `npm run seed:admin` (see backend env vars above); signup can never create an admin.

## Ranking formula

Not implemented yet — lands on Day 7. Planned: `score = (likes - dislikes) + commentCount * 2`, tie-break `createdAt` descending.

## Developer profile model

`User` fields: `name, email, role, headline?, bio?, skills: string[], portfolioProjects: PortfolioProject[]`, plus a deprecated `experiences: Experience[]` kept for backward compatibility. `PortfolioProject`: `title, description?, urls: string[], technologies: string[], startDate, endDate?, isCurrent`.

Design decisions:
- `experiences`/`Experience` (and their `POST/PATCH/DELETE /profile/:id/experiences...` routes) are **deprecated, not deleted** — new work should target `portfolioProjects` instead.
- `GET /profile/:id` stays public/unauthenticated but returns only `{id, name, headline, bio, skills, portfolioProjects}` — never `email`, `role`, `experiences`, or the password hash. `GET /profile/me` (authenticated) returns the caller's full document.
- `portfolioProjects` is mutated only via `POST/PATCH/DELETE /profile/me/portfolio-projects[/:projectId]`, mirroring the existing skills pattern. `PATCH /profile/me` accepts only `name`/`headline`/`bio`/`skills` — it does not accept `portfolioProjects`, to avoid an accidental whole-array overwrite.
- Length caps: `headline` 120 chars, `bio`/project `description` 2000 chars, project `title` 120 chars.
- Known limitation: on a partial `PATCH .../portfolio-projects/:id`, the "`endDate` required unless `isCurrent`" rule only fires when `isCurrent` is included in that same request body — it does not check against the project's already-stored `isCurrent` value. A DB-aware async validator would be needed to close that gap; considered disproportionate for the current scope.

## API docs

Not wired up yet — Swagger lands on Day 7. This section will list the `/api/docs` URL once it's live.

## AI usage

See `AI_USAGE.md` for the running log of AI-assisted work, what was reviewed, and bugs caught.
