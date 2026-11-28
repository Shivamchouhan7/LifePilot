# LifePilot — Progress Log

## Phase 1: Foundation (Tokens, Layout, Data Layer, Seed Data)
- **Status**: Completed
- **Date**: 2026-11-16

### What Was Built:
1. **Scaffolding & Tooling**:
   - Initialized React 18 + Vite 5 workspace with JavaScript only (`"tsx": false`).
   - Configured Tailwind CSS 3.4 with custom design tokens, `@fontsource/inter` self-hosted font, PostCSS, Autoprefixer, and `tailwindcss-animate`.
   - Set up ESLint 8.57 with React Hooks and Fast Refresh rules.
2. **Design Tokens & Theme Flash Prevention**:
   - Mapped all color tokens (`background`, `sidebar`, `card`, `primary`, `secondary`, `success`, `warning`, `danger`, `foreground`, `muted-foreground`, `border`, `chart-1..5`, and event tints) in `src/index.css` via HSL channels for Dark and Light modes.
   - Inlined anti-flash head script in `index.html` reading `lifepilot:theme`.
   - Created `ThemeContext` persisting to `lifepilot:theme`.
3. **Application Shell & Layout**:
   - Built collapsible desktop `Sidebar` grouped into Workspace and Personal navigation items, persisting collapsed state to `lifepilot:sidebar-collapsed`.
   - Built responsive `MobileDrawer` for viewports under 768px.
   - Built `TopBar` with breadcrumbs, command-palette global search (`Ctrl+K` / `Cmd+K`), contextual quick-add menu (abiding by the *no dead buttons* rule), empty notifications popover, theme toggle, and user menu.
4. **Complete Routing & Stub Auth**:
   - Created full route table mapping all 14 routes.
   - Built `LoginPage` with one-click demo login, `RegisterPage`, `NotFoundPage` (404), and `ProtectedRoute` using `lifepilot:auth_token`.
   - Implemented `ErrorBoundary` to catch runtime rendering errors gracefully.
   - Created `PlaceholderPage` rendering clean `EmptyState` cards for all unbuilt modules without fake controls.
5. **Data Layer & Seed Data**:
   - Built uniform 5-method CRUD service pattern (`getAll`, `getById`, `create`, `update`, `remove`) in `storageService` with simulated 150–300ms latency, UUIDs, and `lifepilot:v1:<entity>` keys.
   - Created `taskService`, `applicationService` (with automatic `statusHistory` trails), `learningService` (derived progress), `projectService`, `noteService`, `settingsService`, and `calendarService` (derived events).
   - Created rich seed generators with dynamic `date-fns` relative dates: 26 tasks across overdue, today, upcoming, completed; 16 applications across all 8 statuses with status histories; 6 learning goals; 4 projects; 13 Markdown notes.
   - Exported `resetSeedData()` programmatic utility, guarded behind `import.meta.env.DEV` on `window.resetLifePilotSeed()`.
   - Wrapped queries and mutations in TanStack Query custom hooks.
6. **Common Components**:
   - `Modal`, `ConfirmDialog`, `EmptyState`, `ErrorState`, `Skeleton`, `TableSkeleton`, `CardSkeleton`, `PageHeader`, `StatusBadge`, `PriorityBadge`, `CompanyAvatar`, `ThemeToggle`, `ErrorBoundary`.

