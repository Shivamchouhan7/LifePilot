# LifePilot API Contract (Backend 0)

This contract records the model and client-service behavior evidenced by `client/src`; it does not invent HTTP paths. The implementation is under `client/src`, and the reviewed HTTP helper creates an Axios client but the entity services use browser storage. (`client/src/services/http.js:1-21`; `client/src/services/storageService.js:1-71`; `client/src/services/*.js`)

## Entities

| Entity | Fields and observed values | Source |
|---|---|---|
| **Task** | `id`, `createdAt`, `updatedAt`, `title`, `description`, `priority`, `status`, `dueAt`, `category`, `tags`, `recurring`, `completedAt`, `projectId`, `reminderMinutes`. `priority` is `high\|medium\|low`; `status` is `todo\|in_progress\|completed`. Seeds show `recurring` as `null`, `daily`, or `weekly`; there is no client-side recurrence enum validator. | `client/src/services/taskService.js:6-44`; `client/src/services/storageService.js:27-40`; `client/src/constants/status.js:1-11`; `client/src/data/seed/tasks.part1.js:1-169`; `client/src/data/seed/tasks.part2.js:1-225` |
| **Application** | `id`, `createdAt`, `updatedAt`, `company`, `jobTitle`, `jobType`, `source`, `url`, `appliedDate`, `status`, `recruiterName`, `recruiterEmail`, `description`, `skills`, `salary`, `location`, `followUpDate`, `interviewAt`, `assessmentAt`, `notes`, `statusHistory[{status, at, note}]`. `status` is `interested\|applied\|assessment\|interview\|hr_round\|offered\|rejected\|withdrawn`. `jobType` defaults to `full_time`; all seed examples use `full_time`, and no `jobType` enum is enforced in this service. | `client/src/services/applicationService.js:5-66`; `client/src/services/storageService.js:27-40`; `client/src/constants/status.js:13-22`; `client/src/data/seed/applications.part1.js:1-206`; `client/src/data/seed/applications.part2.js:1-196` |
| **LearningGoal** | `id`, `createdAt`, `updatedAt`, `skill`, `category`, `topics[{id, name, done}]`, `lessons[{id, title, done}]`, `resources[{title, url}]`, `nextRevisionDate`. The service returns a derived `progress` percentage from completed lessons and removes `progress` from create/update payloads rather than storing it. | `client/src/services/learningService.js:5-53`; `client/src/services/storageService.js:27-40`; `client/src/data/seed/learning.seed.js:1-134` |
| **Project** | `id`, `createdAt`, `updatedAt`, `name`, `description`, `techStack`, `repoUrl`, `liveUrl`, `status`, `startDate`, `targetDate`, `milestones[{id, title, done, dueDate}]`, `notes`. The constant status set is `planning\|active\|paused\|completed`. | `client/src/services/projectService.js:5-37`; `client/src/services/storageService.js:27-40`; `client/src/constants/status.js:24-29`; `client/src/data/seed/projects.seed.js:1-79` |
| **Note** | `id`, `createdAt`, `updatedAt`, `title`, `body` (Markdown), `category`, `tags`, `pinned`, `type`, `url`. The form offers `note\|interview_prep\|resource`. | `client/src/services/noteService.js:5-34`; `client/src/services/storageService.js:27-40`; `client/src/pages/NotesPage.jsx:15-25, 211-290`; `client/src/data/seed/notes.seed.js:1-215` |
| **Settings** | Singleton identified by `current_settings`; `profile{name, email, role, avatar}`, `theme`, `notifications`, `dateFormat`, `timeFormat`, `defaultTaskPriority`. UI values include theme `dark\|light`, time format `12h\|24h`, four date-format strings, and task priority `high\|medium\|low`. The service cannot remove settings. | `client/src/services/settingsService.js:5-66`; `client/src/data/seed/settings.seed.js:1-16`; `client/src/pages/SettingsPage.jsx:5-18, 185-235`; `client/src/constants/status.js:1-5` |
| **CalendarEvent** | Standalone stored events use `title`, `type`, `start`, `end` (plus storage metadata). The form exposes event types `event-task`, `event-interview`, `event-assessment`, `event-followup`, `event-deadline`. Calendar results also contain derived task, application, and project events with `id`, `title`, `type`, `start`, `end`, and entity references; these derived records are not stored as standalone events. | `client/src/pages/CalendarPage.jsx:18-27, 45-105`; `client/src/services/calendarService.js:7-117, 120-138`; `client/src/services/storageService.js:27-40` |
| **Auth principal (context object, not a workspace entity)** | `id`, `name`, `email`, `role`; the current context also keeps a token and user in browser storage. | `client/src/context/AuthContext.jsx:3-25, 41-76` |

