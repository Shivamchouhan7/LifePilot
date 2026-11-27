# /backend-0: Contract Audit (no server code)

Follow the workspace rules (frontend and backend). Do ONLY this workflow. Do not create `server/`. Do not install anything. Planning mode: Implementation Plan first.

## Goal
Produce `docs/API_CONTRACT.md` from what the frontend ACTUALLY does, not from assumptions.

## Read (all of it)
`docs/BACKEND_INTEGRATION.md`, `docs/PROGRESS.md`, `src/services/*`, `src/hooks/*`, `src/data/seed/*`, `src/constants/*`, every Zod schema used by forms, `src/context/AuthContext*`, `src/routes/ProtectedRoute*`, `src/services/http.js`, `src/utils` helpers that touch dates, status, recurrence or progress.

## Write `docs/API_CONTRACT.md` containing
1. **Entities**: for Task, Application, LearningGoal, Project, Note, Event (custom calendar events), Settings: every field with type, required/optional, enum values, max lengths and any validation the frontend Zod schema enforces.
2. **Endpoints**: for each, method, path, query params (filters, sort, search), request body, response body, and which service method and hook calls it. Cover auth (`register`, `login`, `refresh`, `logout`, `me`, `password change`), CRUD for each entity, `GET /calendar/events?from&to`, `GET/PUT /settings`, and `GET /health`.
3. **Client-side logic that must move to the server**: list every place (file and line range) where the frontend currently does server-type work: appending `statusHistory`, spawning recurring tasks, stamping `completedAt`, in-memory filtering/sorting/pagination, deriving calendar events, ID generation.
4. **Frontend assumptions to change in backend-3**: ID format, response shape expected by each service, how errors surface, the fake auth token flow.
5. **Mismatches**: anywhere the real frontend differs from the entity list in `.agents/rules/01-RULES-backend.md`. For each, recommend which side should change.
6. **Open questions** for me, as a numbered list. Include: update method (PUT vs PATCH) per entity, whether list endpoints must support server-side filtering now, and whether the localStorage demo data needs an import path.

## Finish
Paste a short summary here (entity list, endpoint count, mismatch count, open questions). Do not write server code. STOP and wait for my approval of the contract.
