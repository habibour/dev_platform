# Dev Community

A full-stack developer community: auth, posts, comments/replies, reactions, developer profiles, and a ranked feed.

Built for a 7-day agentic-engineering internship assignment (one day of features per day). Day-by-day requirements and plans live in `doc/` locally (gitignored — planning material, not part of this submission).

## Status

| Day | Feature | Status |
| :---- | :---- | :---- |
| 1 | Scaffold + health check (FE ↔ BE ↔ DB) | ✅ done |
| 2 | Auth (signup/login, JWT, roles) | ⏳ not started |
| 3 | Developer profiles (skills, experiences) | ⏳ not started |
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
    health/  # GET /health — API + DB connectivity check
frontend/   # Next.js app
  app/
    page.tsx # home page, calls /health and shows connection status
```

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
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (default `http://localhost:4000`) |

## Ranking formula

Not implemented yet — lands on Day 7. Planned: `score = (likes - dislikes) + commentCount * 2`, tie-break `createdAt` descending (see `doc/specs/week-1/spec.md`).

## API docs

Not wired up yet — Swagger lands on Day 7. This section will list the `/api/docs` URL once it's live.

## AI usage

See `AI_USAGE.md` for the running log of AI-assisted work, what was reviewed, and bugs caught.