## Endpoints

**Verified HTTP API endpoint count: 0.** No API path or HTTP verb is defined by the client source: `http.js` only creates an Axios instance and request interceptor, while service implementations delegate to `createStorageService`. UI routes in `AppRoutes` and `constants/routes.js` are browser routes, not API endpoints. (`client/src/services/http.js:1-21`; `client/src/services/storageService.js:1-71`; `client/src/services/taskService.js:1-44`; `client/src/services/applicationService.js:1-66`; `client/src/services/learningService.js:1-53`; `client/src/services/projectService.js:1-37`; `client/src/services/noteService.js:1-34`; `client/src/services/settingsService.js:1-66`; `client/src/services/calendarService.js:1-139`; `client/src/routes/AppRoutes.jsx:18-61`; `client/src/constants/routes.js:1-16`)

These are client service operations, **not defined HTTP endpoints**:

| Resource | Operations exposed by client service | Source |
|---|---|---|
| Tasks | `getAll(params)`, `getById(id)`, `create(payload)`, `update(id, payload)`, `remove(id)` | `client/src/services/taskService.js:6-44` |
| Applications | `getAll(params)`, `getById(id)`, `create(payload)`, `update(id, payload)`, `remove(id)` | `client/src/services/applicationService.js:5-66` |
| Learning goals | `getAll(params)`, `getById(id)`, `create(payload)`, `update(id, payload)`, `remove(id)` | `client/src/services/learningService.js:11-53` |
| Projects | `getAll(params)`, `getById(id)`, `create(payload)`, `update(id, payload)`, `remove(id)` | `client/src/services/projectService.js:5-37` |
| Notes | `getAll(params)`, `getById(id)`, `create(payload)`, `update(id, payload)`, `remove(id)` | `client/src/services/noteService.js:5-34` |
| Settings | `getAll()`, `getById()` (ignores an id), `create(payload)`, `update(id, payload)`, `remove()` (returns an unsupported-operation result) | `client/src/services/settingsService.js:21-65` |
| Calendar | `getEvents(range)`, `getAll(params)` (alias for `getEvents`), and standalone-event `getById/create/update/remove` | `client/src/services/calendarService.js:19-138` |

API paths, HTTP verbs, response envelope, and query parameter names remain undecided because the source defines none. (`client/src/services/http.js:1-21`; `client/src/services/*.js`)

## Client-side logic that must move to the server (file + line range for each item)

