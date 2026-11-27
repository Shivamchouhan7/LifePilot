---
description: "Repair Applications: pipeline, kanban, table, filters, add/edit form, detail page with status timeline"
agent: agent
---
# /repair-applications: Build the Job & Internship Application Tracker

Frontend rules apply: [frontend rules](../../.agents/rules/00-RULES-lifeos.md). The frontend lives in `client/` (source in `client/src`); run every npm command inside `client/`. Environment is Windows + PowerShell: use `git grep`, never `grep`. Max 250 lines per file. No hardcoded colors (token classes only). Do not add any dependency; `react-hook-form`, `zod`, `@hookform/resolvers` and `@hello-pangea/dnd` are installed.

**Step 0 (mandatory):** before changing anything, read the existing code and output an Implementation Plan. Then STOP and wait until I reply "approved".

## Read first (and list in the plan)
`client/src/services/applicationService.js`, `client/src/hooks/useApplications.js`, `client/src/data/seed/applications*.js`, `client/src/constants/*` (use the repo's real field names and status values, not any names in this prompt), `client/src/components/applications/*`, `ApplicationsPage` and `ApplicationDetailPage` in `client/src/pages`, `client/src/routes`, the finished Tasks module (copy its patterns for the form modal, URL-param filters, optimistic updates, loading/empty/error states, and `?new=1` handling), and `client/src/components/common/*`. State which other pages consume applications (Overview, Calendar, Analytics, Global Search): they must keep working.

## Current state (verified from the repo)
`ApplicationsPage` and `ApplicationDetailPage` render a placeholder. `ApplicationsDashboard.jsx` is 27 lines and nothing imports it. The service exists with a 5-method interface and appends to `statusHistory` on status change. There is no UI.

## Build
Applications have 8 statuses: interested, applied, assessment, interview, hr_round, offered, rejected, withdrawn (confirm against the repo constants).

1. **Stats cards** derived from data: total, active (not offered/rejected/withdrawn), interviews, offers, rejected, response rate (applications past "applied" divided by applications that reached "applied"; state the formula on screen via tooltip).
2. **Pipeline bar** with the count per status. Clicking a stage applies that status filter.
3. **Two views** (state kept in URL): **Kanban** with all 8 columns using `@hello-pangea/dnd` (keyboard accessible; inside its own horizontal scroll container so the page never scrolls sideways at 375px), and **Table** with sortable columns (company, title, status, applied date, interview date, follow-up date). Row or card click opens the detail page.
4. **Filters and search**, all persisted in URL query params via `useSearchParams`: company, status, job type, source; search across company, job title, skills, recruiter name. Distinct empty states for "no applications" and "no results" (with a clear-filters action).
5. **Add/Edit modal** with React Hook Form + Zod. Schema in `client/src/validation/applicationSchema.js` (new). Fields: company (required), job title (required), job type, source, URL (valid URL if present), applied date, status, recruiter name, recruiter email (valid email if present), job description, required skills (tag input, max 20), salary/stipend, location, follow-up date, interview date and time, assessment date and time, notes. Rules: interview and assessment date must not be before the applied date; `interviewAt` is required when status is `interview` or `hr_round`. Show field-level errors. Convert date-times with `new Date(value).toISOString()` on save and date-fns `format(date, "yyyy-MM-dd'T'HH:mm")` when pre-filling.
6. **Status changes** from three places (Kanban drag, a status dropdown on the table row and detail page) all go through the same `applicationService.update` path. The service appends `{ status, at, note }` to `statusHistory` ONLY when the status actually changes, and the read-modify-write must be atomic after the simulated latency (same rule as Tasks). Optimistic update with rollback and error toast. Disable the control while its mutation is pending. From the detail page, the status change offers an optional note.
7. **Detail page** `/applications/:id`: all fields, skill chips, recruiter `mailto:` link, external job URL link (`target="_blank" rel="noopener noreferrer"`), editable notes, edit and delete actions, and the **history timeline** built from `statusHistory` (newest first, with date/time and note). Opening an unknown id shows a "not found" state with a link back. A deep link and a hard reload on `/applications/:id` must work.
8. **Company avatar:** use the existing `CompanyAvatar` (deterministic initials and token-based tint).
9. **Loading, error, empty:** skeletons, error state with retry, empty state with "Add your first application".
10. **Entry points:** make the top-bar quick-add "Application" entry open the same modal via `/applications?new=1`; the param must be removed on close and after save so a refresh does not reopen it. Make sure Global Search finds applications and links to their detail page; report if it needs a change.
11. **Delete** with the existing ConfirmDialog and a toast.
12. Remove or reuse the orphaned `ApplicationsDashboard.jsx`; say which in the plan.

## Out of scope
Calendar changes, Overview/Analytics changes, backend, new dependencies, Tasks changes.

## EXIT CHECKS (all required, paste output)
1. In `client/`: `npm run build` and `npm run lint` pass.
2. `git status` lists only files named in the approved plan.
3. List any file over 250 lines. PowerShell: `Get-ChildItem client/src -Recurse -Include *.js,*.jsx | ForEach-Object { $n=(Get-Content $_.FullName | Measure-Object -Line).Lines; if ($n -gt 250) { "$n $($_.FullName)" } }`. Existing oversized files (NotesPage, CalendarPage, SettingsPage) may be listed; no NEW oversized file is allowed.
4. Manual tests, each reported PASS or FAIL with evidence: create (valid; invalid URL; invalid email; interview before applied date; status `interview` without `interviewAt`), edit, delete, status change via dropdown and via Kanban drag across several columns, timeline shows every change in order, saving without changing status adds NO timeline entry, double-clicking a status control adds exactly one entry, reload persists everything, every filter, search, each sortable column, pipeline click filters, URL params restore after reload, `?new=1` cleared on close and refresh, deep link and hard reload on `/applications/:id`, unknown id shows not-found.
5. Consistency and regression: the stats cards match the table counts; the Overview application counts match; an application's interview date and follow-up date appear on the Calendar after saving; Global Search finds an application; no console errors on Overview, Applications, Calendar, Analytics.
6. Show the stored ISO string for a 9:00 AM interview and confirm it displays as 9:00 AM locally.
7. Screenshots of the table view, Kanban view, add/edit modal and detail page at 375px, 768px and 1280px in dark and light themes. If you cannot capture screenshots, say so; do not claim they exist.
8. Append to `docs/PROGRESS.md`: what was built, files created/modified, and known issues, stated accurately. Then STOP and wait for my approval.
