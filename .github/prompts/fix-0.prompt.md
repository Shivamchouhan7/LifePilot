---
description: "Fix-0: housekeeping before repairing Tasks and Applications (deps, dnd swap, dead files, rules, progress log)"
agent: agent
---
# /fix-0: Frontend Housekeeping (no new features)

Frontend rules still apply: [frontend rules](../../.agents/rules/00-RULES-lifeos.md). The frontend lives in `client/` (source in `client/src`). Environment is Windows + PowerShell: use `git grep` (never `grep`), and `;` or separate commands (never `&&` unless the shell supports it).

**Step 0 (mandatory):** before changing anything, output an Implementation Plan listing every file you will modify or delete and every package you will add or remove, with exact versions. Then STOP and wait until I reply "approved".

## Scope: do ONLY these 6 items

1. **Add missing dependencies** in `client/`: `react-hook-form` (v7), `zod` (v3), `@hookform/resolvers` (v3), `@hello-pangea/dnd` (latest release that supports React 18; state the version in the plan). They are installed but not yet used; do not build forms in this workflow.
2. **Replace `react-beautiful-dnd`:** it is imported only in `client/src/components/tasks/KanbanBoard.jsx`. Switch that import to `@hello-pangea/dnd` (API-compatible), then uninstall `react-beautiful-dnd`. Change nothing else in that file.
3. **Delete dead duplicate hooks:** `client/src/hooks/useTasks.jsx` and `client/src/hooks/useApplications.jsx` (the real hooks are the `.js` files). First run `git grep -n "useTasks.jsx\|useApplications.jsx" client/src` to confirm nothing imports them by explicit extension, and show me the output.
4. **Fix the due-date field bug:** `client/src/components/tasks/TaskCard.jsx` reads `task.due`; the entity field is `dueAt`. Fix that one field reference only.
5. **Update the frontend rules file** `.agents/rules/00-RULES-lifeos.md` section "Stack (pinned majors)" so it matches what is actually installed. Read the real versions from `client/package.json` for react-router-dom, recharts, date-fns, lucide-react, tailwindcss, vite, and the packages added in item 1. Change only that section. Do not downgrade any installed package.
6. **Correct `docs/PROGRESS.md`:** append a new section "Corrections (Fix-0)" at the end. Do not edit or delete earlier text. State plainly, based on the actual code: Tasks has only a List/Kanban toggle (no add/edit/delete UI, search, filters, sorting, recurrence generation); Applications pages are placeholders (`ApplicationsPage` and `ApplicationDetailPage` render `PlaceholderPage`, `ApplicationsDashboard` is unused); no tests exist under `src/tests` and no screenshots are committed; `docs/BACKEND_INTEGRATION.md` does not exist; `NotesPage.jsx`, `CalendarPage.jsx` and `SettingsPage.jsx` exceed 250 lines.

## Out of scope (do not touch)
Tasks features, Applications features, any new component, any other page, any backend file, `package.json` name, styling.

## EXIT CHECKS (all required, paste output)
1. In `client/`: `npm run build` and `npm run lint` both pass.
2. `npm ls react-beautiful-dnd` shows it is not installed; `npm ls @hello-pangea/dnd react-hook-form zod @hookform/resolvers` shows all four installed.
3. `git grep -n "react-beautiful-dnd" client/src client/package.json` returns nothing.
4. `git status` shows only the files named in the approved plan.
5. If you can open the app, drag one task between Kanban columns and report the result. If you cannot, say so explicitly; do not claim it works.
6. Then STOP and wait for my approval.
