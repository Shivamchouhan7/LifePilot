# /phase-2: Task Management

Follow the workspace rules. Do ONLY this phase. Planning mode: Implementation Plan first. Reuse Phase 1 components and services; do not recreate them.

## Build (page: /tasks, components in components/tasks/)
- Add/edit/delete via modal using React Hook Form + Zod: title (required), description, priority, status, due date+time, category, tags, recurring, reminder.
- Views: List and Kanban (Todo / In Progress / Completed) using @hello-pangea/dnd. Drag between columns updates status; it must also work with the keyboard. (Calendar view is added in Phase 5.)
- Sections/tabs: Overdue, Today, Upcoming, Completed, each with counts.
- Search (title, description, tags), filters (priority, status, category, tag), sort (due date, priority). Filters persist in URL query params.
- Task completion checkbox (sets completedAt; recurring tasks spawn the next instance on completion).
- Optimistic updates for checkbox and drag; roll back and show an error toast on failure.
- Skeletons, empty states (different copy for "no tasks" vs "no results for filters"), error state with retry.
- Enable the topbar quick-add "Task" entry and include tasks in global search.

## Out of scope
Calendar view, Overview widgets, anything for applications.

## Finish
Run EXIT CHECKS. Also list manual test steps you executed (create, edit, delete, drag, complete, recurring, filters) with the result of each. STOP and wait for approval.
