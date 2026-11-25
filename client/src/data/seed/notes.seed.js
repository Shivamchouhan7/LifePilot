export function generateNotesSeed() {
  return [
    {
      id: 'note_01',
      title: 'Distributed System Design: Rate Limiting Cheat Sheet',
      body: `### Rate Limiting Algorithms Comparison

1. **Token Bucket**
   - *How it works*: Tokens added at fixed rate; each request consumes a token.
   - *Pros*: Handles bursts gracefully; memory efficient ($O(1)$).
   - *Use Case*: API gateways (e.g. Stripe, AWS API Gateway).

2. **Leaky Bucket**
   - *How it works*: FIFO queue processed at constant rate.
   - *Pros*: Smooth output rate; prevents downstream flooding.

3. **Sliding Window Counter**
   - *How it works*: Combines fixed window counters with weighted overlap.
   - *Memory*: Extremely low footprint using Redis Sorted Sets (\`ZREMRANGEBYSCORE\`).`,
      category: 'System Design',
      tags: ['system-design', 'redis', 'architecture'],
      pinned: true,
      type: 'interview_prep',
      url: 'https://bytebytego.com',
    },
    {
      id: 'note_02',
      title: 'STAR Method: Behavioral Stories Outline',
      body: `### Core Stories Framework

- **Story 1: Resolving High-Severity Production Outage**
  - *Situation*: Payment webhook worker deadlocked under 5x Black Friday traffic spike.
  - *Task*: Restore service and prevent data loss within 30 min SLA.
  - *Action*: Diagnosed unindexed status query in Postgres, added concurrent index, throttled dead-letter queue.
  - *Result*: Zero transactions lost; documented runbook for query timeouts.

- **Story 2: Leading UI Design System Migration**
  - *Situation*: 4 separate engineering squads maintaining redundant component styles.
  - *Task*: Lead unified token architecture and migrate 120+ views without breaking changes.
  - *Action*: Partnered with Design team on Figma tokens; established automated visual regression testing.
  - *Result*: Reduced bundle size by 35% and sprint UI velocity increased by 2x.`,
      category: 'Job Hunt',
      tags: ['behavioral', 'star', 'interview'],
      pinned: true,
      type: 'interview_prep',
      url: '',
    },
    {
      id: 'note_03',
      title: 'React 18 Concurrency & Transitions Deep Dive',
      body: `### React 18 Key Mental Models

- **Urgent vs Transition Updates**:
  - Urgent: Direct interactions (typing, clicking, toggling).
  - Transition: View switching, filtering, fetching (\`startTransition\`).

- **useDeferredValue**:
  - Defers updating a non-urgent part of the tree until heavy rendering completes.
  - Pair with \`Suspense\` for stale UI states rather than harsh spinners.

- **Automatic Batching**:
  - React 18 batches state updates inside timeouts, promises, and native event handlers automatically.`,
      category: 'Frontend',
      tags: ['react', 'performance', 'frontend'],
      pinned: true,
      type: 'note',
      url: 'https://react.dev',
    },
    {
      id: 'note_04',
      title: 'PostgreSQL Performance Optimization Tips',
      body: `### Indexing Checklist
- Use \`EXPLAIN (ANALYZE, BUFFERS)\` to inspect heap scans.
- Prefer partial indexes (\`WHERE status != 'completed'\`) for large active queues.
- Avoid sequential scans on multi-tenant foreign keys (\`tenant_id, created_at\`).
- Watch out for index bloat; schedule regular \`VACUUM ANALYZE\`.`,
      category: 'Database',
      tags: ['postgres', 'database', 'sql'],
      pinned: false,
      type: 'note',
      url: '',
    },
    {
      id: 'note_05',
      title: 'Frontend Architecture Checklist for Large Apps',
      body: `### Principles
1. **Colocate by feature**, not by file type.
2. **Never leak implementation details** through component props.
3. Keep server state strictly inside TanStack Query; do not mirror to local state without a reason.
4. Separate pure presentation components from container hooks.`,
      category: 'Engineering',
      tags: ['architecture', 'best-practices'],
      pinned: false,
      type: 'note',
      url: '',
    },
    {
      id: 'note_06',
      title: 'NeetCode 150: Core Graph Patterns',
      body: `### Patterns
- **BFS**: Shortest path in unweighted graph (queue + visited set).
- **DFS**: Cycle detection in directed graph (3-state coloring: 0=unvisited, 1=visiting, 2=visited).
- **Topological Sort**: Course schedule, dependency resolution (Kahn's in-degree algorithm).
- **Union Find**: Connected components, redundant connections with path compression.`,
      category: 'DSA',
      tags: ['dsa', 'algorithms', 'graphs'],
      pinned: false,
      type: 'interview_prep',
      url: 'https://neetcode.io',
    },
    {
      id: 'note_07',
      title: 'Tailwind CSS v3 Design Token Architecture',
      body: `### Key Rule
Always format CSS variables into HSL space without the \`hsl()\` wrapper in stylesheet root, and let Tailwind apply opacity:
\`\`\`css
--primary: 243 75% 59%;
\`\`\`
Tailwind config:
\`\`\`js
colors: { primary: 'hsl(var(--primary) / <alpha-value>)' }
\`\`\``,
      category: 'CSS',
      tags: ['tailwind', 'css', 'design-tokens'],
      pinned: false,
      type: 'resource',
      url: 'https://tailwindcss.com',
    },
    {
      id: 'note_08',
      title: 'Negotiation Playbook for Tech Offers',
      body: `### Rules of Negotiation
1. Never give the first number if possible.
2. Express genuine excitement about the team before bringing up compensation.
3. Anchor your counter-offer using verifiable market data from Levels.fyi.
4. Differentiate between base salary, annual target bonus, and equity vesting schedule.`,
      category: 'Career',
      tags: ['career', 'negotiation', 'offers'],
      pinned: false,
      type: 'note',
      url: 'https://levels.fyi',
    },
    {
      id: 'note_09',
      title: 'Web Accessibility (a11y) Modal Requirements',
      body: `### WCAG Compliance for Dialogs
- \`role="dialog"\` and \`aria-modal="true"\`
- Must contain \`aria-labelledby\` linking to title ID.
- Trap focus within dialog when open.
- Restore focus to previous trigger button upon closing.
- Pressing Escape key must immediately trigger dismissal.`,
      category: 'Frontend',
      tags: ['a11y', 'wcag', 'radix'],
      pinned: false,
      type: 'resource',
      url: 'https://w3.org/WAI/ARIA/apg',
    },
    {
      id: 'note_10',
      title: 'Dockerizing Full Stack Node/React Apps',
      body: `### Multi-stage Dockerfile Best Practices
- Stage 1: Build static assets using alpine node container.
- Stage 2: Serve using lightweight Nginx or Caddy server.
- Drop root privileges by creating non-privileged \`node\` user.
- Cache \`package*.json\` layers prior to copying source code.`,
      category: 'DevOps',
      tags: ['docker', 'devops', 'deployment'],
      pinned: false,
      type: 'note',
      url: '',
    },
    {
      id: 'note_11',
      title: 'Questions to Ask Interviewers at End of Round',
      body: `### High-Signal Questions
- "What does success look like for this role in the first 90 days?"
- "How does the team handle technical debt versus roadmap feature delivery?"
- "What is an architectural decision made in the past year that the team is most proud of?"`,
      category: 'Job Hunt',
      tags: ['interview', 'questions'],
      pinned: false,
      type: 'interview_prep',
      url: '',
    },
    {
      id: 'note_12',
      title: 'Git Conventional Commits Standard',
      body: `### Format: \`<type>(<scope>): <subject>\`
- \`feat\`: A new feature
- \`fix\`: A bug fix
- \`refactor\`: Code change neither fixing a bug nor adding a feature
- \`docs\`: Documentation only changes
- \`test\`: Adding or correcting tests`,
      category: 'Engineering',
      tags: ['git', 'workflow'],
      pinned: false,
      type: 'resource',
      url: 'https://conventionalcommits.org',
    },
    {
      id: 'note_13',
      title: 'HTTP Caching: Cache-Control Headers Decoded',
      body: `### Key Directives
- \`no-cache\`: Must revalidate with origin server using ETag before serving.
- \`no-store\`: Do not cache anywhere under any circumstances.
- \`immutable\`: Content will never change (ideal for hashed static bundles in Vite).
- \`stale-while-revalidate\`: Serve stale response while fetching update in background.`,
      category: 'Networking',
      tags: ['http', 'caching', 'web'],
      pinned: false,
      type: 'resource',
      url: '',
    },
  ];
}
