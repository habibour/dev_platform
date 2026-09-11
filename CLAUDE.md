# CLAUDE.md — Dev Community (Week 1)

## What this is

The submittable repo for the "Agentic Software Engineer" Week 1 assignment: a full-stack developer community (auth, posts, comments, reactions, profiles, ranking). This folder *is* the repo — `backend/`, `frontend/`, `README.md`, and `AI_USAGE.md` are what actually gets pushed to GitHub. `doc/` and the assignment brief also live here for convenience but are gitignored — they're planning material, not part of the submission.

Requirements and day-by-day execution steps live in `doc/`, not inside `backend/`/`frontend/`:
- `doc/specs/week-1/spec.md` — full week contract (stack, conventions, models, rubric)
- `doc/specs/week-1/day-N/spec.md` — what Day N requires
- `doc/plans/week-1/plan.md` — week execution approach
- `doc/plans/week-1/day-N/plan.md` — concrete steps for Day N
- `doc/specs/design-system.md` — frontend visual design (layout + color palette), applies Day 4 onward

Read the relevant day's spec + plan before implementing it.

## Frontend visual design

Reddit-inspired layout: top navbar, left nav rail, center feed of vote-arrow post cards, threaded comments on post detail. **Concrete visual reference chosen 2026-09-11:** `https://sixsense-devplatform-client.onrender.com/` (a prior implementation of this same brief — its frontend visuals are the reference, its stack is not; see the "prior attempt" note below). Applied starting Day 2 (navbar, left rail, auth pages), not just Day 4+. Full detail, exact palette, and per-day rollout in `doc/specs/design-system.md` — read that before touching any frontend styling.

Color palette — Tailwind v4 `@theme` tokens in `frontend/app/globals.css`, using the reference site's own token names (`brand-*`, `chrome-*`, `like`, `dislike`) rather than a separate semantic scheme:

| Token | Hex | Role |
| :---- | :---- | :---- |
| `brand-500` | `#008080` | Primary — navbar accents, links, buttons, logo |
| `brand-600` | `#006666` | Primary hover/pressed |
| `brand-50` / `brand-100` | `#eaf5f5` / `#b2d8d8` | Light tints — auth-page bg, active-nav bg, badges |
| `chrome-0` … `chrome-900` | `#fff` … `#141918` | Full neutral scale (bg/borders/text) — see design-system.md for all steps |
| `like` | `#ff4500` | Like/upvote (heart icon) — orange-red, not green |
| `dislike` | `#006666` | Dislike/downvote (thumbs-down icon) — same as `brand-600` |

This superseded an earlier placeholder palette (`#385a7c`/`#f97171`/`#8ad6cc`/etc.) — don't reuse those hex values, they're no longer in the app.

## Mandatory tech stack — strict, no substitutions

| Layer | Required |
| :---- | :---- |
| Backend | **NestJS** (Node.js) |
| Frontend | **Next.js** (React) |
| Database | **MongoDB** with **Mongoose** |
| API docs | **Swagger / OpenAPI** (NestJS Swagger) by end of week |
| Auth | JWT access tokens; roles: `admin` \| `user` |

A sibling project, `../6sense_project/`, is a prior attempt at this same brief that used PostgreSQL+Prisma, Express, and Vite+React instead — a direct violation of the assignment's "do not substitute other frameworks or databases" rule. Do not repeat that deviation here, even if it seems expedient.

## Shared conventions

**Success envelope**
```json
{ "success": true, "data": {}, "message": "optional" }
```
**Error envelope**
```json
{ "success": false, "statusCode": 400, "message": "Human-readable error", "errors": [] }
```
Apply these consistently from Day 2 onward — see the Day 7 plan for wiring them globally via an interceptor + exception filter rather than per-controller.

**Ranking formula** (implement Day 7): `score = (likes - dislikes) + commentCount * 2`, tie-break `createdAt` descending. Document the actually-implemented formula in `README.md`.

**Core models** (`User`, `Post`, `Comment`, `Reaction`) — field lists are in `doc/specs/week-1/spec.md`; don't re-derive them, follow that spec.

## Working rules

- **Equal effort, backend and frontend, every day.** A day isn't done with only one side touched.
- **Commit and push through the day**, not one end-of-day dump. `main` must be the final runnable code by Day 7.
- Never commit `.env` with real secrets — only `.env.example`.
- **Own every AI-assisted change.** Review it before it lands; when an AI suggestion is wrong, note it in `AI_USAGE.md` the same day, not reconstructed later.
- Code should be clean and follow SOLID principles — this is part of the evaluation rubric, not a nice-to-have.
