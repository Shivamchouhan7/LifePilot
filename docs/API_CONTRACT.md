# LifePilot API Contract

## Approved decisions

Where an entity table or other section describes current client behavior that differs from an approved decision, the approved decision wins.

1. **Task recurrence:** The API uses `null` for no recurrence. `'none'` is form-only and must be rejected by the API.
2. **Date formats:** Use date-only strings `YYYY-MM-DD` for `appliedDate`, `followUpDate`, `nextRevisionDate`, project `startDate`, project `targetDate`, and milestone `dueDate`. Use UTC ISO instants for `dueAt`, `completedAt`, `interviewAt`, `assessmentAt`, `statusHistory[].at`, calendar event `start`/`end`, and timestamps (`createdAt`/`updatedAt`).
3. **Monthly recurrence:** Do not add a recurrence anchor day in v1. Jan 31 to Feb 28 drift is a known limitation; the server does not know the user's timezone.
4. **Updates:** Use `PATCH` for updates. Settings supports only `GET` and `PATCH`.
5. **Task sections and list aggregation:** Task section classification stays client-side. The client requests `limit=500` for lists it aggregates over (task sections, Overview, Analytics) and warns if `meta.total` exceeds it.
6. **Application status note:** `statusNote` is optional, accepted only on application updates, and limited to 500 characters.
7. **Entities without Zod schemas:** Server string limits use the cited HTML `maxLength` values. Cap arrays at topics 100, lessons 200, resources 50, milestones 50, techStack 30, and Note tags 20. Add `paused` to the project form and `link` to the Note form in backend-3.
8. **Local data:** Do not import localStorage data in v1; keep Export JSON.
9. **Integration handoff:** Drop `docs/BACKEND_INTEGRATION.md`; backend-3 writes `docs/RUNNING.md`.

This contract describes the client data model and a proposed HTTP API. The client services currently read and write localStorage, not HTTP endpoints; all `/api/...` routes below are recommendations derived from those service operations and the backend route conventions. `.github/instructions/backend.instructions.md` does not define a field-by-field entity inventory, so the comparison below uses the explicit inventory in `.agents/rules/00-RULES-lifeos.md`. Sources are cited on each field, endpoint group, decision, and behavior. [client/src/services/storageService.js:6-69] [.agents/rules/00-RULES-lifeos.md:73-82] [.github/instructions/backend.instructions.md:37-54]

## Entities

`id`, `createdAt`, and `updatedAt` are generated or controlled by the storage layer today. They should be server-owned in API requests, consistent with the backend rules. Zod validation is listed exactly where a schema exists; for entities with no schema, the validation cell says **Not found in client code**. [client/src/services/storageService.js:27-56] [.github/instructions/backend.instructions.md:32-33]

### Task

| field | type | required | default | enum or limits | validation | source (file:line) |
|---|---|---|---|---|---|---|
| id | string | Response only | generated UUID/fallback ID | — | Not found in client code | `client/src/services/storageService.js:27-35` |
| title | string | Yes | — | max 120 | `z.string().trim().min(1).max(120)` | `client/src/validation/taskSchema.js:9` |
| description | string | Yes | `''` | max 2,000 | `z.string().max(2000)` | `client/src/validation/taskSchema.js:10`; `client/src/services/taskService.js:25-26` |
| priority | string | Yes | Settings default if valid, otherwise `medium` | `high \| medium \| low` | `z.enum(['high', 'medium', 'low'])` | `client/src/validation/taskSchema.js:11`; `client/src/services/taskService.js:15-27` |
| status | string | Yes | `todo` | `todo \| in_progress \| completed` | `z.enum(['todo', 'in_progress', 'completed'])` | `client/src/validation/taskSchema.js:12`; `client/src/services/taskService.js:23-24` |
| dueAt | string (ISO timestamp or null in stored data) | Yes | `null` | Empty form value accepted; valid date required when supplied | `z.string().refine(value => !value || !Number.isNaN(new Date(value).getTime()))`; form saves ISO | `client/src/validation/taskSchema.js:13-16`; `client/src/components/tasks/TaskFormDialog.jsx:27,61`; `client/src/services/taskService.js:29` |
| category | string | Yes | `Work` | No schema limit | `z.string()` | `client/src/validation/taskSchema.js:17`; `client/src/services/taskService.js:30` |
| tags | string[] | Yes | `[]` | max 10; each trimmed and non-empty | `z.array(z.string().trim().min(1)).max(10)` | `client/src/validation/taskSchema.js:18`; `client/src/services/taskService.js:31` |
| recurring | string or null | Yes | `null` in stored data; form value is `none` | `null \| daily \| weekly \| monthly` stored; schema additionally accepts `none` | `z.enum(['none', 'daily', 'weekly', 'monthly'])`; non-`none` requires `dueAt` (field-level custom issue) | `client/src/validation/taskSchema.js:19-29`; `client/src/components/tasks/TaskFormDialog.jsx:18,29,62`; `client/src/services/taskService.js:32` |
| completedAt | string (ISO timestamp) or null | Response/server-owned | `null`; set on transition to completed | — | Not found in client code | `client/src/services/taskService.js:33,45-52`; `.github/instructions/backend.instructions.md:33,51` |
| projectId | string or null | Yes | `null` | — | Not found in client code | `client/src/services/taskService.js:34` |
| reminderMinutes | integer or null | Schema-optional | `null` | integer >= 0 | Preprocess `''`/null to undefined, otherwise `Number(value)`; `z.number().int().min(0).optional()` | `client/src/validation/taskSchema.js:3-6,20`; `client/src/services/taskService.js:35` |
| createdAt | string (ISO timestamp) | Response only | generated on create | — | Not found in client code | `client/src/services/storageService.js:29-35` |
| updatedAt | string (ISO timestamp) | Response only | generated on create/update | — | Not found in client code | `client/src/services/storageService.js:29-35,50-56` |

### Application

