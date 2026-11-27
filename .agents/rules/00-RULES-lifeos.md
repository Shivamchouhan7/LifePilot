# LifePilot: Workspace Rules (always apply)

Save as a workspace rule (Antigravity: `...` menu > Customizations > Rules). Also safe to mirror as AGENTS.md in the project root.

## 1. Execution rules
- Work on ONE phase at a time, only when I run its workflow (/phase-1 ... /phase-6). After the phase's EXIT CHECKS, STOP and wait for my approval. Never start the next phase.
- Before any code: inspect the existing directory. Do not overwrite existing files unnecessarily.
- Planning mode: the Implementation Plan must list every file to create or modify and every dependency to install. Do not install anything outside the approved stack below without asking.
- Never write "verified", "tested" or "works" without pasted command output or a screenshot artifact.
- Max 250 lines per file. Split components, hooks and utils before exceeding it.
- Do not edit files outside the current phase's scope. If a bug in an earlier phase must be fixed, list the file and the reason in your report.
- No lorem ipsum. No dead buttons: if a control cannot work in this phase, do not render it.
- Keep a `docs/PROGRESS.md` file. After each phase append: what was built, files created/modified, known issues.
- Environment: Windows + PowerShell. Use PowerShell-compatible commands only. For code audits use
  `git grep` or `Select-String`, never `grep`, `cat`, `rm -rf` or other Unix-only commands.

## 2. Stack (pinned versions)
- React 18.3.1, Vite 5.4.21, JavaScript only (no TypeScript, `"tsx": false` in components.json).
- Tailwind CSS 3.4.19 (NOT v4) + shadcn/ui (Tailwind v3 setup).
- react-router-dom 7.18.7, lucide-react 1.80.0, recharts 3.11.1, react-hook-form 7.92.0 + @hookform/resolvers 3.10.0, zod 3.25.76, axios 1.21.1, date-fns 4.4.0.
- @tanstack/react-query 5.108.4 for all data fetching/mutations.
- @hello-pangea/dnd 18.0.1 for Kanban (drag-and-drop is REQUIRED, with keyboard support).
- react-big-calendar 1.20.0 (date-fns localizer) for calendar views.
- react-markdown 10.1.0 + remark-gfm 4.0.1 for notes preview.
- Font: Inter (self-hosted via @fontsource/inter 5.3.0, no CDN).
- Anything else: ask first.

## 3. Design tokens
All colors come from CSS variables in `src/index.css`, mapped in `tailwind.config.js` using shadcn variable names (background, card, border, primary, etc., plus sidebar, success, warning, danger, chart-1..5, event-task, event-interview, event-assessment, event-followup, event-deadline). Convert hex to the HSL-channel format shadcn uses. Components may NOT contain hex, rgb(), or raw Tailwind palette classes (e.g. `bg-slate-800`, `text-indigo-500`). Use token classes only.

| Token | Dark | Light |
|---|---|---|
| background | #101828 | #F8FAFC |
| sidebar | #0B1220 | #FFFFFF |
| card | #1E293B | #FFFFFF |
| primary | #6366F1 | #4F46E5 |
| secondary accent | #8B5CF6 | #8B5CF6 |
| success | #10B981 | #10B981 |
| warning | #F59E0B | #F59E0B |
| danger | #F43F5E | #F43F5E |
| foreground | #F8FAFC | #0F172A |
| muted-foreground | #94A3B8 | #64748B |
| border | #334155 | #E2E8F0 |

Event-type colors: derive 5 subtle tints from the palette above. Charts read colors via `var(--chart-N)` (pass the variable string, never hex). Radius 10px to 14px (`--radius: 0.75rem`).

