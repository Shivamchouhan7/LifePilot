---
description: LifePilot backend rules (Express, MongoDB, JWT, security)
applyTo: "**"
---
# LifePilot Backend Rules (always apply to work in /server)

## 1. Scope and precedence
- These rules govern `server/` only. The frontend rules in `.agents/rules/00-RULES-lifeos.md` (read that file at the start of every workflow) still govern the frontend. The frontend rule "do not add dependencies outside the stack" does NOT apply inside `server/`; the backend stack below does.
- Backend work runs through the workflows `/backend-0` ... `/backend-3`, one at a time. After the EXIT CHECKS, STOP and wait for my approval. Never start the next workflow.
- Source of truth for every route, field, enum and response shape: `docs/API_CONTRACT.md`, produced by `/backend-0` from the REAL frontend code and approved by me. If these rules and the contract conflict, STOP and ask. Never silently choose.
- Environment: Windows + PowerShell. Use PowerShell-compatible commands only. Use `Invoke-RestMethod` or `curl.exe` (never bare `curl`, which is a PowerShell alias). No `grep`, `cat`, `rm -rf`; use `git grep` or `Select-String`.
- Plan first: before any change, output an Implementation Plan listing every file to create or modify and every dependency to install, then STOP until I reply "approved". Do not install anything outside the stack below without asking.
- Never write "verified", "tested" or "works" without pasted command output.
- Max 250 lines per file. Controllers stay thin; logic goes in services.
- Do not edit frontend files except in `/backend-3`, and then only the files the plan lists.

## 2. Stack (pinned majors)
- Node 20+, ESM (`"type": "module"`), JavaScript only. Separate `server/package.json`.
- express 4, mongoose 8, zod 3, jsonwebtoken 9, bcryptjs 2 (pure JS, no native build on Windows), helmet, cors, express-rate-limit 7, cookie-parser, morgan, dotenv.
- Dev/test: nodemon, vitest, supertest, mongodb-memory-server, eslint (same major as the frontend).
- Anything else: ask first.

## 3. Security rules (non-negotiable)
- Secrets live only in `server/.env` (gitignored). Create `server/.env.example` with placeholder values. NEVER print, log or paste secret values (MONGODB_URI, JWT secrets) in chat, logs, plans or PROGRESS.md.
- Env validated at boot with Zod; the server refuses to start if a required variable is missing or a JWT secret is shorter than 32 characters.
- Required env: `NODE_ENV`, `PORT` (default 3000, matches frontend `VITE_API_URL`), `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_ORIGIN` (default `http://localhost:5173`), `ALLOW_REGISTRATION` (default true).
- Passwords: bcryptjs cost 12, minimum 10 characters. Never return or log password hashes. Login failures return one generic message for both unknown email and wrong password.
- Tokens: access JWT, 15 minutes, sent as `Authorization: Bearer`. Refresh token: opaque random value, 7 days, httpOnly + sameSite=lax cookie (secure in production), stored HASHED in the database, rotated on every refresh, revoked on logout and on password change. Reuse of a revoked refresh token revokes all that user's tokens.
- CORS: allow only `CLIENT_ORIGIN`, `credentials: true`. helmet enabled. Body limit 100kb. Rate limit: auth routes 10 requests/15 min/IP; the rest of the API 300/15 min/IP.
- Every route except `/api/health`, `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh` requires auth.
- Ownership: every document has `userId`. EVERY query filters by `req.user.id`. Fetching another user's document returns 404 (not 403). `userId` is never accepted from the request body or query.
- Validation: every request body, query and params validated with Zod `.strict()` schemas (unknown keys rejected, preventing mass assignment). Strip keys beginning with `$` or containing `.` from all input to block NoSQL operator injection. Validate ObjectId params before querying.
- Server-owned fields the client can NEVER set: `id`, `userId`, `createdAt`, `updatedAt`, `statusHistory`, `completedAt`, and token fields.
- Single-user mode: when `ALLOW_REGISTRATION=false`, `/api/auth/register` returns 403.
- Errors never leak stack traces or Mongoose internals to the client in production.

## 4. API conventions
- Base path `/api`. Plural nouns. Methods and paths exactly as in `docs/API_CONTRACT.md`.
- Success envelope: `{ "data": ..., "meta": { ... } }` (`meta` only when relevant, e.g. pagination). Error envelope: `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }`.
- Error codes: `VALIDATION_ERROR` 400, `UNAUTHENTICATED` 401, `FORBIDDEN` 403, `NOT_FOUND` 404, `CONFLICT` 409, `RATE_LIMITED` 429, `INTERNAL` 500.
- Status codes: 201 on create, 200 on read/update, 204 on delete.
- Mongoose `toJSON` transform: expose `_id` as string `id`, remove `_id` and `__v`, never expose `userId` or token fields. Dates are ISO 8601 strings.
- List endpoints accept filter/sort/search query params from the contract, plus `page` (default 1) and `limit` (default 100, max 500). Return `meta: { page, limit, total }`.
- Central async error handler, 404 handler for unknown routes, and a `GET /api/health` returning `{ data: { status: "ok" } }`.

## 5. Data and logic rules
- Enums, field names and required/optional rules mirror the frontend (`src/constants`, Zod form schemas, seed generators), as recorded in `docs/API_CONTRACT.md`.
- Indexes: `{ userId: 1 }` plus sensible compound indexes for the contract's filters (e.g. tasks by `userId + status + dueAt`, applications by `userId + status`, text index on searchable fields).
- Server-owned logic (must be moved out of the client in `/backend-3`):
  - Application status change appends `{ status, at, note }` to `statusHistory`. Creating an application seeds `statusHistory` with its initial status.
  - Task set to `completed` stamps `completedAt`; moved back out of `completed` clears it. A completed recurring task creates the next instance exactly once (idempotent: repeating the same update must not spawn a second one).
  - Learning progress and calendar events are DERIVED. Never store progress. Only user-created standalone events are stored.
- Settings: one document per user, created on first read with defaults.
- Soft limits to prevent abuse: note body max 50,000 characters, arrays max 100 items, strings max sensible lengths in the Zod schemas.

## 6. Code organization
```
server/
  src/{config, models, routes, controllers, services, middleware, validators, utils}/
  src/app.js     (builds the Express app, no listen)
  src/server.js  (connects DB, listens)
  tests/
  scripts/
  .env.example
```

## 7. EXIT CHECKS (every backend workflow, all required)
1. `npm run lint` and `npm test` in `server/` pass. Paste the full output.
2. `npm audit --omit=dev` in `server/`. Paste the result and list any high/critical findings (do not auto-fix with `--force`).
3. Start the server and run a smoke test with `Invoke-RestMethod`/`curl.exe` covering the endpoints added in this workflow, including at least one failure case (bad input) and one unauthorized case. Paste requests and responses with tokens and secrets redacted.
4. Confirm `git status` shows no `.env` file staged or tracked.
5. Append to `docs/PROGRESS.md`: what was built, files created/modified, known issues. Then STOP.
