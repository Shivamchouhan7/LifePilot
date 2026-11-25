# /phase-1: Foundation (tokens, layout, data layer, seed data)

Follow the workspace rules. Do ONLY this phase. Use Planning mode: produce the Implementation Plan first.

## Build
1. Scaffold Vite + React (JS) in the current directory without overwriting existing files. Install the approved stack with the pinned majors. Configure Tailwind 3.4, shadcn/ui (JS), Inter via @fontsource.
2. Design tokens for dark + light in `index.css` and `tailwind.config.js`, exactly as specified in the rules. ThemeContext with localStorage persistence and no flash on load.
3. Layout: fixed sidebar (desktop) with Workspace group (Overview, My Tasks, Job Applications, Calendar, Learning & Skills, Projects, Notes & Resources) and Personal group (Analytics, Settings), LifePilot logo, collapsible state (persisted), active indicator, user profile block at the bottom, mobile drawer. Top bar: page title + breadcrumbs, global search (opens a command-palette style dialog that searches only entities available so far), quick-add button (menu with entries enabled only when their feature exists), notifications popover (empty state), theme toggle, avatar menu.
4. Router with the full routes table. Pages not yet built render a real "Coming in a later phase" empty state, with no fake controls.
5. Login/Register screens (stub auth), ProtectedRoute, 404 page, ErrorBoundary.
6. Data layer: `services/http.js`, all entity services with the 5-method interface, TanStack Query provider, base hooks, and seed generators for ALL entities (relative dates). Include 25+ tasks, 15+ applications across all 8 statuses with statusHistory, 6 learning goals (JavaScript, React, Node.js, MongoDB, DSA, System Design), 4 projects, 12+ notes.
7. Common components: Modal/Dialog wrapper, ConfirmDialog, EmptyState, ErrorState, Skeleton variants, PageHeader, StatusBadge, PriorityBadge, CompanyAvatar.

## Out of scope
Any real page content (Overview, Tasks, Applications, Calendar, etc.).

## Finish
Run EXIT CHECKS from the rules. Screenshot the layout shell in both themes, sidebar collapsed and expanded, and the mobile drawer. STOP and wait for approval.
