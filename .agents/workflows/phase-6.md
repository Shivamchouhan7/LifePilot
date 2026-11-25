# /phase-6: Analytics, Settings, Polish, Final Audit

Follow the workspace rules. Do ONLY this phase. Planning mode: Implementation Plan first.

## Analytics (/analytics)
Reuse chart components from `components/analytics/`; do not duplicate Overview charts. Add: weekly and monthly task completion, completion rate, overdue statistics, application trend over time, application conversion funnel (applied > assessment > interview > offer), interview stats, learning progress, project completion. Date range selector (7d / 30d / 90d). Every number derived from existing hooks.

## Settings (/settings)
Profile (name, email, avatar initials), theme preference (light/dark/system), notification preferences, date format, time format, default task priority (must actually affect the new-task form), account section (change password form with validation, stub), "Reset demo data" and "Export data as JSON". Settings changes apply immediately app-wide (date formats must be respected by every date display, so create a single `formatDate` util).

## Polish and audit
- Audit every route and every button for dead controls; fix or remove.
- Audit for hardcoded colors: run a grep for hex codes, `rgb(`, and raw palette classes in `src/components` and `src/pages`; fix all hits and paste the grep output (expected: empty).
- Audit file lengths (>250 lines) and split.
- Keyboard pass: tab order, focus rings, Esc closes modals.
- Write `docs/BACKEND_INTEGRATION.md`: for each service, the REST endpoint it maps to (method + path + payload), the auth header plan, and the exact steps to switch `VITE_USE_MOCK` off.

## Finish
Run EXIT CHECKS across ALL routes at 375/768/1280 in both themes. Include the grep output and a final known-issues list. STOP.