| field | type | required | default | enum or limits | validation | source (file:line) |
|---|---|---|---|---|---|---|
| id | string | Response only | generated UUID/fallback ID | — | Not found in client code | `client/src/services/storageService.js:27-35` |
| company | string | Yes | — | 1-150 chars after trim | `z.string().trim().min(1).max(150)` | `client/src/validation/applicationSchema.js:21` |
| jobTitle | string | Yes | — | 1-150 chars after trim | `z.string().trim().min(1).max(150)` | `client/src/validation/applicationSchema.js:22` |
| jobType | string | Yes | `full_time` in service | `internship \| full_time \| part_time` | `z.enum(Object.keys(JOB_TYPES))` | `client/src/constants/jobTypes.js:1-5`; `client/src/validation/applicationSchema.js:23`; `client/src/services/applicationService.js:25` |
| source | string | Yes | `LinkedIn` | 1-100 chars after trim | `z.string().trim().min(1).max(100)` | `client/src/validation/applicationSchema.js:24`; `client/src/services/applicationService.js:26` |
| url | string | Yes | `''` | Empty allowed; otherwise absolute HTTP(S) URL | `z.string().trim().refine(isValidUrl)`; helper accepts only `http:`/`https:` | `client/src/validation/applicationSchema.js:10-18,25`; `client/src/services/applicationService.js:27` |
| appliedDate | string (ISO timestamp currently stored) | Yes | current ISO timestamp in service | Non-empty valid date | `z.string().min(1).refine(isValidDate)` | `client/src/validation/applicationSchema.js:6-8,26`; `client/src/components/applications/ApplicationFormDialog.jsx:29,47`; `client/src/services/applicationService.js:28` |
| status | string | Yes | `interested` | `interested \| applied \| assessment \| interview \| hr_round \| offered \| rejected \| withdrawn` | `z.string().refine(status => hasOwnProperty(APPLICATION_STATUSES, status))`; interview and hr_round require `interviewAt` | `client/src/constants/status.js:14-23`; `client/src/validation/applicationSchema.js:27-30,43-50`; `client/src/services/applicationService.js:16-18` |
| recruiterName | string | Yes (may be empty) | `''` | max 100 | `z.string().max(100)` | `client/src/validation/applicationSchema.js:31`; `client/src/services/applicationService.js:30` |
| recruiterEmail | string | Yes (may be empty) | `''` | Empty or valid email | `z.string().trim().refine(value => !value || z.string().email().safeParse(value).success)` | `client/src/validation/applicationSchema.js:32`; `client/src/services/applicationService.js:31` |
| description | string | Yes (may be empty) | `''` | max 5,000 | `z.string().max(5000)` | `client/src/validation/applicationSchema.js:33`; `client/src/services/applicationService.js:32` |
| skills | string[] | Yes | `[]` | max 20; each trimmed and non-empty | `z.array(z.string().trim().min(1)).max(20)` | `client/src/validation/applicationSchema.js:34`; `client/src/services/applicationService.js:33` |
| salary | string | Yes (may be empty) | `''` | max 150 | `z.string().max(150)` | `client/src/validation/applicationSchema.js:35`; `client/src/services/applicationService.js:34` |
| location | string | Yes (may be empty) | `''` | max 150 | `z.string().max(150)` | `client/src/validation/applicationSchema.js:36`; `client/src/services/applicationService.js:35` |
| followUpDate | string (ISO timestamp currently stored) or null | Yes (empty string accepted) | `null` | Empty or valid date | `z.string().refine(isValidDate)` | `client/src/validation/applicationSchema.js:6-8,37`; `client/src/components/applications/ApplicationFormDialog.jsx:37,48`; `client/src/services/applicationService.js:36` |
| interviewAt | string (ISO timestamp currently stored) or null | Yes (empty string accepted) | `null` | Empty or valid date; not before appliedDate's calendar day; required for interview/hr_round | `z.string().refine(isValidDate)` plus `superRefine` cross-field rules | `client/src/validation/applicationSchema.js:6-8,38,43-58`; `client/src/components/applications/ApplicationFormDialog.jsx:38,49`; `client/src/services/applicationService.js:37` |
| assessmentAt | string (ISO timestamp currently stored) or null | Yes (empty string accepted) | `null` | Empty or valid date; not before appliedDate's calendar day | `z.string().refine(isValidDate)` plus `superRefine` cross-field rule | `client/src/validation/applicationSchema.js:6-8,39,52-58`; `client/src/components/applications/ApplicationFormDialog.jsx:39,50`; `client/src/services/applicationService.js:38` |
| notes | string | Yes (may be empty) | `''` | max 5,000 | `z.string().max(5000)` | `client/src/validation/applicationSchema.js:40`; `client/src/services/applicationService.js:39` |
| statusHistory | object[] `{status, at, note}` | Response/server-owned; create currently seeds it | Initial status entry with current ISO time and note | `status` uses application status values | No Zod field in `applicationSchema`; service creates initial entry and ignores update-supplied history | `client/src/services/applicationService.js:15-19,40,48-59`; `.github/instructions/backend.instructions.md:33,50` |
| createdAt | string (ISO timestamp) | Response only | generated on create | — | Not found in client code | `client/src/services/storageService.js:29-35` |
| updatedAt | string (ISO timestamp) | Response only | generated on create/update | — | Not found in client code | `client/src/services/storageService.js:29-35,50-56` |

All application schema keys are required at the object level; optional user input is represented by empty strings, with the service converting blank dates to `null`. Application date-time inputs are prefilled in local time and converted with `new Date(value).toISOString()` on save. [client/src/validation/applicationSchema.js:21-41] [client/src/components/applications/ApplicationFormDialog.jsx:16-19,29-50]

### LearningGoal

| field | type | required | default | enum or limits | validation | source (file:line) |
|---|---|---|---|---|---|---|
| id | string | Response only | generated UUID/fallback ID | — | Not found in client code | `client/src/services/storageService.js:27-35` |
| skill | string | Yes in form | — | HTML max 100 | Not found in client code | `client/src/pages/LearningPage.jsx:156` |
| category | string | No | `Engineering` in service; `General` in form | HTML max 50 | Not found in client code | `client/src/services/learningService.js:32-34`; `client/src/pages/LearningPage.jsx:44,161` |
| topics | object[] `{id, name, done}` | No | `[]` | No client array limit | Not found in client code | `.agents/rules/00-RULES-lifeos.md:76`; `client/src/services/learningService.js:34`; `client/src/data/seed/learning.seed.js:12-17` |
| lessons | object[] `{id, title, done}` | No | `[]` | No client array limit | Not found in client code | `.agents/rules/00-RULES-lifeos.md:76`; `client/src/services/learningService.js:35`; `client/src/data/seed/learning.seed.js:18-23` |
| resources | object[] `{title, url}` | No | `[]` | No client array limit | Not found in client code | `.agents/rules/00-RULES-lifeos.md:76`; `client/src/services/learningService.js:36`; `client/src/data/seed/learning.seed.js:24-29` |
| nextRevisionDate | string (ISO timestamp currently stored) or null | No | `null` | Date input converted to ISO at local noon | Not found in client code | `client/src/services/learningService.js:37`; `client/src/pages/LearningPage.jsx:45,165`; `client/src/data/seed/learning.seed.js:3,11` |
| progress | number | Response-derived only | calculated | rounded percentage 0-100 | Not found in client code; service removes it from writes | `client/src/services/learningService.js:5-8,16,24,28-47`; `.agents/rules/00-RULES-lifeos.md:76` |
| createdAt | string (ISO timestamp) | Response only | generated on create | — | Not found in client code | `client/src/services/storageService.js:29-35` |
| updatedAt | string (ISO timestamp) | Response only | generated on create/update | — | Not found in client code | `client/src/services/storageService.js:29-35,50-56` |