| Logic | Required backend ownership / caveat | Source |
|---|---|---|
| Browser persistence, generated record IDs, `createdAt`/`updatedAt`, and CRUD behavior | Replace localStorage persistence and client-generated record metadata with server persistence and canonical metadata. | `client/src/services/storageService.js:1-71`; `client/src/utils/storage.js:1-48` |
| Entity defaults and payload shaping | Enforce the persisted defaults/normalization server-side; client form defaults must not be trusted as validation. | `client/src/services/taskService.js:15-35`; `client/src/services/applicationService.js:14-42`; `client/src/services/learningService.js:28-41`; `client/src/services/projectService.js:14-27`; `client/src/services/noteService.js:14-25`; `client/src/services/settingsService.js:5-60` |
| Application status-history creation and append | The server must author initial history and append exactly one history entry when status changes; clients should submit the requested status, not authoritative history. | `client/src/services/applicationService.js:14-61` |
| Learning progress calculation | Keep progress derived from lesson completion and return it for current consumers; do not persist a client-supplied percentage. | `client/src/services/learningService.js:5-48` |
| Calendar aggregation, 30-minute derived-event duration, and range filtering | Move generation from task due dates, application interview/assessment/follow-up dates, project targets/milestones, and filtering to server-owned calendar logic. Keep standalone event CRUD distinct from derived events. | `client/src/services/calendarService.js:7-117, 120-138`; `client/src/pages/CalendarPage.jsx:45-105` |
| Fake authentication and profile persistence | Replace local fake-token login/register, stored user/token, and client logout with server auth/session behavior; `ProtectedRoute` should consume the resulting authenticated state. | `client/src/context/AuthContext.jsx:3-76`; `client/src/routes/ProtectedRoute.jsx:5-24`; `client/src/services/http.js:1-21` |
| Demo seed initialization and reset | Replace client-wide local demo-data reset with an explicitly chosen backend development-fixture/reset approach; do not expose this as an ordinary account data mutation. | `client/src/data/seed/index.js:9-41`; `client/src/pages/SettingsPage.jsx:10, 118-141` |
| Lesson and milestone child IDs | The UI currently creates these nested IDs; assign/validate them server-side if the backend owns aggregate persistence. | `client/src/pages/LearningPage.jsx:34-47`; `client/src/pages/ProjectDetailPage.jsx:14-15, 54-81` |
| Task completion timestamp and recurring-task spawning | The `/backend-3` workflow requires server ownership, but no client stamping or spawn implementation exists to remove: `taskService` only passes `completedAt`/`recurring` fields and `KanbanBoard` only updates status. Implement once on the server and verify exactly one next instance. | `client/src/services/taskService.js:15-42`; `client/src/components/tasks/KanbanBoard.jsx:8-20`; `.agents/workflows/backend-3.md:1-16` |

## Frontend assumptions to change in backend-3

- `VITE_USE_MOCK` is calculated but does not select a mock or REST service implementation; all entity services currently delegate to local storage. Backend-3 must add the real service selection and document actual paths rather than treating the Axios base URL as an existing API. (`client/src/services/http.js:1-21`; `client/src/services/storageService.js:1-71`; `client/src/services/*.js`)
- The request interceptor reads a bearer token from localStorage; it does not configure credentials, refresh, single-flight retry, or server error-envelope handling. The integration workflow asks for those behaviors, but they are not implemented in the source. (`client/src/services/http.js:1-21`; `client/src/context/AuthContext.jsx:3-76`; `.agents/workflows/backend-3.md:1-6`)
- There is no change-password form in the routed auth pages; login submits email/password and register submits name/email/password. Do not plan to wire a nonexistent form without adding it in the later approved frontend scope. (`client/src/routes/AppRoutes.jsx:18-23`; `client/src/pages/LoginPage.jsx:10-45`; `client/src/pages/RegisterPage.jsx:10-28`)
- No Zod form schema was found in `client/src`; the inspected forms use native required/type/length constraints and local checks. Server validation and mapping errors to specific fields will need a defined contract and corresponding UI work. (`client/src/pages/CalendarPage.jsx:71-105`; `client/src/pages/LearningPage.jsx:34-55, 188-193`; `client/src/pages/ProjectsPage.jsx:20-35, 122-165`; `client/src/pages/NotesPage.jsx:95-116, 211-290`; `client/src/pages/LoginPage.jsx:57-95`; `client/src/pages/RegisterPage.jsx:54-99`)
- `getAll(params)` passes `params` into a storage helper that only filters when given a function; no query-string pagination/filter contract exists. Notes search/category filtering is currently performed in the page. (`client/src/services/taskService.js:6-8`; `client/src/services/storageService.js:8-15`; `client/src/pages/NotesPage.jsx:54-63`)
- Task and application UI entry points are incomplete: task “Add Task” and application “Add Application” only log clicks, `ApplicationsPage` renders a placeholder, and the detail page is also a placeholder. Backend-3’s manual create/edit/delete and status-history checks cannot be completed through these screens without later frontend work. (`client/src/components/tasks/ListView.jsx:7-16`; `client/src/components/applications/ListView.jsx:6-14`; `client/src/pages/ApplicationsPage.jsx:1-15`; `client/src/pages/ApplicationDetailPage.jsx:1-21`; `.agents/workflows/backend-3.md:14-16`)
- The task service does not stamp `completedAt` or spawn recurring tasks; this is a backend implementation requirement, not duplicated current client behavior. Recurrence calculation semantics are not specified by the source. (`client/src/services/taskService.js:15-42`; `client/src/components/tasks/KanbanBoard.jsx:8-20`; `.agents/workflows/backend-3.md:8-10`)