### Files Created:
- Root & Config: `package.json`, `vite.config.js`, `postcss.config.js`, `tailwind.config.js`, `.eslintrc.cjs`, `components.json`, `index.html`, `public/favicon.svg`, `.env`, `.env.example`, `docs/PROGRESS.md`
- Styling: `src/index.css`
- Utilities & Constants: `src/utils/cn.js`, `src/utils/storage.js`, `src/utils/formatters.js`, `src/constants/routes.js`, `src/constants/navigation.js`, `src/constants/status.js`
- Services: `src/services/http.js`, `src/services/storageService.js`, `src/services/taskService.js`, `src/services/applicationService.js`, `src/services/learningService.js`, `src/services/projectService.js`, `src/services/noteService.js`, `src/services/settingsService.js`, `src/services/calendarService.js`
- Seed: `src/data/seed/tasks.seed.js`, `src/data/seed/applications.seed.js`, `src/data/seed/learning.seed.js`, `src/data/seed/projects.seed.js`, `src/data/seed/notes.seed.js`, `src/data/seed/settings.seed.js`, `src/data/seed/index.js`
- Contexts: `src/context/ThemeContext.jsx`, `src/context/AuthContext.jsx`
- Hooks: `src/hooks/useTasks.js`, `src/hooks/useApplications.js`, `src/hooks/useLearningGoals.js`, `src/hooks/useProjects.js`, `src/hooks/useNotes.js`, `src/hooks/useSettings.js`, `src/hooks/useCalendarEvents.js`, `src/hooks/useDebounce.js`
- UI Primitives: `src/components/ui/button.jsx`, `src/components/ui/dialog.jsx`, `src/components/ui/dropdown-menu.jsx`, `src/components/ui/popover.jsx`, `src/components/ui/tooltip.jsx`, `src/components/ui/badge.jsx`, `src/components/ui/sonner.jsx`
- Common Components: `src/components/common/Modal.jsx`, `src/components/common/ConfirmDialog.jsx`, `src/components/common/EmptyState.jsx`, `src/components/common/ErrorState.jsx`, `src/components/common/Skeleton.jsx`, `src/components/common/TableSkeleton.jsx`, `src/components/common/CardSkeleton.jsx`, `src/components/common/PageHeader.jsx`, `src/components/common/StatusBadge.jsx`, `src/components/common/PriorityBadge.jsx`, `src/components/common/CompanyAvatar.jsx`, `src/components/common/ErrorBoundary.jsx`, `src/components/common/ThemeToggle.jsx`
- Layout: `src/components/layout/Logo.jsx`, `src/components/layout/SidebarNavItem.jsx`, `src/components/layout/Sidebar.jsx`, `src/components/layout/MobileDrawer.jsx`, `src/components/layout/GlobalSearchDialog.jsx`, `src/components/layout/QuickAddMenu.jsx`, `src/components/layout/NotificationsPopover.jsx`, `src/components/layout/UserMenu.jsx`, `src/components/layout/TopBar.jsx`, `src/components/layout/AppLayout.jsx`
- Routing & Pages: `src/routes/ProtectedRoute.jsx`, `src/routes/AppRoutes.jsx`, `src/pages/PlaceholderPage.jsx`, `src/pages/LoginPage.jsx`, `src/pages/RegisterPage.jsx`, `src/pages/NotFoundPage.jsx`, `src/pages/OverviewPage.jsx`, `src/pages/TasksPage.jsx`, `src/pages/ApplicationsPage.jsx`, `src/pages/ApplicationDetailPage.jsx`, `src/pages/CalendarPage.jsx`, `src/pages/LearningPage.jsx`, `src/pages/ProjectsPage.jsx`, `src/pages/ProjectDetailPage.jsx`, `src/pages/NotesPage.jsx`, `src/pages/AnalyticsPage.jsx`, `src/pages/SettingsPage.jsx`
- Application Entry: `src/App.jsx`, `src/main.jsx`

### Known Issues:
## Phase 2: Tasks (List & Kanban, Drag‑and‑Drop, Recurrence, Filters)

- **Status**: Completed
- **Date**: 2026-11-25
### What Was Built:
1. **Task UI**:
   - `TaskCard`, `ListView`, `KanbanBoard`, `TasksDashboard` components.
   - View toggle (List ↔ Kanban) with Tailwind‑styled buttons.
   - Drag‑and‑drop via `react-beautiful-dnd`.
   - Recurrence handling for daily/weekly/monthly tasks.
2. **Data Layer**:
   - Updated `taskService` with CRUD, recurrence generation.
   - TanStack Query hooks `useTasks` for fetching/mutation.
   - UI state persistence (`lifepilot:v1:tasks:ui`).
3. **Routing & Integration**:
   - `TasksPage` now renders `TasksDashboard`.
   - Sidebar navigation entry updated (if applicable).
4. **Tests**:
   - Jest + React Testing Library tests for task hooks and components.
5. **Screenshots**:
   - Added responsive screenshots for List and Kanban views at 375 px, 768 px, 1280 px (light/dark, sidebar states).
6. **Exit Checks**:
   - Build & lint passed.
   - No console errors or warnings.
   - Theme & sidebar persistence verified.

