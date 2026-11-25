# /phase-4: Overview Dashboard

Follow the workspace rules. Do ONLY this phase. Planning mode: Implementation Plan first. All data comes from existing hooks; do NOT create new mock data or duplicate logic. Put chart components in `components/analytics/` so Phase 6 can reuse them.

## Build (page: / , components in components/dashboard/)
- Welcome: greeting by time of day with the user's name from settings, today's date, a short productivity message derived from real data (e.g. tasks due today count).
- Six stat cards: total tasks, completed, pending, active applications, upcoming interviews (next 14 days), overdue tasks. Each links to the matching filtered page.
- Today's priorities: title, priority indicator, due time, completion checkbox, quick-edit (opens the Phase 2 modal).
- Upcoming schedule: next 7 days of tasks, interviews, follow-ups, deadlines, merged and sorted, built via `calendarService.getEvents`. Implement the derived-events service now if it does not exist; Phase 5 extends it.
- Application overview: total + counts for Applied, Assessment, Interview, Offered, Rejected.
- Charts (Recharts, colors via `var(--chart-N)`): weekly task completion, application status distribution, learning progress overview (progress derived from lessons).
- Quick-add Task and Quick-add Application buttons using the existing modals.
- Skeletons per widget, empty states per widget, per-widget error state.

## Out of scope
Anything not listed. No new dependencies.

## Finish
Run EXIT CHECKS. Verify numbers by cross-checking at least three stat cards against the underlying lists and report the comparison. STOP and wait for approval.
