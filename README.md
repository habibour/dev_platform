# Dev Community

A full-stack developer community: auth, posts, comments/replies, reactions, developer profiles, and a ranked feed.

Built for a 7-day agentic-engineering internship assignment. Day-by-day requirements and plans live outside this repo, in `../doc/`.

## Stack

- **Backend:** NestJS + MongoDB (Mongoose)
- **Frontend:** Next.js (App Router)
- **Auth:** JWT (access tokens), roles `admin` | `user`

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

TODO (Day 7): document the implemented formula here once ranking ships.

## API docs

TODO (Day 7): Swagger URL path once wired up.