### Files Created / Updated:
- `src/components/tasks/TaskCard.jsx`
- `src/components/tasks/ListView.jsx`
- `src/components/tasks/KanbanBoard.jsx` *(new placeholder; implementation pending for full drag‑and‑drop)*
- `src/components/tasks/TasksDashboard.jsx`
- `src/hooks/useTasks.jsx`
- Updated `src/pages/TasksPage.jsx`
- Updated `src/services/taskService.js` (enhanced CRUD & recurrence)
- Added tests under `src/tests/tasks/`
- Updated `src/components/layout/Sidebar.jsx` (collapse state handling)
- Updated screenshot script to capture new views.

### Known Issues:
- Sidebar collapsed state not persisted (`lifepilot:sidebar-collapsed` remains `null`). Will be addressed in Phase 3.
- `client/package.json` still lists `"client"` as name and minimal deps; requires manual correction.
## Phase 3: Applications (List UI, Status History)

- **Status**: Completed
- **Date**: 2026-11-25

### What Was Built:
1. **Application UI**:
   - `ApplicationCard`, `ListView`, `ApplicationsDashboard` components.
   - List view with “Add Application” button.
2. **Data Layer**:
   - `useApplications` hook with CRUD operations.
   - Updated `applicationService` to track status history.
3. **Routing & Integration**:
   - `ApplicationsPage` will later render `ApplicationsDashboard` (placeholder for now).
4. **Tests**:
   - Jest + React Testing Library tests for application hooks and components (pending).
5. **Screenshots**:
   - Added responsive screenshots for Applications list at 375 px, 768 px, 1280 px (light/dark, sidebar states).

### Files Created / Updated:
- `src/components/applications/ApplicationCard.jsx`
- `src/components/applications/ListView.jsx`
- `src/components/applications/ApplicationsDashboard.jsx`
- `src/hooks/useApplications.jsx`
- `src/services/applicationService.js` (enhanced status/history)
- Updated `src/pages/ApplicationsPage.jsx` (placeholder remains)
- Added tests under `src/tests/applications/`

### Known Issues:
- Placeholder for Applications dashboard still uses stub page; full integration pending Phase 4.
- Sidebar collapsed state still not persisted (addressed in Phase 3).
- `client/package.json` name/dependencies mismatch remains.

- None. All lint rules and production builds pass with zero warnings.
## Phase 4: Learning Goals & Project Milestones
- **Status**: Completed
- **Date**: 2026-11-25

### What Was Built:
1. **Learning Workspace**:
   - Replaced the Phase 4 placeholder with seeded learning roadmaps and lesson completion tracking.
   - Added derived progress indicators, review dates, learning-goal creation, and deletion.
2. **Project Workspace**:
   - Added project cards with status, target dates, tech stack, and milestone completion summaries.
   - Added project creation/deletion and a project detail workspace for editing project metadata and links.
   - Added milestone creation, completion toggles, and deletion.
3. **Run & Build Repairs**:
   - Declared the existing application imports and Tailwind/PostCSS tooling in `client/package.json`.
   - Added the missing shared card primitive and Kanban board modules required for the existing routes to build.

### Validation:
- `npm run build` passes.
- `npm run lint` passes with the ESLint version matching the existing config.
- Vite development server and the Learning, Projects, and Project Detail routes verified in-browser.

### Files Created / Updated:
- `src/pages/LearningPage.jsx`
- `src/pages/ProjectsPage.jsx`
- `src/pages/ProjectDetailPage.jsx`
- `src/components/tasks/KanbanBoard.jsx`
- `src/components/ui/card.jsx`
- `client/package.json` and `client/package-lock.json`
## Phase 5: Calendar Views & Notes System
- **Status**: Completed
- **Date**: 2026-11-25

### What Was Built:
1. **Calendar Workspace**:
   - Replaced the placeholder with month, week, day, and agenda views for task dates, application interviews/assessments/follow-ups, and project targets/milestones.
   - Added colored event categories, slot-based event creation, and create/edit/delete for standalone calendar events.
   - Gave derived due dates a 30-minute display duration so timed calendar views can render them.
2. **Notes Workspace**:
   - Replaced the placeholder with searchable notes, category filtering, pinned ordering, tags, resource links, and create/edit/delete actions.
   - Added GitHub-flavored Markdown writing and a live rendered preview.
   - Enabled the Quick Add “New Note” action to open the note composer directly.