## Mismatches

| Rules/workflow statement | Observed source behavior | Source |
|---|---|---|
| Rule entity lists allow application `jobType` values `internship`, `full_time`, and `part_time`. | The service defaults to `full_time`; seed examples use `full_time`; no source enum or validation for the other values exists. | `.agents/rules/00-RULES-lifeos.md:75`; `client/src/services/applicationService.js:14-42`; `client/src/data/seed/applications.part1.js:1-206`; `client/src/data/seed/applications.part2.js:1-196` |
| Rule Note type includes `link`. | The Notes form offers `note`, `interview_prep`, and `resource`; current seed examples use those types, not `link`. | `.agents/rules/00-RULES-lifeos.md:78`; `client/src/pages/NotesPage.jsx:15-25`; `client/src/data/seed/notes.seed.js:1-215` |
| Rule Task recurrence includes `monthly`. | Current task seeds show `null`, `daily`, and `weekly`; service copies the value without implementing or validating recurrence. | `.agents/rules/00-RULES-lifeos.md:74`; `client/src/data/seed/tasks.part1.js:1-169`; `client/src/data/seed/tasks.part2.js:1-225`; `client/src/services/taskService.js:15-42` |
| Rule requires UUID IDs and `createdAt`/`updatedAt` on every entity. | CRUD-created records receive generated IDs/timestamps, but seed records use fixed prefixed IDs and are written directly without those timestamps. | `.agents/rules/00-RULES-lifeos.md:70, 74-79`; `client/src/services/storageService.js:27-40`; `client/src/data/seed/tasks.part1.js:8-26`; `client/src/data/seed/applications.part1.js:8-29`; `client/src/data/seed/index.js:9-22` |
| Project status set includes `paused`. | The shared status constant includes it, but the project create/edit selects expose only `planning`, `active`, and `completed`. | `.agents/rules/00-RULES-lifeos.md:77`; `client/src/constants/status.js:24-29`; `client/src/pages/ProjectsPage.jsx:128-134`; `client/src/pages/ProjectDetailPage.jsx:201-207` |
| Rule says `VITE_USE_MOCK=true` selects the local mock and services can be switched to Express. | The flag is exported but unused by entity services; those services still use local storage. | `.agents/rules/00-RULES-lifeos.md:66-70`; `client/src/services/http.js:3-21`; `client/src/services/taskService.js:1-44`; `client/src/services/applicationService.js:1-66` |
| Backend-3 requires removing client-side completion stamping and recurrence spawning. | Neither behavior is implemented in the current task service; it only accepts/passes the fields. | `.agents/workflows/backend-3.md:8-10`; `client/src/services/taskService.js:15-42` |
| Backend rules source requested for this workflow. | `.github/instructions/backend.instructions.md` is absent from the workspace; the duplicate `.agents/rules/01-RULES-backend.md` was intentionally not used. | `.github/instructions/backend.instructions.md` (missing); `.agents/rules/00-RULES-lifeos.md:1-5` |

