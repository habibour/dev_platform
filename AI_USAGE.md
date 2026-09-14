# AI Usage Log

> Keep this as a running log through the week — append entries the day something happens, not from memory on Day 7. See `doc/plans/week-1/plan.md` ("AI usage habit").

Minimum bar by Day 7 (assignment §7):
1. Which AI tools were used
2. How the agent was instructed (example prompts / workflow)
3. What was personally reviewed, rejected, or rewritten
4. At least one bad suggestion or bug caught and fixed

## Day 1

- **Tools:** Claude Code, driven from `doc/plans/week-1/day-1/plan.md`.
- **How instructed:** gave the plan file directly and asked to execute it — scaffold NestJS backend + Next.js frontend, wire a `/health` endpoint through to Mongo, get the frontend showing connection status, commit locally.
- **Reviewed/rejected:** reviewed the Nest CLI's default scaffold (NestJS 12, ESM `"type": "module"`, vitest instead of Jest — newer default than expected); kept it as-is rather than forcing CommonJS/Jest, since nothing in the assignment mandates either.
- **Bug caught and fixed:** `health.service.ts` initially had `import { Connection } from 'mongoose'` as a plain (value) import. Under this project's ESM/`nodenext` TypeScript config, that import is only used as a type, but wasn't marked as such — so the compiled JS kept a real runtime `import { Connection } from 'mongoose'`, and Node's ESM/CJS interop couldn't statically find a named `Connection` export on `mongoose` (a CommonJS package), crashing the server at boot with `SyntaxError: The requested module 'mongoose' does not provide an export named 'Connection'`. Fixed by changing it to `import type { Connection } from 'mongoose'`, which TypeScript strips entirely at compile time. Caught by actually running the dev server rather than trusting a clean `tsc`/`nest build` (the build step alone didn't catch it, since `isolatedModules` type-checking passed).
- Also found and stopped an unrelated stray Express dev server (from the earlier, wrong-stack `6sense_project` attempt) that had been left running for two days and was squatting on port 4000, blocking this backend from binding.
- Verified end-to-end against a real MongoDB Atlas cluster (not just localhost): `GET /health` → `{"api":"ok","db":"ok"}`, and the frontend home page renders "✅ API connected" (checked in an actual browser, not just curl, since the fetch runs client-side).

## Day 2

- **Tools:** Claude Code. Planned in plan mode against `doc/specs/week-1/day-2/spec.md` and the existing `doc/plans/week-1/day-2/plan.md` draft, then implemented.
- **How instructed:** asked to read the day-2 spec/plan and start planning; the draft plan left token-storage strategy and signup-auto-login as open decisions. Was asked directly whether Redis fits here (it doesn't — no server-side session store needed for plain stateless JWTs; would only matter for a refresh-token bonus, and even then Mongo+TTL index is the stack-consistent choice over adding Redis). Chose httpOnly cookie (via Next.js Route Handlers proxying to the backend) over `localStorage`, and auto-login on signup.
- **Reviewed/rejected:** the initial guard implementation (`class JwtAuthGuard extends AuthGuard('jwt') {}`) failed at runtime with `Nest can't resolve dependencies of the JwtAuthGuard (?)... AuthModuleOptions at index [0]` — subclassing the passport mixin lost its `@Optional()` constructor-injection metadata. Fixed by using `export const JwtAuthGuard = AuthGuard('jwt');` (no subclassing) and registering `PassportModule.register({ defaultStrategy: 'jwt' })` instead of a bare `PassportModule` import, plus importing `AuthModule` into `HealthModule` so `JwtAuthGuard`'s dependency resolves in that module's injector too.
- **Bug caught and fixed:** the admin seed script (`scripts/seed-admin.ts`, run via `tsx`) threw `CannotDetermineTypeError` on `@Prop()` fields with no explicit `type:` — `tsx`'s esbuild-based decorator-metadata emission doesn't reliably infer Mongoose prop types the way Nest's own dev-server compiler does. Fixed by making every `@Prop()` type explicit (`type: String`) in `user.schema.ts` rather than relying on `design:type` reflection. Also had to reorder the seed script to read `SEED_ADMIN_*` env vars *after* `NestFactory.createApplicationContext()` resolves (ConfigModule's `.env` loading happens as part of that app-context creation, not before), and rewrote it to bootstrap a minimal standalone module (Config + Mongoose + `UsersModule` only) instead of the full `AppModule`, since pulling in `AuthModule`/`JwtStrategy` hit the same esbuild constructor-metadata gap for `ConfigService` injection.
- Caught mid-plan that Next.js 16 renamed `middleware.ts` to `proxy.ts` (`export function proxy()` instead of `export function middleware()`) — checked the bundled `node_modules/next/dist/docs/` (per this project's `AGENTS.md` instruction to not trust training-data Next.js conventions) before writing the route-protection file, avoiding a dead file that Next would have silently ignored.
- Verified end-to-end both via `curl` (signup/duplicate-409/login/wrong-password-401/`GET /health/secure` 401-then-200/`GET /auth/me`/seed + idempotent re-run) and in an actual Chrome browser: signup auto-logs-in and updates the header, the `accessToken` cookie is confirmed httpOnly (`document.cookie` returns empty, devtools cookie jar shows the HttpOnly flag), `/dashboard` renders the JWT-guarded backend payload while logged in and redirects to `/login` when visited unauthenticated, wrong-password shows an inline error, and logging in as the seeded admin shows `(admin)` in the header.
- **Design pivot, same day:** was given a concrete visual reference (`https://sixsense-devplatform-client.onrender.com/`, a prior implementation of this brief — visuals only, not its stack) and asked to make the frontend identical and apply it immediately rather than waiting for Day 4. Extracted the reference's *exact* compiled Tailwind theme (`brand-*`/`chrome-*`/`like`/`dislike` hex values, Inter font) via the browser devtools rather than eyeballing colors from screenshots — found by reading the page's own `@layer theme` CSS rule, which is more reliable than color-picking a screenshot. Replaced the placeholder palette from `doc/specs/design-system.md` with this one (old hex values fully retired, see that file's diff), restyled `Header`/added `LeftNavRail`/`AppShell`/`AboutWidget`, and rebuilt login/signup as full-bleed pages outside the app shell (no left rail) to match the reference, which required splitting the shared layout so auth pages don't inherit the rail+sidebar chrome. Updated `doc/specs/design-system.md` and the root `CLAUDE.md` to record this as the authoritative design choice for Day 3+ sessions.

## Day 3

- **Tools:** Claude Code, in plan mode against `doc/specs/week-1/day-3/spec.md` and `doc/plans/week-1/day-3/plan.md`.
- **How instructed:** asked to read the day-3 spec/plan and design a plan before touching code. Two open design calls from the draft plan were surfaced explicitly rather than decided silently: (1) `plan.md` scopes mutations to fixed `/profile/me/*` routes, but its own verification step ("PATCH someone else's profile with your own token → 403") is impossible to express against a route that always targets the caller's own id — resolved by moving mutations to `/profile/:id` behind a new self-or-admin guard, keeping `/profile/me` (GET only) as a convenience alias; (2) spec left profile-view access ("public or authenticated — document choice") open — chose public, no guard.
- **Reviewed/rejected:** the model's first pass at `UsersService.updateExperience` used Mongoose's subdocument `.id()` lookup on the hydrated array plus an in-place `Object.assign` + `.save()`; rewrote it to a single `findOneAndUpdate` with the `experiences.$` positional operator instead, since the `.id()` approach needed unverifiable type-casting against Mongoose's `DocumentArray` typing and the positional-operator update is the more idiomatic, type-safe Mongoose pattern for this codebase.
- **Bug caught and fixed:** the existing `UserSchema.toJSON` transform stripped `passwordHash`/`__v` but never renamed `_id` → `id`, unlike `/auth/me`'s hand-built response shape. The new profile endpoints return the raw document, so they were serializing `_id` — which would have silently broken the frontend's `user.id === profile.id` ownership check (frontend types everywhere use `id`). Caught by actually curling the new endpoints instead of trusting the type-check; fixed by adding matching `id`-renaming `toJSON` transforms to both the `User` schema and the `Experience` subdocument schema.
- **Also caught:** `AuthModule` importing `UsersModule` (existing, for `UsersService`) and the new `UsersModule` needing `AuthModule` (for the guards) is a circular module dependency — resolved with `forwardRef()` on both sides; verified by actually booting the Nest app and confirming all routes map with no DI resolution errors, not just a clean `tsc`.
- Verified end-to-end via `curl` against the real Atlas-backed dev server (public `GET /profile/:id` with no token; add/remove skill and experience; a second user's token getting 403 on another user's `PATCH`/`POST` profile routes; unauthenticated `PATCH` getting 401) and in an actual Chrome browser (login → Profile nav link → view own profile → Edit profile → add a skill and edit the existing experience's description → reload the profile page and confirm both persisted → logged out and reloaded the same profile URL to confirm it still renders read-only with no edit link). One hydration-mismatch overlay appeared mid-session on the profile page; confirmed via a hard reload that it was a stale Turbopack HMR artifact from live-editing the page's source, not a real SSR/CSR mismatch — the overlay itself was tagged "(stale)" and disappeared after reload, and the pre-existing dashboard page shows the same baseline "1 issue" (an unrelated Chrome-extension console error) with nothing extra. Cleaned up the two test users created during manual testing from the shared dev database afterward.

## Day 4

TODO

## Day 5

TODO

## Day 6

TODO

## Day 7

TODO — consolidate the above into the final write-up.