### Project

| field | type | required | default | enum or limits | validation | source (file:line) |
|---|---|---|---|---|---|---|
| id | string | Response only | generated UUID/fallback ID | — | Not found in client code | `client/src/services/storageService.js:27-35` |
| name | string | Yes in form | — | HTML max 100 | Not found in client code | `client/src/services/projectService.js:16`; `client/src/pages/ProjectsPage.jsx:115`; `client/src/pages/ProjectDetailPage.jsx:180` |
| description | string | No | `''` | HTML max 1,000 | Not found in client code | `client/src/services/projectService.js:17`; `client/src/pages/ProjectsPage.jsx:119`; `client/src/pages/ProjectDetailPage.jsx:184` |
| techStack | string[] | No | `[]` | Form parses comma-separated strings; no max | Not found in client code | `client/src/services/projectService.js:18`; `client/src/pages/ProjectDetailPage.jsx:50,188` |
| repoUrl | string | No | `''` | Browser `type=url`; no Zod limit | Not found in client code | `client/src/services/projectService.js:19`; `client/src/pages/ProjectDetailPage.jsx:206` |
| liveUrl | string | No | `''` | Browser `type=url`; no Zod limit | Not found in client code | `client/src/services/projectService.js:20`; `client/src/pages/ProjectDetailPage.jsx:210` |
| status | string | No | `active` | Constant includes `planning \| active \| paused \| completed`; form exposes planning/active/completed | Not found in client code | `client/src/constants/status.js:25-29`; `client/src/services/projectService.js:21`; `client/src/pages/ProjectsPage.jsx:128-132` |
| startDate | string (ISO timestamp) | No | current ISO timestamp | — | Not found in client code | `client/src/services/projectService.js:22`; `client/src/data/seed/projects.seed.js:3,15` |
| targetDate | string (ISO timestamp currently stored) or null | No | `null` | Date input converted using local noon then ISO | Not found in client code | `client/src/services/projectService.js:23`; `client/src/pages/ProjectsPage.jsx:30,136`; `client/src/pages/ProjectDetailPage.jsx:51` |
| milestones | object[] `{id, title, done, dueDate}` | No | `[]` | Title required in form, max 150; no array limit | Not found in client code | `.agents/rules/00-RULES-lifeos.md:77`; `client/src/services/projectService.js:24`; `client/src/pages/ProjectDetailPage.jsx:66-72,165` |
| notes | string | No | `''` | HTML max 2,000 | Not found in client code | `client/src/services/projectService.js:25`; `client/src/pages/ProjectDetailPage.jsx:214` |
| createdAt | string (ISO timestamp) | Response only | generated on create | — | Not found in client code | `client/src/services/storageService.js:29-35` |
| updatedAt | string (ISO timestamp) | Response only | generated on create/update | — | Not found in client code | `client/src/services/storageService.js:29-35,50-56` |

### Note

| field | type | required | default | enum or limits | validation | source (file:line) |
|---|---|---|---|---|---|---|
| id | string | Response only | generated UUID/fallback ID | — | Not found in client code | `client/src/services/storageService.js:27-35` |
| title | string | Yes in form | — | HTML max 160 | Not found in client code | `client/src/services/noteService.js:16`; `client/src/pages/NotesPage.jsx:222` |
| body | string (markdown/text) | No | `''` | HTML max 30,000 | Not found in client code | `.agents/rules/00-RULES-lifeos.md:78`; `client/src/services/noteService.js:17`; `client/src/pages/NotesPage.jsx:256-258` |
| category | string | No | `General` | HTML max 60 | Not found in client code | `client/src/services/noteService.js:18`; `client/src/pages/NotesPage.jsx:96,227` |
| tags | string[] | No | `[]` | No client array limit | Not found in client code | `client/src/services/noteService.js:19`; `client/src/pages/NotesPage.jsx:18,238` |
| pinned | boolean | No | `false` | — | Not found in client code | `client/src/services/noteService.js:20`; `client/src/pages/NotesPage.jsx:18,268` |
| type | string | No | `note` | UI options: `note \| interview_prep \| resource`; rule also lists `link` | Not found in client code | `.agents/rules/00-RULES-lifeos.md:78`; `client/src/services/noteService.js:21`; `client/src/pages/NotesPage.jsx:19-23` |
| url | string | No | `''` | Browser `type=url`; no Zod limit | Not found in client code | `client/src/services/noteService.js:22`; `client/src/pages/NotesPage.jsx:265` |
| createdAt | string (ISO timestamp) | Response only | generated on create | — | Not found in client code | `client/src/services/storageService.js:29-35` |
| updatedAt | string (ISO timestamp) | Response only | generated on create/update | — | Not found in client code | `client/src/services/storageService.js:29-35,50-56` |

### Settings

