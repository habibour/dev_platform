# CLAUDE.md — Dev Community (Week 1)

## What this is

The submittable repo for the "Agentic Software Engineer" Week 1 assignment: a full-stack developer community (auth, posts, comments, reactions, profiles, ranking). This folder *is* the repo — `backend/`, `frontend/`, `README.md`, and `AI_USAGE.md` are what actually gets pushed to GitHub. `doc/` and the assignment brief also live here for convenience but are gitignored — they're planning material, not part of the submission.

Requirements and day-by-day execution steps live in `doc/`, not inside `backend/`/`frontend/`:
- `doc/specs/week-1/spec.md` — full week contract (stack, conventions, models, rubric)
- `doc/specs/week-1/day-N/spec.md` — what Day N requires
- `doc/plans/week-1/plan.md` — week execution approach
- `doc/plans/week-1/day-N/plan.md` — concrete steps for Day N

Read the relevant day's spec + plan before implementing it.

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
