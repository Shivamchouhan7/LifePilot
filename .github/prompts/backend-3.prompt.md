---
description: "Frontend integration, client-logic removal, hardening, end-to-end run"
agent: agent
---
# /backend-3: Frontend Integration and Hardening

Frontend rules (always also apply): [frontend rules](../../.agents/rules/00-RULES-lifeos.md). Backend rules: [backend rules](../instructions/backend.instructions.md).

**Step 0 (mandatory):** before reading more files, writing anything or running any command, output an Implementation Plan listing every file you will create or modify and every dependency you will install. Then STOP and wait until I reply "approved". Do not continue without that reply.

Follow the workspace rules and the backend instructions file. Do ONLY this workflow. Plan first (Step 0 above). This is the only backend workflow allowed to edit frontend files, and only those the plan lists. `docs/API_CONTRACT.md` is the source of truth.

## Build
1. **Service layer**: implement real REST versions of every service behind the existing 5-method interface, selected by `VITE_USE_MOCK`. Map the server envelope (`data`, `meta`, `error`) so hooks and components do not change shape. Keep the mock implementations working when `VITE_USE_MOCK=true`.
2. **Auth**: replace the stub with the real flow. Axios instance with `withCredentials: true`, access token held in memory (and restored via `/auth/refresh` on page load), a single-flight 401 interceptor that refreshes once then retries, and a forced logout with a toast when refresh fails. Wire Login, Register, logout and change-password forms to the API. Show server validation errors on the matching form fields.
3. **Remove duplicated client logic** that the server now owns: `statusHistory` appends, `completedAt` stamping, recurring-task spawning, and calendar derivation. List every removal. Doing this wrong would create DUPLICATE recurring tasks, so the plan must state how you verify there is exactly one next instance.
4. **Filtering/pagination**: send filters and pagination as query params where the contract defines them; keep client-side filtering only where the contract says so.
5. **Loading, error and empty states** must still work against real network latency and failures (server down, 401, 400, 500). Verify each by actually triggering it.
6. **Dev ergonomics**: add a root script to run frontend and server together only if the plan lists the dependency and I approve it. Otherwise document two terminals.
7. **Hardening pass on `server/`**: re-read the security rules and verify each one with a test or a pasted command. Add any missing test. Confirm: CORS rejects other origins, rate limits trip, unknown fields are rejected, no secret appears in logs.
8. **Docs**: write `docs/RUNNING.md` (prerequisites, creating the `.env`, MongoDB setup, running both apps on Windows, running tests, how to flip `ALLOW_REGISTRATION=false` after creating my account) and update `docs/BACKEND_INTEGRATION.md` to reflect reality.

## Finish
Run the backend EXIT CHECKS AND the frontend EXIT CHECKS (build, lint, plus the console report; if you cannot capture screenshots at 375/768/1280 in both themes, say so and list the exact screens and viewport sizes I must check manually for Login, Register, Overview, Tasks, Applications). Then do an end-to-end manual run against the real API and report each step with its result: register, login, create/edit/delete a task, complete a recurring task (exactly one new instance), move an application through three statuses (timeline shows all), reload the page (session restored), logout, and the failure cases (server stopped, expired token). STOP.