| field | type | required | default | enum or limits | validation | source (file:line) |
|---|---|---|---|---|---|---|
| id | string | Yes in local store; API should identify by user | `current_settings` | One document per user in backend rules | Not found in client code | `client/src/services/settingsService.js:5-6`; `.github/instructions/backend.instructions.md:53` |
| profile.name | string | Yes in form | `Alex Morgan` | HTML required, max 80 | Not found in client code | `client/src/services/settingsService.js:7-12`; `client/src/pages/SettingsPage.jsx:168-171` |
| profile.email | string | No | `alex.morgan@example.com`; UI reads auth user's email and is read-only | Read-only in settings form | Not found in client code | `client/src/services/settingsService.js:7-12`; `client/src/pages/SettingsPage.jsx:185` |
| profile.role | string | No | `Staff Frontend Engineer` | HTML max 80 | Not found in client code | `client/src/services/settingsService.js:7-12`; `client/src/pages/SettingsPage.jsx:178-180` |
| profile.avatar | string | No | `''` | No client limit | Not found in client code | `client/src/services/settingsService.js:7-12` |
| theme | string | No | `dark` | `dark \| light` | Not found in client code | `client/src/services/settingsService.js:13`; `client/src/pages/SettingsPage.jsx:192-195` |
| notifications | boolean | No | `true` | — | Not found in client code | `client/src/services/settingsService.js:14`; `client/src/pages/SettingsPage.jsx:202-209` |
| dateFormat | string | No | `MMM d, yyyy` | `MMM d, yyyy \| MM/dd/yyyy \| dd/MM/yyyy \| yyyy-MM-dd` | Not found in client code | `client/src/services/settingsService.js:15`; `client/src/pages/SettingsPage.jsx:217-221` |
| timeFormat | string | No | `12h` | `12h \| 24h` | Not found in client code | `client/src/services/settingsService.js:16`; `client/src/pages/SettingsPage.jsx:225-227` |
| defaultTaskPriority | string | No | `medium` | `low \| medium \| high` | Not found in client code | `client/src/services/settingsService.js:17`; `client/src/pages/SettingsPage.jsx:237-242` |
| createdAt / updatedAt | ISO timestamp(s) | Response only if persisted | generated by storage service | Settings remove is unsupported | Not found in client code | `client/src/services/storageService.js:29-35,50-56`; `client/src/services/settingsService.js:63-65` |

### Standalone CalendarEvent

Only user-created events are persisted; task, application, and project calendar entries are computed from their owning entities. The backend rules likewise distinguish derived calendar entries from standalone events. [client/src/services/calendarService.js:7-10,23-109,124-137] [.agents/rules/00-RULES-lifeos.md:81-82]

| field | type | required | default | enum or limits | validation | source (file:line) |
|---|---|---|---|---|---|---|
| id | string | Response only | generated UUID/fallback ID | — | Not found in client code | `client/src/services/storageService.js:27-35` |
| title | string | Yes in form | — | HTML required, max 120 | Not found in client code | `client/src/pages/CalendarPage.jsx:204` |
| type | string | No | `event-task` | `event-task \| event-interview \| event-assessment \| event-followup \| event-deadline` | Not found in client code | `client/src/pages/CalendarPage.jsx:24-29,208-209`; `client/src/services/calendarService.js:105-107` |
| start | string (ISO timestamp) | Yes | — | `datetime-local` input; converted with `toISOString()` | Not found in client code | `client/src/pages/CalendarPage.jsx:36,100,215` |
| end | string (ISO timestamp) | Yes | start + 30 minutes on new event; must not precede start in form | `datetime-local` input; converted with `toISOString()` | Not found in client code | `client/src/pages/CalendarPage.jsx:65-66,100-101,219` |
| createdAt | string (ISO timestamp) | Response only | generated on create | — | Not found in client code | `client/src/services/storageService.js:29-35` |
| updatedAt | string (ISO timestamp) | Response only | generated on create/update | — | Not found in client code | `client/src/services/storageService.js:29-35,50-56` |

`entityType`, `entityId`, and generated event IDs/titles are response-only links for derived events, not standalone event fields. [client/src/services/calendarService.js:33-40,48-53,57-62,66-71,79-94]

### Auth user (local stub)

This is the object stored by the current auth stub, not a fully modeled client entity or a service-backed CRUD resource. [client/src/context/AuthContext.jsx:3-20,41-53]

| field | type | required | default | enum or limits | validation | source (file:line) |
|---|---|---|---|---|---|---|
| id | string | Yes in stored stub | fixed `usr_demo_01` | — | Not found in client code | `client/src/context/AuthContext.jsx:16-20,45-50` |
| name | string | Yes in stored stub | `Alex Morgan` for demo; otherwise derived from email | — | Not found in client code | `client/src/context/AuthContext.jsx:16-20,45-50` |
| email | string | Yes in stored stub | demo email or submitted email | — | Not found in client code | `client/src/context/AuthContext.jsx:16-20,41-50` |
| role | string | Yes in stored stub | `Staff Frontend Engineer` | — | Not found in client code | `client/src/context/AuthContext.jsx:16-20,45-50` |

## Endpoints

No client service currently calls these routes; they are the recommended REST mapping of the service methods. Plural `/api` resources, standard `{data: ...}` responses, pagination metadata, and the health route follow backend instructions. List routes should use the query parameters specified below. [client/src/services/http.js:1-21] [client/src/services/taskService.js:8-12,72-74] [client/src/services/applicationService.js:5-12,62-64] [client/src/services/learningService.js:11-52] [client/src/services/projectService.js:5-37] [client/src/services/noteService.js:5-34] [.github/instructions/backend.instructions.md:37-44]

