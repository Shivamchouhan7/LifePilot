import { addDays, subDays } from 'date-fns';

const pDate = (days) => (days >= 0 ? addDays(new Date(), days) : subDays(new Date(), Math.abs(days))).toISOString();

export function generateProjectsSeed() {
  return [
    {
      id: 'proj_01',
      name: 'LifePilot Hub',
      description: 'Personal productivity & career management platform to organize tasks, job applications, projects, and learning goals.',
      techStack: ['React 18', 'Vite 5', 'Tailwind CSS', 'TanStack Query', 'shadcn/ui'],
      repoUrl: 'https://github.com/username/lifepilot',
      liveUrl: 'https://lifepilot.app',
      status: 'active',
      startDate: pDate(-10),
      targetDate: pDate(14),
      milestones: [
        { id: 'm_01_1', title: 'Phase 1: Foundation & Shell Architecture', done: true, dueDate: pDate(-1) },
        { id: 'm_01_2', title: 'Phase 2: Task Management & Kanban Board', done: false, dueDate: pDate(3) },
        { id: 'm_01_3', title: 'Phase 3: Job Application Tracking Pipeline', done: false, dueDate: pDate(7) },
        { id: 'm_01_4', title: 'Phase 4: Learning Goals & Project Milestones', done: false, dueDate: pDate(10) },
        { id: 'm_01_5', title: 'Phase 5: Calendar Views & Notes System', done: false, dueDate: pDate(12) },
        { id: 'm_01_6', title: 'Phase 6: Analytics Dashboard & Polish', done: false, dueDate: pDate(14) },
      ],
      notes: 'Ensure all accessibility standards (WCAG AA) and token mappings are adhered to.',
    },
    {
      id: 'proj_02',
      name: 'Cloud File Storage API',
      description: 'High-performance distributed file storage microservice featuring chunked uploads and presigned S3 URLs.',
      techStack: ['Node.js', 'Express', 'TypeScript', 'AWS S3', 'Redis'],
      repoUrl: 'https://github.com/username/cloud-storage-service',
      liveUrl: 'https://api.cloudstore.dev',
      status: 'completed',
      startDate: pDate(-60),
      targetDate: pDate(-5),
      milestones: [
        { id: 'm_02_1', title: 'Multipart upload protocol with resume support', done: true, dueDate: pDate(-40) },
        { id: 'm_02_2', title: 'Redis token-bucket rate limiter middleware', done: true, dueDate: pDate(-25) },
        { id: 'm_02_3', title: 'Docker multi-stage build and Helm charts', done: true, dueDate: pDate(-10) },
      ],
      notes: 'Shipped to production on AWS ECS Fargate.',
    },
    {
      id: 'proj_03',
      name: 'Accessible Design System (Aura UI)',
      description: 'An open-source React component library built on top of Radix UI primitives and Tailwind CSS with zero CSS bloat.',
      techStack: ['React', 'Radix UI', 'Tailwind CSS', 'Storybook', 'npm'],
      repoUrl: 'https://github.com/username/aura-ui',
      liveUrl: 'https://aura-ui.design',
      status: 'active',
      startDate: pDate(-30),
      targetDate: pDate(20),
      milestones: [
        { id: 'm_03_1', title: 'Core primitives: Dialog, Dropdown, Popover, Tooltip', done: true, dueDate: pDate(-15) },
        { id: 'm_03_2', title: 'Theme tokens: HSL channel variables & dark mode', done: true, dueDate: pDate(-2) },
        { id: 'm_03_3', title: 'Interactive Storybook documentation & a11y tests', done: false, dueDate: pDate(10) },
      ],
      notes: 'Published initial beta on npm registry.',
    },
    {
      id: 'proj_04',
      name: 'AI Code Review Assistant',
      description: 'CLI tool and GitHub Action that analyzes pull requests for potential memory leaks, race conditions, and styling inconsistencies.',
      techStack: ['TypeScript', 'Node.js', 'Gemini API', 'GitHub Octokit'],
      repoUrl: 'https://github.com/username/ai-pr-reviewer',
      liveUrl: '',
      status: 'planning',
      startDate: pDate(5),
      targetDate: pDate(35),
      milestones: [
        { id: 'm_04_1', title: 'CLI git diff parser and AST extractor', done: false, dueDate: pDate(15) },
        { id: 'm_04_2', title: 'Gemini 1.5 Pro structured prompt pipeline', done: false, dueDate: pDate(25) },
        { id: 'm_04_3', title: 'GitHub Action packaging and marketplace release', done: false, dueDate: pDate(35) },
      ],
      notes: 'Exploring function calling and JSON mode for deterministic review output.',
    },
  ];
}
