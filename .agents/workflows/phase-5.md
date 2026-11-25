# /phase-5: Calendar, Learning, Projects, Notes

Follow the workspace rules. Do ONLY this phase. Planning mode: Implementation Plan first. This is the largest phase: in the plan, order the work as Calendar > Learning > Projects > Notes, and build each fully before the next.

## Calendar (/calendar, components/calendar/)
- react-big-calendar with date-fns localizer; Month, Week, Day views. Override its default stylesheet with token-based CSS in one `calendar.css` (no hardcoded colors; it must look right in both themes).
- Events from `calendarService.getEvents(range)`: tasks, interviews, assessments, follow-ups, project deadlines/milestones, plus stored custom events. Subtle distinct tint per type with a legend and type filter.
- Event creation modal (custom events) with reminder setting. Clicking a derived event opens its source item (task modal, application detail, project), not a duplicate record.
- Add the Calendar view to the Tasks page, reusing this component.

## Learning (/learning, components/learning/)
Goal cards with derived progress bars; detail view with topics checklist, completed/pending lessons, resource links, next revision date; add/edit/delete; a category progress chart. Seeds already include the six skills.

## Projects (/projects and /projects/:id, components/projects/)
Grid and List views; add/edit/delete; tech-stack chips; repo and live links (open in new tab with rel="noopener noreferrer"); status; dates; milestones checklist with derived completion %; notes.

## Notes (/notes, components/notes/)
Markdown editor (textarea + live preview with react-markdown/remark-gfm), categories, tags, pin, search, saved URLs (type=link), interview-prep and project-resource categories. Sanitize rendered output (no raw HTML).

All four: skeletons, empty states, error states, toasts, global search integration, quick-add entries.

## Finish
Run EXIT CHECKS for all four routes plus the Tasks calendar view. List manual tests executed per module. STOP and wait for approval.