| method | route | purpose / request notes | source |
|---|---|---|---|
| GET | `/api/health` | Health response `{data:{status:"ok"}}` | `.github/instructions/backend.instructions.md:44` |
| POST | `/api/auth/register` | Registration | `.github/instructions/backend.instructions.md:28-34` |
| POST | `/api/auth/login` | Login | `.github/instructions/backend.instructions.md:28-30` |
| POST | `/api/auth/refresh` | Rotate refresh token and issue access JWT | `.github/instructions/backend.instructions.md:28-30` |
| POST | `/api/auth/logout` | Recommended route to revoke refresh token; route name is not specified in backend rules | `.github/instructions/backend.instructions.md:28`; route convention `.github/instructions/backend.instructions.md:37-44` |
| GET | `/api/auth/me` | Return the authenticated user's profile | Backend-3 addition; authenticated route per `.github/instructions/backend.instructions.md:30-31` |
| PATCH | `/api/auth/password` | Change the authenticated user's password; the frontend has no password UI yet | Backend-3 addition; password rules in `.github/instructions/backend.instructions.md:26,28` |
| GET | `/api/tasks` | List tasks; supports filters/search/sort and pagination | `client/src/services/taskService.js:8-12`; `.github/instructions/backend.instructions.md:43` |
| GET | `/api/tasks/:id` | Read one task | `client/src/services/taskService.js:14-16` |
| POST | `/api/tasks` | Create task | `client/src/services/taskService.js:18-38` |
| PATCH | `/api/tasks/:id` | Partial update; completion rules run server-side | `client/src/services/taskService.js:40-70` |
| DELETE | `/api/tasks/:id` | Delete task | `client/src/services/taskService.js:72-74` |
| GET | `/api/applications` | List/filter/search/sort and paginate | `client/src/services/applicationService.js:5-12`; `.github/instructions/backend.instructions.md:43` |
| GET | `/api/applications/:id` | Read one application | `client/src/services/applicationService.js:9-11` |
| POST | `/api/applications` | Create; server initializes status history | `client/src/services/applicationService.js:15-41` |
| PATCH | `/api/applications/:id` | Partial update; server records status changes | `client/src/services/applicationService.js:43-61` |
| DELETE | `/api/applications/:id` | Delete application | `client/src/services/applicationService.js:62-64` |
| GET | `/api/learning-goals` | List learning goals | `client/src/services/learningService.js:11-18` |
| GET | `/api/learning-goals/:id` | Read one learning goal | `client/src/services/learningService.js:20-26` |
| POST | `/api/learning-goals` | Create learning goal | `client/src/services/learningService.js:28-41` |
| PATCH | `/api/learning-goals/:id` | Partial update | `client/src/services/learningService.js:43-48` |
| DELETE | `/api/learning-goals/:id` | Delete learning goal | `client/src/services/learningService.js:50-52` |
| GET | `/api/projects` | List projects | `client/src/services/projectService.js:5-12` |
| GET | `/api/projects/:id` | Read one project | `client/src/services/projectService.js:10-12` |
| POST | `/api/projects` | Create project | `client/src/services/projectService.js:14-28` |
| PATCH | `/api/projects/:id` | Partial update | `client/src/services/projectService.js:30-32` |
| DELETE | `/api/projects/:id` | Delete project | `client/src/services/projectService.js:34-36` |
| GET | `/api/notes` | List notes | `client/src/services/noteService.js:5-12` |
| GET | `/api/notes/:id` | Read one note | `client/src/services/noteService.js:10-12` |
| POST | `/api/notes` | Create note | `client/src/services/noteService.js:14-25` |
| PATCH | `/api/notes/:id` | Partial update | `client/src/services/noteService.js:27-29` |
| DELETE | `/api/notes/:id` | Delete note | `client/src/services/noteService.js:31-33` |
| GET | `/api/settings` | Read the user's single settings document; create defaults on first read | `client/src/services/settingsService.js:20-33`; `.github/instructions/backend.instructions.md:53` |
| PATCH | `/api/settings` | Update settings; no delete route | `client/src/services/settingsService.js:47-65` |
| GET | `/api/calendar/events?start=&end=` | Return derived events plus standalone events in range | `client/src/services/calendarService.js:20-25,111-121` |
| GET | `/api/events/:id` | Read a standalone event | `client/src/services/calendarService.js:124-126` |
| POST | `/api/events` | Create a standalone event | `client/src/services/calendarService.js:128-130` |
| PATCH | `/api/events/:id` | Update a standalone event | `client/src/services/calendarService.js:132-134` |
| DELETE | `/api/events/:id` | Delete a standalone event | `client/src/services/calendarService.js:136-138` |

**Endpoint count: 39 proposed routes.** This count includes the recommended `POST /api/auth/logout`; the backend instructions require logout revocation but do not prescribe the route path. Resource updates use `PATCH` because current service updates merge a supplied payload into the existing record. Settings supports only `GET` and `PATCH`, with defaults on first read and no delete. [client/src/services/storageService.js:42-59] [client/src/services/settingsService.js:20-65] [.github/instructions/backend.instructions.md:28,37-44,53]

### List query parameters

| resource | recommended query parameters | evidence |
|---|---|---|
| Tasks | `q`, `section`, `priority`, `status`, `category`, `tag`, `sort=dueAt\|priority`, `direction=asc\|desc`, `page`, `limit` | `client/src/utils/taskFilters.js:24-58`; `client/src/components/tasks/TaskFilters.jsx`; `.github/instructions/backend.instructions.md:43` |
| Applications | `q`, `company`, `status`, `jobType`, `source`, `sort=company\|jobTitle\|status\|appliedDate\|interviewAt\|followUpDate`, `direction=asc\|desc`, `page`, `limit` | `client/src/utils/applicationFilters.js:7-56`; `client/src/components/applications/ApplicationFilters.jsx`; `.github/instructions/backend.instructions.md:43` |
| Notes | `q`, `category`, `pinned`, `sort` (recommended; current UI filters locally and orders pinned/newest first) | `client/src/pages/NotesPage.jsx:52-62`; `.github/instructions/backend.instructions.md:43` |
| Calendar | `start`, `end` as ISO instants; filter events to the requested range | `client/src/services/calendarService.js:20-22,111-121` |
| Other lists | `page` (default 1), `limit` (default 100, max 500); add only filters needed by client controls | `.github/instructions/backend.instructions.md:43` |

For lists it aggregates over (task sections, Overview, Analytics), the client requests `limit=500` and warns if `meta.total` exceeds that limit. Task section classification stays client-side because `Today` depends on the viewer's local timezone and the task page compares due times to the current instant. It is mutually exclusive in this order: completed, undated/invalid upcoming, overdue, today, upcoming. The server may apply filters and return paginated matching tasks, but should not classify `today` as a fixed UTC day. [client/src/utils/taskFilters.js:13-21,24-58]

## Client-side logic that must move to the server

