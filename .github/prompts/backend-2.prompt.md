---
description: "Backend entity APIs, calendar, settings, tests"
agent: agent
---
# /backend-2: Entity APIs, Calendar, Settings

Frontend rules (always also apply): [frontend rules](../../.agents/rules/00-RULES-lifeos.md). Backend rules: [backend rules](../instructions/backend.instructions.md).

**Step 0 (mandatory):** before reading more files, writing anything or running any command, output an Implementation Plan listing every file you will create or modify and every dependency you will install. Then STOP and wait until I reply "approved". Do not continue without that reply.

Follow the workspace rules and the backend instructions file. Do ONLY this workflow. Plan first (Step 0 above). `docs/API_CONTRACT.md` is the source of truth for every field, enum and route. Reuse the middleware from `/backend-1`; do not duplicate it.

## Build (in `server/`)
For EACH of Task, Application, LearningGoal, Project, Note and custom Event:
- Mongoose model with `userId` (indexed), enums and constraints from the contract, `timestamps`, the `toJSON` transform from the rules, and the indexes the contract's filters need.
- Zod schemas (`.strict()`) for create, update, list query and params. Server-owned fields are not accepted from clients.
- Routes, thin controllers and a service layer. Every query filters by `req.user.id`. Cross-user access returns 404.
- List endpoints implement the contract's search, filter and sort params plus `page` / `limit` / `meta.total`.

Entity-specific logic:
- **Application**: `statusHistory` seeded on create and appended on every status change (with optional `note` from the request). Same-status updates do not append. Validate `interviewAt` is not before `appliedDate` (match the frontend rule).
- **Task**: `completedAt` stamped/cleared per the rules. Recurring completion creates the next instance exactly once (idempotent). Provide the next-due-date calculation in a pure, unit-tested function (daily/weekly/monthly, month-end safe).
- **LearningGoal**: store topics, lessons, resources and `nextRevisionDate`; return a derived `progress` field computed from lessons in the serializer, never stored.
- **Project**: milestones embedded; derived completion % in the serializer.
- **Note**: markdown body stored raw (frontend sanitizes on render); enforce size limits.

Also:
- `GET /api/calendar/events?from&to`: derived from tasks (dueAt), applications (interviewAt, assessmentAt, followUpDate), project targetDate and milestone dueDates, plus stored custom events. Each derived event carries `type`, `sourceType` and `sourceId` so the UI can open the source item. Validate the range (max 366 days).
- `GET/PUT /api/settings`: one document per user, created with defaults on first read.
- `server/scripts/seed.js`: optional dev-only seed for a given user email (refuses to run when `NODE_ENV=production`), dates relative to today.

## Tests (vitest + supertest)
Per entity: create, read, update, delete, validation failure, unknown-field rejection, cross-user isolation (user B cannot read/update/delete user A's data and gets 404), pagination, each filter. Plus: `statusHistory` behaviour, recurring-task idempotency, derived progress, calendar range and derivation, settings defaults.

## Out of scope
Any frontend changes.

## Finish
Run EXIT CHECKS. In the smoke test, include a cross-user isolation attempt. STOP and wait for approval.