## Open questions

- What API paths, verbs, response envelope, and query parameter names should backend-3 use? No HTTP endpoint definitions or response envelope exist in the inspected source. (`client/src/services/http.js:1-21`; `client/src/services/*.js`)
- Should `jobType` support only the currently evidenced `full_time`, or should the two rule-only values be added to client forms and validation? (`client/src/services/applicationService.js:14-42`; `.agents/rules/00-RULES-lifeos.md:75`)
- Should `Note.type=link` and monthly task recurrence be added, or should the rules be narrowed to the observed UI/data? (`client/src/pages/NotesPage.jsx:15-25`; `client/src/data/seed/tasks.part1.js:1-169`; `.agents/rules/00-RULES-lifeos.md:74, 78`)
- What are recurring-task interval, timezone, completion-stamp, and retry/idempotency semantics? Backend-3 requires exactly one next instance, but current source provides no spawn logic or interval algorithm. (`client/src/services/taskService.js:15-42`; `.agents/workflows/backend-3.md:8-10`)
- How should the existing demo reset be replaced for server-backed data, and should the project create/edit UI expose `paused`? (`client/src/data/seed/index.js:9-41`; `client/src/pages/ProjectsPage.jsx:128-134`; `client/src/pages/ProjectDetailPage.jsx:201-207`)
- `docs/BACKEND_INTEGRATION.md`, `.github/instructions/backend.instructions.md`, and `server/` were not present; please supply the first two or confirm their intended locations before backend implementation. (Workspace root listing; `docs/` listing)

### Files read

**Required source files read in full**

- `client/src/services/`: `applicationService.js`, `calendarService.js`, `http.js`, `learningService.js`, `noteService.js`, `projectService.js`, `settingsService.js`, `storageService.js`, `taskService.js`.
- `client/src/hooks/`: `useApplications.js`, `useApplications.jsx`, `useCalendarEvents.js`, `useDebounce.js`, `useLearningGoals.js`, `useNotes.js`, `useProjects.js`, `useSettings.js`, `useTasks.js`, `useTasks.jsx`.
- `client/src/data/seed/`: `applications.part1.js`, `applications.part2.js`, `applications.seed.js`, `index.js`, `learning.seed.js`, `notes.seed.js`, `projects.seed.js`, `settings.seed.js`, `tasks.part1.js`, `tasks.part2.js`, `tasks.seed.js`.
- `client/src/constants/`: `navigation.js`, `routes.js`, `status.js`.
- `client/src/utils/`: `cn.js`, `formatters.js`, `storage.js`.
- `client/src/context/`: `AuthContext.jsx`, `ThemeContext.jsx`.
- `client/src/routes/`: `AppRoutes.jsx`, `ProtectedRoute.jsx`.

**Additional source and rule files read**

- `client/src/pages/`: `ApplicationDetailPage.jsx`, `ApplicationsPage.jsx`, `CalendarPage.jsx`, `LearningPage.jsx`, `LoginPage.jsx`, `NotesPage.jsx`, `ProjectDetailPage.jsx`, `ProjectsPage.jsx`, `RegisterPage.jsx`, `SettingsPage.jsx`, `TasksPage.jsx`.
- `client/src/components/applications/`: `ApplicationsDashboard.jsx`, `ListView.jsx`.
- `client/src/components/tasks/`: `KanbanBoard.jsx`, `ListView.jsx`, `TaskCard.jsx`.
- `.agents/rules/00-RULES-lifeos.md`; `.agents/workflows/backend-3.md`; `docs/PROGRESS.md`.

The Zod search over `client/src` returned no matching schemas. `.github/instructions/backend.instructions.md` and `docs/BACKEND_INTEGRATION.md` were checked and are missing; they were not read.