| logic | source range | server behavior |
|---|---|---|
| IDs, `createdAt`/`updatedAt`, latency-backed local persistence | `client/src/services/storageService.js:1-69`; `client/src/utils/storage.js:1-42` | Persist per authenticated owner; generate IDs and timestamps server-side; reject client attempts to set server-owned fields. |
| Application history creation and status-change append | `client/src/services/applicationService.js:15-19,43-61` | Initialize history on create; on a status change append `{status, at, note}` atomically. Treat `statusNote` as transient input and never trust client `statusHistory`. |
| Task completion timestamp and recurring instance creation | `client/src/services/taskService.js:40-70`; `client/src/utils/taskRecurrence.js:1-15` | Set/clear `completedAt`; create exactly one next instance for a completed recurring task in the same idempotent operation. |
| Learning progress | `client/src/services/learningService.js:5-8,11-48` | Derive progress from completed lessons; never persist or accept client progress. |
| Calendar aggregation and range filtering | `client/src/services/calendarService.js:20-121` | Build events from tasks, applications, projects and standalone events; persist only standalone events. |
| Settings first-read defaults and one-document behavior | `client/src/services/settingsService.js:5-65` | Create one settings record per user on first read and merge updates; do not expose deletion. |
| Client list filtering/search/sorting and application counts | `client/src/utils/taskFilters.js:24-58`; `client/src/utils/applicationFilters.js:7-77`; `client/src/pages/NotesPage.jsx:52-62` | Implement equivalent list query parameters/pagination; return consistent ordering and totals. Keep timezone-sensitive task section classification in client. |
| User ownership/auth guard | `client/src/context/AuthContext.jsx:3-74`; `.github/instructions/backend.instructions.md:28-34` | Authenticate all routes except the explicitly public health/register/login/refresh routes; apply `userId` to every query and never accept it from input. |

## Frontend assumptions to change in backend-3

1. Replace localStorage service implementations with API calls while retaining React Query hook ownership and invalidation. The current entity services delegate to `createStorageService`; `http.js` only adds a stored Bearer token and is not used by those services. [client/src/services/storageService.js:6-69] [client/src/services/http.js:1-21] [client/src/hooks/useTasks.js:1-79] [client/src/hooks/useApplications.js:1-108]
2. Adapt consumers to the backend response envelope and pagination metadata rather than treating every list as a complete local array. [client/src/hooks/useTasks.js:1-79] [.github/instructions/backend.instructions.md:37-44]
3. Remove client-supplied server-owned `id`, `userId`, timestamps, `statusHistory`, `completedAt`, and token fields from write payloads. [client/src/services/storageService.js:27-56] [.github/instructions/backend.instructions.md:32-33]
4. Send `statusNote` as a transient application update property; do not send replacement history. Task and application mutations need server-side idempotency/atomicity for completion and history updates. [client/src/services/applicationService.js:43-59] [client/src/services/taskService.js:40-70]
5. Normalize task form `recurring: 'none'` to stored/API `null`; a non-`none` recurrence requires `dueAt`. [client/src/components/tasks/TaskFormDialog.jsx:18,27-29,61-62] [client/src/validation/taskSchema.js:19-29]
6. Use date-only serializers per Approved decisions (2) for `appliedDate`, `followUpDate`, `nextRevisionDate`, project `startDate`/`targetDate`, and milestone `dueDate`; preserve UTC ISO instants for the fields listed there. [client/src/components/applications/ApplicationFormDialog.jsx:29,37-50] [client/src/pages/ProjectsPage.jsx:30] [client/src/pages/ProjectDetailPage.jsx:15,51,71] [client/src/pages/LearningPage.jsx:45] [client/src/pages/CalendarPage.jsx:36,100-101]
7. Fetch the computed calendar feed separately from CRUD for standalone events. Do not store derived task/application/project calendar entries. [client/src/services/calendarService.js:20-109,124-137]
8. Add `paused` to the project form and `link` to the Note form in backend-3, as decided in Approved decisions (7). [client/src/constants/status.js:25-29] [client/src/pages/ProjectsPage.jsx:128-132] [.agents/rules/00-RULES-lifeos.md:77-78] [client/src/pages/NotesPage.jsx:19-23]
9. The frontend dependency is Zod `3.25.76` while backend instructions require Zod `4.6.7` or newer; update/reconcile schema syntax before sharing schemas. [.agents/rules/00-RULES-lifeos.md:20] [.github/instructions/backend.instructions.md:19]
10. Replace the fake local auth lifecycle and `lifepilot:auth_token`/`lifepilot:user` storage with register/login/refresh/logout behavior and credentials-aware refresh-cookie requests. [client/src/context/AuthContext.jsx:3-74] [client/src/services/http.js:14-16] [.github/instructions/backend.instructions.md:28-34]
11. Do not import localStorage records in v1; keep Export JSON, as decided in Approved decisions (8). Seed data only initializes empty stores. [client/src/data/seed/index.js:8-30] [client/src/utils/storage.js:1-42]

## Mismatches

The backend instruction file has no canonical field-by-field entity list; its rule is to mirror the frontend contract. The explicit inventory is in the LifeOS frontend rules, so the following differences compare client behavior with that inventory. [`.github/instructions/backend.instructions.md:46-54`] [`.agents/rules/00-RULES-lifeos.md:73-82`]

| # | difference | recommendation |
|---|---|---|
| 1 | No entity schema list is defined in backend instructions; the backend rules refer to this contract. | Use the client-derived tables here as the canonical API schema; backend instructions need not duplicate them. |
| 2 | Shared storage adds `createdAt` and `updatedAt` to stored entities, but the LifeOS entity list omits them; backend instructions additionally classify these as server-owned. | Include them in response models only and generate them on the server. |
| 3 | Client auth persists an additional `User` object (`id`, `name`, `email`, `role`) not listed among the LifeOS entities. | Model the authenticated user for auth responses, but keep it separate from per-user profile settings; do not accept its ID as ownership input. |
| 4 | Only `TaskFormDialog` normalizes `recurring: 'none'` to `null`; `taskService` uses `payload.recurring || null`. The entity list describes stored values as `null` or recurrence values. | The API uses `null` for none and rejects `'none'`; keep `'none'` form-only. |
| 5 | Project constants and the entity list include `paused`, but both project forms expose only planning, active and completed. | Make the form support `paused` if it is a valid persisted status; otherwise remove it consistently from constants and contract. |
| 6 | Note entity list includes `link`, but the Note form exposes only note, interview_prep and resource. | Add `link` to the form or remove it from the agreed enum; avoid accepting a value the UI cannot edit. |
| 7 | Client pins Zod `3.25.76`; backend instructions require Zod `4.6.7` or newer. | Upgrade/reconcile to the backend-required major before sharing validators. |
| 8 | Auth is a fake local JWT/user store, not backend JWT + refresh-cookie auth; the client also has no migration path for its local entities. | Replace auth with the specified server lifecycle and decide/implement local data import before cutover. |

**Mismatch count: 8.** The missing backend entity inventory is counted as a documentation mismatch; other rows are code/model differences or explicit client/backend rule conflicts. [`.agents/rules/00-RULES-lifeos.md:20,73-82`] [`.github/instructions/backend.instructions.md:19,28-34,46-54`] [client/src/services/storageService.js:27-56] [client/src/context/AuthContext.jsx:3-74]

