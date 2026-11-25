# /phase-3: Job & Internship Application Tracker

Follow the workspace rules. Do ONLY this phase. Planning mode: Implementation Plan first.

## Build (pages: /applications, /applications/:id; components in components/applications/)
- Stat cards (total, active, interviews, offers, rejected, response rate) derived from data.
- Status pipeline bar showing counts per status; clicking a stage filters the list.
- Views: Kanban (all 8 statuses, @hello-pangea/dnd, keyboard accessible) and Table (sortable columns). Drag/drop or a status dropdown changes status AND appends to statusHistory.
- Filters: company, status, job type, source. Search across company, title, skills, recruiter. Filters persist in URL query params.
- Add/Edit modal (RHF + Zod): every field listed in the Application entity. Validate URL and email formats; interviewAt must not precede appliedDate.
- Detail page `/applications/:id` (or drawer on mobile): all fields, skill chips, recruiter mailto link, notes editor, and the history timeline built from statusHistory. Quick status change control with a toast.
- Company avatar uses initials with a deterministic token-based tint, not hardcoded colors.
- Skeletons, empty states, error states.
- Enable topbar quick-add "Application" and include applications in global search.

## Out of scope
Calendar rendering of interviews/follow-ups (Phase 5), Overview widgets.

## Finish
Run EXIT CHECKS. List manual tests executed (create, edit, delete, drag status change, timeline updates, filters, validation errors). STOP and wait for approval.
