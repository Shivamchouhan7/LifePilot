import { isToday } from 'date-fns';

export const TASK_SECTIONS = [
  { id: 'all', label: 'All' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

const priorityOrder = { high: 0, medium: 1, low: 2 };

export function getTaskSection(task, now = new Date()) {
  if (task.status === 'completed') return 'completed';
  if (!task.dueAt) return 'upcoming';

  const dueAt = new Date(task.dueAt);
  if (Number.isNaN(dueAt.getTime())) return 'upcoming';
  if (dueAt < now) return 'overdue';
  if (isToday(dueAt)) return 'today';
  return 'upcoming';
}

export function getTaskListState(tasks, params, now = new Date()) {
  const query = (params.get('q') || '').trim().toLowerCase();
  const section = params.get('section') || 'all';
  const sort = params.get('sort') === 'priority' ? 'priority' : 'dueAt';
  const direction = params.get('direction') === 'desc' ? -1 : 1;
  const filtered = tasks.filter((task) => {
    const matchesSearch = !query || [
      task.title,
      task.description,
      ...(task.tags || []),
    ].some((value) => String(value || '').toLowerCase().includes(query));
    const matchesPriority = !params.get('priority') || task.priority === params.get('priority');
    const matchesStatus = !params.get('status') || task.status === params.get('status');
    const matchesCategory = !params.get('category') || task.category === params.get('category');
    const matchesTag = !params.get('tag') || (task.tags || []).includes(params.get('tag'));
    return matchesSearch && matchesPriority && matchesStatus && matchesCategory && matchesTag;
  });

  const counts = Object.fromEntries(TASK_SECTIONS.map(({ id }) => [
    id,
    id === 'all' ? filtered.length : filtered.filter((task) => getTaskSection(task, now) === id).length,
  ]));
  const selected = section === 'all' ? filtered : filtered.filter((task) => getTaskSection(task, now) === section);

  selected.sort((left, right) => {
    let comparison;
    if (sort === 'priority') {
      comparison = (priorityOrder[left.priority] ?? 3) - (priorityOrder[right.priority] ?? 3);
    } else {
      const leftDate = left.dueAt ? new Date(left.dueAt).getTime() : Number.POSITIVE_INFINITY;
      const rightDate = right.dueAt ? new Date(right.dueAt).getTime() : Number.POSITIVE_INFINITY;
      if (!Number.isFinite(leftDate) || !Number.isFinite(rightDate)) {
        comparison = leftDate === rightDate ? 0 : leftDate < rightDate ? -1 : 1;
      } else {
        comparison = leftDate - rightDate;
      }
    }
    return comparison * direction || left.title.localeCompare(right.title);
  });

  return { tasks: selected, counts };
}
