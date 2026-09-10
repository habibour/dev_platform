# AI Usage Log

> Keep this as a running log through the week — append entries the day something happens, not from memory on Day 7. See `../doc/plans/week-1/plan.md` ("AI usage habit").

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

TODO

## Day 3

TODO

## Day 4

TODO

## Day 5

TODO

## Day 6

TODO

## Day 7

TODO — consolidate the above into the final write-up.