## Open questions

These questions are decided; see the Approved decisions section. Evidence is retained below.

1. **Task `recurring`: null or `none`?** Decided. See Approved decisions (1). Evidence: schema accepts `'none'`, form maps it to null, service defaults to null, and seeds use null. [client/src/validation/taskSchema.js:19-29] [client/src/components/tasks/TaskFormDialog.jsx:18,29,62] [client/src/services/taskService.js:32] [client/src/data/seed/tasks.part1.js:20-26]
2. **Date representation for every date field?** Decided. See Approved decisions (2). Evidence: current date inputs and serializers use ISO timestamps, including date-only fields converted from local input values. [client/src/data/seed/applications.part1.js:3-4,15,23-25,27-31] [client/src/components/applications/ApplicationFormDialog.jsx:29,37-50] [client/src/services/applicationService.js:16-19,28,36-40,53-59] [client/src/components/tasks/TaskFormDialog.jsx:27,61] [client/src/services/taskService.js:33,49] [client/src/pages/LearningPage.jsx:45] [client/src/pages/ProjectsPage.jsx:30] [client/src/pages/ProjectDetailPage.jsx:15,51,71] [client/src/data/seed/projects.seed.js:3,15-23] [client/src/pages/CalendarPage.jsx:36,100-101] [client/src/services/storageService.js:29-56].
3. **Monthly recurrence drift and anchor day?** Decided. Decided differently: see Approved decisions (3). Evidence: client computes each next occurrence from the previous due date using `addMonths(date, 1)` and creates the next instance with that computed date; no anchor is stored, and the server does not know the user's timezone. [client/src/utils/taskRecurrence.js:3-15] [client/src/services/taskService.js:62-70]
4. **PUT or PATCH per entity?** Decided. See Approved decisions (4). Evidence: updates accept partial payloads and merge with existing state; Settings is a single document with no remove operation. [client/src/services/storageService.js:42-59] [client/src/services/taskService.js:40-70] [client/src/services/applicationService.js:43-61] [client/src/services/learningService.js:43-50] [client/src/services/projectService.js:30-36] [client/src/services/noteService.js:27-33] [client/src/services/settingsService.js:47-65] [client/src/services/calendarService.js:124-138]
5. **Which list query parameters, and where should task sections be computed?** Decided. See Approved decisions (5). Evidence: task section classification uses `isToday` and current time; filters/sorts are client-side. [client/src/utils/taskFilters.js:13-58] [client/src/utils/applicationFilters.js:7-77] [client/src/pages/NotesPage.jsx:52-62] [.github/instructions/backend.instructions.md:43]
6. **How should application `statusNote` work?** Decided. See Approved decisions (6). Evidence: update removes input `statusHistory`, extracts `statusNote`, and appends a history entry only when status differs; create initializes history. [client/src/services/applicationService.js:15-19,43-59] [.github/instructions/backend.instructions.md:50]
7. **What are the exact stored fields where the rules are broad or underspecified?** Decided. See Approved decisions (7) for the additional server limits and frontend enum changes; the entity tables document stored fields. Evidence: [client/src/services/settingsService.js:5-17] [client/src/services/calendarService.js:7,124-137] [client/src/pages/CalendarPage.jsx:24-29,100-101,204-219] [client/src/services/learningService.js:28-47] [client/src/services/projectService.js:14-25] [client/src/services/noteService.js:14-25] [.agents/rules/00-RULES-lifeos.md:76-82]
8. **Is one-time localStorage import needed?** Decided. Decided differently: see Approved decisions (8). Evidence: seed initialization only fills missing/empty storage and does not upload existing records. [client/src/data/seed/index.js:8-30] [client/src/utils/storage.js:1-42] [client/src/services/storageService.js:27-69]

## Auth: current stub vs backend rules

| operation | client behavior today | backend rules / gap |
|---|---|---|
| Register | `RegisterPage` submits `{name,email,password}` to `register`; `AuthContext.register` immediately calls local `login` and sends no HTTP request. | Public `POST /api/auth/register`; backend requires password minimum 10 and may return 403 when `ALLOW_REGISTRATION=false`. The backend rules do not define the complete request/response field schema. [client/src/pages/RegisterPage.jsx:21-25] [client/src/context/AuthContext.jsx:60-62] [.github/instructions/backend.instructions.md:30,34] |
| Login | Login form submits email/password; demo button uses fixed demo credentials. `AuthContext.login` ignores password and creates a fake token with a 24-hour expiry. | Public `POST /api/auth/login`; return a 15-minute access JWT for `Authorization: Bearer` and set an opaque 7-day refresh cookie. [client/src/pages/LoginPage.jsx:28-42,65-90] [client/src/context/AuthContext.jsx:41-53] [.github/instructions/backend.instructions.md:28-30] |
| Token storage/refresh | Token stored at `lifepilot:auth_token`; user at `lifepilot:user`; no refresh flow. `http.js` attaches the local token as Bearer, but entity services do not call HTTP. | Refresh token must be httpOnly, sameSite=lax, secure in production, hashed in DB, rotated on refresh; CORS must allow credentials. Gap: client must use credentials for refresh and handle expired access tokens. [client/src/context/AuthContext.jsx:3-4,29-53] [client/src/services/http.js:14-16] [.github/instructions/backend.instructions.md:28-29] |
| Logout | Removes both localStorage entries; no network call. | Backend rules require revocation on logout and password change, and token reuse revokes all that user's tokens. The logout route path is unspecified; proposed route is `POST /api/auth/logout`. [client/src/context/AuthContext.jsx:63-68] [.github/instructions/backend.instructions.md:28] |
| User/ownership | Stub returns fixed `usr_demo_01`; profile updates stay local. | Every document must have server-side `userId`; every query scopes by authenticated user; never accept `userId` from request input. Gap: do not use the stub ID for API ownership. [client/src/context/AuthContext.jsx:16-20,45-50,70-74] [.github/instructions/backend.instructions.md:31] |

## Derived, never stored

