---
description: "Repair Tasks: CRUD with RHF+Zod, filters, sorting, sections, completion, recurrence, dueAt fix"
agent: agent
---
# /repair-tasks: Complete the Task Management module

Frontend rules apply: [frontend rules](../../.agents/rules/00-RULES-lifeos.md). The frontend lives in `client/` (source in `client/src`); run every npm command inside `client/`. Environment is Windows + PowerShell: use `git grep`, never `grep`. Max 250 lines per file. No hardcoded colors (token classes only). Do not add any dependency; `react-hook-form`, `zod`, `@hookform/resolvers` and `@hello-pangea/dnd` are already installed.

**Step 0 (mandatory):** before changing anything, read the existing Tasks code and output an Implementation Plan. Then STOP and wait until I reply "approved".

## Read first (and list in the plan)
`client/src/components/tasks/*`, `client/src/pages` (the Tasks page), `client/src/services/taskService.js`, `client/src/hooks/useTasks.js`, `client/src/constants/*`, `client/src/data/seed/tasks*.js`, and the existing `client/src/components/common/*` (Modal, ConfirmDialog, EmptyState, ErrorState, Skeletons, PriorityBadge, StatusBadge). Reuse what exists. Create a common component only if it is truly missing, and say which in the plan. State which other pages import the task hooks or service (Overview, Calendar, Analytics): they must keep working.

## Current state (verified from the repo)
`TasksDashboard.jsx` is a 36-line List/Kanban toggle. There is no add/edit/delete UI, search, filters, sorting, Today/Overdue sections, completion checkbox or recurrence generation. `taskService` only copies the `recurring` field. The entity due field is `dueAt`.

## Build (Tasks page only)
1. **Task form modal** (create and edit) using React Hook Form + Zod. Schema in `client/src/validation/taskSchema.js` (new, reusable later as the API contract): title (required, max 120), description (max 2000), priority (high|medium|low), status (todo|in_progress|completed), dueAt (date and time, optional), category, tags (array, max 10), recurring (none|daily|weekly|monthly), reminderMinutes (optional). Show field-level errors. Pre-fill when editing.
2. **Delete** with the existing ConfirmDialog. Toast on every create, update and delete.
3. **Completion checkbox** on list rows and cards: toggling sets status to `completed` and stamps `completedAt`; un-completing clears `completedAt`. Optimistic update; roll back with an error toast on failure.
4. **Recurrence:** put a pure function `getNextDueDate(dueAt, recurring)` in `client/src/utils` (use date-fns `addDays`, `addWeeks`, `addMonths`; month-end safe). When a recurring task transitions from a non-completed status to `completed`, create exactly one next instance (same fields, status `todo`, `completedAt` null, due date from the function). Completing an already-completed task, or editing it, must NOT spawn another. Keep this logic in `taskService` only, in one place, so it can later move to the server. Show a recurring indicator icon on cards and rows.
5. **Sections** with counts: Overdue (not completed, `dueAt` before now), Today, Upcoming, Completed. Make them tabs or collapsible groups; pick one and say which.
6. **Search** (title, description, tags) and **filters** (priority, status, category, tag) plus **sort** (due date, priority, with direction). Persist all of them in URL query params with `useSearchParams`, so a reload restores them. Different empty-state copy for "no tasks" vs "no results for these filters" (with a "clear filters" action).
7. **Views:** keep the List and Kanban views. Both use the same filtered data. Drag between Kanban columns updates status through the same update path as the form (so `completedAt` and recurrence behave identically). Add keyboard-accessible drag (the library's default) and confirm it.
8. **Fix `TaskCard`** so due date, overdue styling and priority badge render correctly from `dueAt`.
9. **Loading, error, empty:** skeleton while loading, error state with retry, empty states with a useful action ("Add your first task").
10. **Wire existing entry points:** if the top-bar quick-add menu has a Task entry, make it open the same form modal; if global search exists, make sure tasks are searchable. Do not build either from scratch if missing; report it.

## Out of scope
Calendar view of tasks, Applications, Overview/Analytics changes, backend, new dependencies, styling changes outside the Tasks module.

## EXIT CHECKS (all required, paste output)
1. In `client/`: `npm run build` and `npm run lint` pass.
2. `git status` lists only files named in the approved plan.
3. Run the app and execute these manual tests, reporting PASS or FAIL for each, with evidence: create (valid and invalid input), edit, delete, complete and un-complete, drag between all three columns, reload and confirm the status persisted, each filter, search, both sorts, URL params restore after reload, recurring: complete one daily task and confirm exactly ONE new instance exists, then complete it again or edit it and confirm no second instance.
4. Regression: open Overview, Calendar and Analytics and confirm task data still displays and no console errors appear.
5. Screenshots of `/tasks` (list view, kanban view, open form modal, empty-filter state) at 375px, 768px and 1280px in dark and light themes. If you cannot capture screenshots, say so; do not claim they exist.
6. Report browser console errors. "None" requires you actually looked.
7. Append to `docs/PROGRESS.md`: what was built, files created/modified, known issues. Then STOP and wait for my approval.