## 4. UI standards (testable)
- Contrast WCAG AA (4.5:1 body text) in both themes.
- Layout verified at 375px, 768px and 1280px. No horizontal page scroll.
- Transitions 150ms to 200ms only. No gradients except the logo mark. No decorative animation.
- Every list/page has: skeleton loader, empty state with a useful action, error state with retry.
- All icon-only buttons have aria-labels. All modals trap focus and close on Esc.
- Theme saved to localStorage key `LifePilot:theme`; apply class before first paint to avoid flash.
- Toasts (shadcn Sonner or Toast) for every create/update/delete.

## 5. Architecture
```
src/
  assets/  components/{common,layout,dashboard,tasks,applications,calendar,learning,projects,notes,analytics}/
  pages/  hooks/  context/  services/  data/  utils/  constants/  routes/
```
Routes (do not improvise URLs):
`/login` `/register` `/` (Overview) `/tasks` `/applications` `/applications/:id` `/calendar` `/learning` `/projects` `/projects/:id` `/notes` `/analytics` `/settings` `*` (404).
Wrap the app in an ErrorBoundary. Auth is a stub: `AuthContext` + `ProtectedRoute` using a fake token in localStorage, shaped for JWT later.

## 6. Data layer (replaceable with Express REST)
- Components NEVER import from `data/` or call services directly. Flow: component > hook (`useTasks`, `useApplications`...) > TanStack Query > service > storage.
- Every service exposes exactly: `getAll(params)`, `getById(id)`, `create(payload)`, `update(id, payload)`, `remove(id)`. All return Promises with simulated 150-300ms latency.
- Mock implementation persists to localStorage under `LifePilot:v1:<entity>`. `services/http.js` holds an axios instance (`VITE_API_URL`) and `VITE_USE_MOCK=true` flag. Switching to Express must require changing service files only.
- Seed data lives in `data/seed/*.js` as FUNCTIONS that generate dates relative to today with date-fns (so "overdue", "today", "upcoming interview" stay correct). Seed once if storage is empty. Settings gets a "Reset demo data" action. Realistic content: no placeholder names like "Company A"; use believable companies, roles, skills, notes. Use initials avatars for company logos.
- IDs: string UUIDs (`crypto.randomUUID()`), plus `createdAt`/`updatedAt` ISO strings on every entity.

### Entities
- **Task**: id, title, description, priority (high|medium|low), status (todo|in_progress|completed), dueAt (ISO or null), category, tags[], recurring (null|daily|weekly|monthly), completedAt, projectId (nullable), reminderMinutes.
- **Application**: id, company, jobTitle, jobType (internship|full_time|part_time), source, url, appliedDate, status (interested|applied|assessment|interview|hr_round|offered|rejected|withdrawn), recruiterName, recruiterEmail, description, skills[], salary, location, followUpDate, interviewAt, assessmentAt, notes, statusHistory[{status, at, note}]. Status change MUST append to statusHistory.
- **LearningGoal**: id, skill, category, topics[{id, name, done}], lessons[{id, title, done}], resources[{title, url}], nextRevisionDate. Progress is DERIVED from lessons, never stored.
- **Project**: id, name, description, techStack[], repoUrl, liveUrl, status (planning|active|paused|completed), startDate, targetDate, milestones[{id, title, done, dueDate}], notes.
- **Note**: id, title, body (markdown), category, tags[], pinned, type (note|link|interview_prep|resource), url.
- **Settings**: profile, theme, notifications, dateFormat, timeFormat, defaultTaskPriority.

### Calendar events are DERIVED, never stored
A `calendarService.getEvents(range)` builds events from: task.dueAt, application.interviewAt / assessmentAt / followUpDate, project.targetDate and milestone dueDates. Only user-created standalone events (modal) are stored, in `events`. Do not duplicate data across modules.

## 7. EXIT CHECKS (every phase, all required)
1. `npm run build` and `npm run lint` both pass. Paste the full output.
2. Open the dev server in the browser. Screenshot each route touched in this phase at 375px, 768px and 1280px, in dark AND light theme.
3. Report browser console errors/warnings. "None" requires a console screenshot.
4. Append to `docs/PROGRESS.md`. Then STOP.