| derived value | computation | source |
|---|---|---|
| Task sections and section counts | Completed tasks are separate; dated overdue tasks precede same-day tasks; undated/invalid and later dates are upcoming. List query also computes counts and applies client-side filtering/sorting. | `client/src/utils/taskFilters.js:13-58`; `client/src/components/tasks/TasksDashboard.jsx:16,28,100,113`; `client/src/components/tasks/TaskSections.jsx:5-28` |
| Learning progress | `round(doneLessons / lessons * 100)`; removed from create/update payloads and returned as a computed property. | `client/src/services/learningService.js:5-8,11-48` |
| Project completion/progress | Completed milestones divided by all milestones, rounded to percent; no standalone progress field is stored. | `client/src/pages/ProjectsPage.jsx:69-72`; `client/src/pages/ProjectDetailPage.jsx:108-110` |
| Application counts/stats | Counts per status, active/interviews/offers/rejections/response rate, and filter options are computed from applications. | `client/src/utils/applicationFilters.js:58-77`; `client/src/components/applications/ApplicationsDashboard.jsx:29-32,117` |
| Calendar entries | Task due dates, application interview/assessment/follow-up dates, project target/milestone dates, and standalone events are combined and range-filtered. Only standalone events are stored. | `client/src/services/calendarService.js:20-121`; `.agents/rules/00-RULES-lifeos.md:81-82` |
| Overview metrics and Analytics charts | Overdue/open tasks, active applications/projects, upcoming events, completion and weekly aggregates are computed from entity lists. | `client/src/pages/OverviewPage.jsx:64-73,109-150,183`; `client/src/pages/AnalyticsPage.jsx:100-124,146-181` |
| Notes display list | Categories, filtered notes, and pinned/updated ordering are computed from stored notes. | `client/src/pages/NotesPage.jsx:52-62` |

## Files read

The following source files and rule/document files were read for this audit. File paths are repository-relative.

**Rules and documentation**
- `.agents/rules/00-RULES-lifeos.md`
- `.github/instructions/backend.instructions.md`
- `docs/PROGRESS.md`

**Services**
- `client/src/services/applicationService.js`
- `client/src/services/calendarService.js`
- `client/src/services/http.js`
- `client/src/services/learningService.js`
- `client/src/services/noteService.js`
- `client/src/services/projectService.js`
- `client/src/services/settingsService.js`
- `client/src/services/storageService.js`
- `client/src/services/taskService.js`

**Hooks**
- `client/src/hooks/useApplications.js`
- `client/src/hooks/useCalendarEvents.js`
- `client/src/hooks/useDebounce.js`
- `client/src/hooks/useLearningGoals.js`
- `client/src/hooks/useNotes.js`
- `client/src/hooks/useProjects.js`
- `client/src/hooks/useSettings.js`
- `client/src/hooks/useTasks.js`

**Validation, constants, and utilities**
- `client/src/validation/applicationSchema.js`
- `client/src/validation/taskSchema.js`
- `client/src/constants/jobTypes.js`
- `client/src/constants/navigation.js`
- `client/src/constants/routes.js`
- `client/src/constants/status.js`
- `client/src/utils/applicationFilters.js`
- `client/src/utils/cn.js`
- `client/src/utils/formatters.js`
- `client/src/utils/storage.js`
- `client/src/utils/taskFilters.js`
- `client/src/utils/taskRecurrence.js`

**Seeds**
- `client/src/data/seed/applications.part1.js`
- `client/src/data/seed/applications.part2.js`
- `client/src/data/seed/applications.seed.js`
- `client/src/data/seed/index.js`
- `client/src/data/seed/learning.seed.js`
- `client/src/data/seed/notes.seed.js`
- `client/src/data/seed/projects.seed.js`
- `client/src/data/seed/settings.seed.js`
- `client/src/data/seed/tasks.part1.js`
- `client/src/data/seed/tasks.part2.js`
- `client/src/data/seed/tasks.seed.js`

**Context, routes, and application/auth pages**
- `client/src/context/AuthContext.jsx`
- `client/src/context/ThemeContext.jsx`
- `client/src/routes/AppRoutes.jsx`
- `client/src/routes/ProtectedRoute.jsx`
- `client/src/main.jsx`
- `client/src/pages/AnalyticsPage.jsx`
- `client/src/pages/ApplicationDetailPage.jsx`
- `client/src/pages/ApplicationsPage.jsx`
- `client/src/pages/CalendarPage.jsx`
- `client/src/pages/LearningPage.jsx`
- `client/src/pages/LoginPage.jsx`
- `client/src/pages/NotesPage.jsx`
- `client/src/pages/OverviewPage.jsx`
- `client/src/pages/ProjectDetailPage.jsx`
- `client/src/pages/ProjectsPage.jsx`
- `client/src/pages/RegisterPage.jsx`
- `client/src/pages/SettingsPage.jsx`
- `client/src/pages/TasksPage.jsx`

**Entity-related components**
- `client/src/components/applications/ApplicationCard.jsx`
- `client/src/components/applications/ApplicationDetails.jsx`
- `client/src/components/applications/ApplicationFilters.jsx`
- `client/src/components/applications/ApplicationFormDialog.jsx`
- `client/src/components/applications/ApplicationHistory.jsx`
- `client/src/components/applications/ApplicationKanban.jsx`
- `client/src/components/applications/ApplicationPipeline.jsx`
- `client/src/components/applications/ApplicationRecruiterFields.jsx`
- `client/src/components/applications/ApplicationSkillsField.jsx`
- `client/src/components/applications/ApplicationStats.jsx`
- `client/src/components/applications/ApplicationStatusControl.jsx`
- `client/src/components/applications/ApplicationsDashboard.jsx`
- `client/src/components/applications/ListView.jsx`
- `client/src/components/common/PriorityBadge.jsx`
- `client/src/components/common/StatusBadge.jsx`
- `client/src/components/layout/GlobalSearchDialog.jsx`
- `client/src/components/layout/QuickAddMenu.jsx`
- `client/src/components/layout/UserMenu.jsx`
- `client/src/components/tasks/KanbanBoard.jsx`
- `client/src/components/tasks/ListView.jsx`
- `client/src/components/tasks/TaskCard.jsx`
- `client/src/components/tasks/TaskFilters.jsx`
- `client/src/components/tasks/TaskFormDialog.jsx`
- `client/src/components/tasks/TaskSections.jsx`
- `client/src/components/tasks/TasksDashboard.jsx`

`docs/BACKEND_INTEGRATION.md` was checked for existence and is not present; its contents were therefore not read. The existing `docs/API_CONTRACT.md` draft was not used as a source.
