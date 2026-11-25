import { generateTasksSeed } from '../src/data/seed/tasks.seed.js';
import { generateApplicationsSeed } from '../src/data/seed/applications.seed.js';
import { generateLearningSeed } from '../src/data/seed/learning.seed.js';
import { generateProjectsSeed } from '../src/data/seed/projects.seed.js';
import { generateNotesSeed } from '../src/data/seed/notes.seed.js';
import { isToday, isPast, parseISO } from 'date-fns';

console.log('--- LifePilot Seed Data Audit ---');

// 1. Tasks
const tasks = generateTasksSeed();
console.log(`Total Tasks: ${tasks.length}`);

const buckets = {
  overdue: 0,
  today: 0,
  upcoming: 0,
  completed: 0,
};

tasks.forEach((t) => {
  if (t.status === 'completed' || t.completedAt) {
    buckets.completed++;
  } else if (t.dueAt) {
    const d = parseISO(t.dueAt);
    if (isToday(d)) {
      buckets.today++;
    } else if (isPast(d)) {
      buckets.overdue++;
    } else {
      buckets.upcoming++;
    }
  }
});

console.log('Task Buckets:', JSON.stringify(buckets, null, 2));
const allBucketsNonEmpty = Object.values(buckets).every((count) => count > 0);
console.log(`All Task Buckets Non-Empty: ${allBucketsNonEmpty ? 'PASS' : 'FAIL'}`);

// 2. Applications
const apps = generateApplicationsSeed();
console.log(`\nTotal Applications: ${apps.length}`);

const REQUIRED_STATUSES = [
  'interested',
  'applied',
  'assessment',
  'interview',
  'hr_round',
  'offered',
  'rejected',
  'withdrawn',
];

const statusCounts = {};
let allHaveHistory = true;

apps.forEach((a) => {
  statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  if (!a.statusHistory || a.statusHistory.length === 0) {
    allHaveHistory = false;
  }
});

console.log('Application Status Counts:', JSON.stringify(statusCounts, null, 2));

const all8Present = REQUIRED_STATUSES.every((st) => (statusCounts[st] || 0) > 0);
console.log(`All 8 Application Statuses Present: ${all8Present ? 'PASS' : 'FAIL'}`);
console.log(`All Applications Have Non-Empty statusHistory: ${allHaveHistory ? 'PASS' : 'FAIL'}`);

// 3. Learning, Projects, Notes
const learning = generateLearningSeed();
const projects = generateProjectsSeed();
const notes = generateNotesSeed();

console.log(`\nTotal Learning Goals: ${learning.length}`);
console.log(`Total Projects: ${projects.length}`);
console.log(`Total Notes: ${notes.length}`);

if (allBucketsNonEmpty && all8Present && allHaveHistory) {
  console.log('\n>>> SEED AUDIT RESULT: ALL EXIT CRITERIA PASSED <<<');
} else {
  console.error('\n>>> SEED AUDIT RESULT: FAILED <<<');
  process.exit(1);
}
