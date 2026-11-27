---
description: "Contract audit: write docs/API_CONTRACT.md from the real frontend code (no server code)"
agent: agent
---
# /backend-0: Contract Audit (no server code)

Frontend rules (always also apply): [frontend rules](../../.agents/rules/00-RULES-lifeos.md). Backend rules: [backend rules](../instructions/backend.instructions.md).

**Step 0 (mandatory):** before reading more files, writing anything or running any command, output an Implementation Plan listing every file you will create or modify and every dependency you will install. Then STOP and wait until I reply "approved". Do not continue without that reply.

Follow the workspace rules (frontend rules in .agents/rules/00-RULES-lifeos.md and backend instructions). Do ONLY this workflow. Do not create `server/`. Do not install anything. Plan first (Step 0 above).

## Goal
Produce `docs/API_CONTRACT.md` from what the frontend ACTUALLY does, not from assumptions.

## Read (all of it)
`docs/BACKEND_INTEGRATION.md`, `docs/PROGRESS.md`, `src/services/*`, `src/hooks/*`, `src/data/seed/*`, `src/constants/*`, every Zod schema used by forms, `src/context/AuthContext*`, `src/routes/ProtectedRoute*`, `src/services/http.js`, `src/utils` helpers that touch dates, status, recurrence or progress.

## Write `docs/API_CONTRACT.md` containing
1. **Entities**: for Task, Application, LearningGoal, Project, Note, Event (custom calendar events), Settings: every field with type, required/optional, enum values, max lengths and any validation the frontend Zod schema enforces.
2. **Endpoints**: for each, method, path, query params (filters, sort, search), request body, response body, and which service method and hook calls it. Cover auth (`register`, `login`, `refresh`, `logout`, `me`, `password change`), CRUD for each entity, `GET /calendar/events?from&to`, `GET/PUT /settings`, and `GET /health`.
3. **Client-side logic that must move to the server**: list every place (file and line range) where the frontend currently does server-type work: appending `statusHistory`, spawning recurring tasks, stamping `completedAt`, in-memory filtering/sorting/pagination, deriving calendar events, ID generation.
4. **Frontend assumptions to change in backend-3**: ID format, response shape expected by each service, how errors surface, the fake auth token flow.
5. **Mismatches**: anywhere the real frontend differs from the entity list in `.github/instructions/backend.instructions.md`. For each, recommend which side should change.
6. **Open questions** for me, as a numbered list. Include: update method (PUT vs PATCH) per entity, whether list endpoints must support server-side filtering now, and whether the localStorage demo data needs an import path.

## Finish
Paste a short summary here (entity list, endpoint count, mismatch count, open questions). Do not write server code. STOP and wait for my approval of the contract.