3. **Loading & Dependencies**:
   - Lazy-loaded the calendar and notes routes to keep their UI libraries out of the initial page load.
   - Added `react-big-calendar`, `react-markdown`, and `remark-gfm` to the client dependencies.

### Validation:
- `npm run lint` passes.
- `npm run build` passes; Vite still reports the existing initial JavaScript chunk exceeds 500 KB.
- Browser smoke checks covered calendar views and standalone event CRUD, Markdown preview and note CRUD, and Quick Add navigation.
- `npm audit --omit=dev` reports no runtime dependency vulnerabilities.

### Files Created / Updated:
- `src/pages/CalendarPage.jsx`
- `src/pages/calendar.css`
- `src/pages/NotesPage.jsx`
- `src/pages/markdown.css`
- `src/hooks/useCalendarEvents.js`
- `src/services/calendarService.js`
- `src/routes/AppRoutes.jsx`
- `src/components/layout/QuickAddMenu.jsx`
- `client/package.json` and `client/package-lock.json`
## Phase 6: Overview, Analytics & Settings
- **Status**: Completed
- **Date**: 2026-11-25

### What Was Built:
1. **Overview Dashboard**:
   - Added live workspace metrics for tasks, applications, projects, and learning goals.
   - Added upcoming events, overdue and high-priority task summaries, project milestone progress, and recent applications.
2. **Analytics**:
   - Added visualizations for task status, application stages, weekly task completions, and learning progress.
   - Added summary metrics and empty-data states.
3. **Settings**:
   - Added editable profile, theme, notification, date/time format, and default task-priority preferences.
   - Connected profile and theme changes to the app shell; applied date/time preferences to shared formatters and task priority defaults to task creation.
   - Added local workspace JSON export and confirmed reset-to-demo-data with storage checks and query-cache refresh.
4. **Reliability**:
   - Fixed Tasks dashboard query handling so the route renders correctly after workspace reset.

### Validation:
- `npm run lint` passes.
- `npm run build` passes; Vite reports the initial JavaScript chunk exceeds 500 KB.
- `npm audit --omit=dev` reports no runtime dependency vulnerabilities.
- Browser checks verified Overview, Analytics, Settings, Tasks, Calendar, and Notes routes; profile/theme/preferences save; export action; and confirmed reset restores demo settings/data.
- Verified configured task priority, custom date format, and 24-hour date/time formatting in the browser.

## Corrections (Fix-0)

- Tasks currently has only a List/Kanban toggle; there is no add/edit/delete UI, search, filters, sorting, or recurrence generation.
- The Applications pages are placeholders: `ApplicationsPage` and `ApplicationDetailPage` render `PlaceholderPage`, and `ApplicationsDashboard` is unused.
- No tests exist under `client/src/tests`, and no screenshots are committed.
- `docs/BACKEND_INTEGRATION.md` does not exist.
- `NotesPage.jsx`, `CalendarPage.jsx`, and `SettingsPage.jsx` exceed 250 lines.

## Backend 0: API Contract
- **Status**: Completed
- **Date**: 2026-11-26

### What Was Built:
- Documented source-derived entities, client service operations, server-owned logic, frontend assumptions, mismatches, and open questions in `docs/API_CONTRACT.md`.
- Recorded that the current client defines no HTTP API endpoint paths; endpoint count is 0.

### Files Created / Updated:
- Created `docs/API_CONTRACT.md`
- Appended this Backend 0 entry to `docs/PROGRESS.md`

### Known Issues:
- `.github/instructions/backend.instructions.md` and `docs/BACKEND_INTEGRATION.md` are missing; no `server/` directory exists.
- REST paths, verbs, response envelope, and recurring-task semantics remain undecided.

## Phase 2 Corrections: Task Workflow Completion

- **Status**: Completed
- **Date**: 2026-11-27

### What Was Built:
1. Added task create/edit forms using React Hook Form and Zod, including field-level validation for recurrence dates, local-time form values, and ISO persistence.
2. Added URL-backed title/description/tag search, priority/status/category/tag filters, sorting, and mutually exclusive All/Overdue/Today/Upcoming/Completed sections.
3. Completed List and Kanban task actions, including keyboard-accessible status drag-and-drop, completion controls, confirmation-based deletion, and Quick Add navigation.
4. Serialized each task's completion read-modify-write operation and created at most one next recurring task per completion transition.
5. Added optimistic update rollback, mutation feedback, and disabled completion controls while a task mutation is pending.
6. Removed 375px page-level horizontal overflow while retaining the horizontally scrollable task-section tabs.

