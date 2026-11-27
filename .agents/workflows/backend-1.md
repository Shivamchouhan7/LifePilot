# /backend-1: Server Foundation + Authentication

Follow the workspace rules. Do ONLY this workflow. Planning mode: Implementation Plan first. `docs/API_CONTRACT.md` is the source of truth.

## Preconditions (stop and ask if any is false)
- `docs/API_CONTRACT.md` exists and I approved it.
- I have given you a MongoDB connection string through `server/.env`. If it is missing, tell me how to add it; never ask me to paste it into chat.

## Build (in `server/`)
1. Scaffold `server/` with the pinned stack. Do not touch frontend files. Merge, never overwrite, `.gitignore` (ensure `.env` and `server/.env` are ignored).
2. `config/env.js` (Zod-validated env), `config/db.js` (Mongoose connection with clear failure message that does NOT print the URI), `app.js`, `server.js` with graceful shutdown.
3. Middleware: helmet, cors (allowlist), cookie-parser, body limit, morgan (no bodies, no auth headers logged), rate limiters, input sanitizer (`$`/`.` keys), `validate(schema)` helper, auth guard, async handler, 404 handler, central error handler using the error envelope and codes from the rules.
4. `GET /api/health`.
5. User model (email unique + lowercase, name, passwordHash, createdAt/updatedAt) and RefreshToken model (userId, tokenHash, expiresAt, revokedAt, replacedBy; TTL index on expiresAt).
6. Auth endpoints per the contract: register, login, refresh (rotation + reuse detection), logout, me, change password (revokes all refresh tokens). Honor `ALLOW_REGISTRATION`.
7. Tests (vitest + supertest + mongodb-memory-server): register/login happy paths; duplicate email; bad input; wrong password gives generic message; protected route without token gives 401; expired/invalid token; refresh rotation; refresh reuse revokes all; registration lock; rate limit on login.
8. Scripts: `dev`, `start`, `lint`, `test`. Create `server/.env.example`.

## Out of scope
Entity models/CRUD, calendar, settings, any frontend changes.

## Finish
Run EXIT CHECKS from the rules. STOP and wait for approval.