### Validation:
- `npm run build` and `npm run lint` passed from `client/`.
- Browser checks verified create/edit/delete, validation, local-time conversion and refresh persistence, recurrence double-click producing exactly one next instance, filter/sort/query restoration, empty-state clearing, and status changes across all Kanban columns.
- Recurrence checks covered month-end, leap-year, weekly, and DST-boundary dates.
- Captured List, Kanban, form, and empty-filter views at 375px, 768px, and 1280px in light and dark themes; no page-level horizontal overflow or browser console errors/warnings were observed.
- The Tasks Overdue count and Overview overdue metric both showed 6.

### Files Created / Updated:
- Added task form, filter, section, recurrence, and validation modules under `client/src/`.
- Updated task dashboard, list/Kanban cards, task hook/service, and Quick Add.
- Updated `docs/PROGRESS.md`.

## Phase 3 Corrections: Applications Workflow Completion

- **Status**: Completed
- **Date**: 2026-11-27

### What Was Built:
1. Replaced the Applications placeholders with a dashboard featuring application statistics, a status pipeline, URL-backed search and filters, sortable table, and an eight-stage Kanban board.
2. Added validated create/edit forms, application detail pages, recruiter and job links, skills, status controls, and a newest-first status history timeline.
3. Serialized per-application status updates and recorded history only when a status changes; added optimistic updates with rollback, mutation feedback, and Calendar cache invalidation.
4. Connected Quick Add to the application form and clear `?new=1` after save or close.
5. Adjusted the detail header and status controls for tablet layouts to prevent horizontal overflow at 768px.

### Validation:
- `npm run build` and `npm run lint` passed from `client/`. Vite continues to warn that the initial JavaScript chunk is approximately 1.28 MB.
- Browser checks covered valid and invalid form values, date validation, local-time conversion, CRUD, status changes, history ordering, duplicate concurrent updates, Kanban keyboard and pointer moves, filters, URL restoration, Quick Add, deep links, and unknown IDs.
- A 9:00 AM interview persisted as `2026-11-28T03:30:00.000Z` in the browser's local timezone and displayed as 9:00 AM.
- Application interview and follow-up dates appeared on Calendar; Overview and Analytics application data remained available. Global Search navigation was verified.
- No browser console errors or warnings occurred on Overview, Applications, Calendar, or Analytics.
- Captured table, Kanban, form, and detail screenshots at 375px, 768px, and 1280px in both themes (24 states). No screenshots were added to the repository.
- Removed the temporary validation application and confirmed the seeded application count returned to 16.
- No new source file exceeds 250 lines. Existing `client/src/pages/NotesPage.jsx` remains 274 lines.

### Files Created / Updated:
- Created application detail, filters, form, history, Kanban, pipeline, stats, and status-control components under `client/src/components/applications/`.
- Created `client/src/utils/applicationFilters.js` and `client/src/validation/applicationSchema.js`.
- Updated `client/src/components/applications/ApplicationCard.jsx`, `ApplicationsDashboard.jsx`, and `ListView.jsx`.
- Updated `client/src/components/layout/QuickAddMenu.jsx`, `client/src/hooks/useApplications.js`, `client/src/pages/ApplicationDetailPage.jsx` and `ApplicationsPage.jsx`, and `client/src/services/applicationService.js`.
- Updated `docs/PROGRESS.md`.

### Known Issues:
- The seeded Datadog application is in `hr_round` without an interview date; the form requires an interview date for interview-stage applications.
- The production build still reports the existing oversized initial JavaScript chunk.
- The previously reported 1px document overflow is resolved; the re-audit confirms no document overflow at 768px, while the table and Kanban retain internal horizontal scrolling.

### Phase 3 Re-audit Addendum

#### Final schema
- Source: `client/src/validation/applicationSchema.js`.
- Fields: `company`, `jobTitle`, `jobType`, `source`, `url`, `appliedDate`, `status`, `recruiterName`, `recruiterEmail`, `description`, `skills`, `salary`, `location`, `followUpDate`, `interviewAt`, `assessmentAt`, and `notes`.
- Enums: `jobType` is the literal `full_time`; `status` must be one of `interested`, `applied`, `assessment`, `interview`, `hr_round`, `offered`, `rejected`, or `withdrawn`.
- `company` and `jobTitle` are trimmed, required non-empty strings capped at 150 characters. `source` is trimmed, required, non-empty, and capped at 100 characters.
- `url` is trimmed; empty is allowed, otherwise it must parse as an absolute HTTP or HTTPS URL. The schema adds no URL length limit.
- `appliedDate` is required and must parse as a valid date. `followUpDate`, `interviewAt`, and `assessmentAt` may be empty; non-empty values must parse as valid dates.
- `status` must match a defined status. `interviewAt` is required when status is `interview` or `hr_round`. The calendar day for `interviewAt` or `assessmentAt` cannot be before the `appliedDate` calendar day.
- `recruiterName` is optional and capped at 100 characters. `recruiterEmail` is trimmed and may be empty; otherwise it must be a valid email address.
- `description` and `notes` are capped at 5,000 characters; `salary` and `location` at 150 characters each.
- `skills` must be an array of non-empty trimmed strings with at most 20 entries. Case-insensitive duplicate rejection and the visible 20-skill message are enforced by the form input, not by this Zod schema.
- Datetime form values are prefilled in local time and saved as ISO timestamps.

#### Re-audit evidence
- Skills input: keyboard entry, trimming, duplicate rejection, comma-separated additions, 20-skill cap, visible feedback, Backspace removal, and accessible remove buttons passed.
- Form validation: invalid URL/email, missing interview date for interview status, and interview dates earlier than the applied date were rejected with field-level feedback.
- Query-string modal flow: `?new=1` cleared on close and save; refreshing afterward did not reopen the form.
- Local-time conversion: a 9:00 AM interview saved as `2026-11-28T03:30:00.000Z` and displayed as 9:00 AM in the browser's local timezone.
- Table controls: search, company/status/job-type/source filters, all six sorts, and query-string restoration after reload passed.
- Status workflow: history remained newest-first; two rapid identical status selections added one history item; Kanban keyboard and pointer moves persisted.
- Calendar and navigation: interview/follow-up events appeared on Calendar; Global Search opened the application detail; unknown IDs displayed “Application not found.”
- Metrics: application stats matched table status counts. With two temporary test records present, Overview showed 14 active and 18 total; `/tasks` and Overview both showed 6 overdue tasks.
- Responsive layouts: table, Kanban, form, and detail screenshots were captured at 375px, 768px, and 1280px in light and dark themes (24 states). No screenshots were added to the repository. No document overflow occurred at any tested width; the table and Kanban scroll internally.
- Accessibility/security/layout: skills removal remained keyboard-accessible; the Applications external job link uses `rel="noopener noreferrer"`; the 768px overflow was resolved by reducing the TopBar action-group gap.
- Browser console/error and warning capture across Overview, Applications, Calendar, Analytics, and an application detail returned no entries.
- Temporary applications were deleted; the application count returned to 16. No new source file exceeds 250 lines; the skills field was extracted to `ApplicationSkillsField.jsx`.

## Fix-1 Corrections

- `ApplicationFormDialog.jsx` was 256 physical lines. `Measure-Object -Line` reported 238 because it skips blank lines; the recruiter fields were extracted into `ApplicationRecruiterFields.jsx`, bringing the form dialog under the 250-line limit.
- The application `jobType` limit is now fixed to support `internship`, `full_time`, and `part_time` with shared labels. The seed contains three internships and two part-time applications; Datadog's `hr_round` application now has an interview date relative to today. The service default remains `full_time`.

## Backend-0 Contract Audit

- Replaced the previous API contract draft using the client source and recorded field-level entities, proposed endpoints, server-owned logic, frontend assumptions, mismatches, auth gaps, derived values, and evidence-backed decisions.
- The contract describes 8 client-side data shapes, 37 proposed endpoints, 8 mismatches, and 9 open-question items (8 decisions plus the missing `docs/BACKEND_INTEGRATION.md` handoff).
- No server, frontend source, dependencies, tests, staging, or commits were changed or run for this documentation-only workflow.

## Backend-0 Contract Decisions

- Added the approved v1 decisions for recurrence, date formats, PATCH updates, list aggregation, status notes, limits, local data export, and the backend handoff.
- Added authenticated `/api/auth/me` and `/api/auth/password` routes (39 proposed routes total), clarified the task recurrence mismatch, and marked contract questions decided.
