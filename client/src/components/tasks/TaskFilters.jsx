import React from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { TASK_PRIORITIES, TASK_STATUSES } from '../../constants/status';

const fieldClass = 'h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground';

export function TaskFilters({ tasks }) {
  const [params, setParams] = useSearchParams();
  const categories = [...new Set(tasks.map((task) => task.category).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right));
  const tags = [...new Set(tasks.flatMap((task) => task.tags || []))]
    .sort((left, right) => left.localeCompare(right));

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <div className="space-y-3">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          className={`${fieldClass} w-full pl-9`}
          type="search"
          value={params.get('q') || ''}
          onChange={(event) => update('q', event.target.value)}
          placeholder="Search title, description, or tags"
          aria-label="Search tasks"
        />
      </label>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <label className="sr-only" htmlFor="task-priority">Filter by priority</label>
        <select id="task-priority" className={fieldClass} value={params.get('priority') || ''} onChange={(event) => update('priority', event.target.value)}>
          <option value="">All priorities</option>
          {Object.entries(TASK_PRIORITIES).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
        </select>
        <label className="sr-only" htmlFor="task-status">Filter by status</label>
        <select id="task-status" className={fieldClass} value={params.get('status') || ''} onChange={(event) => update('status', event.target.value)}>
          <option value="">All statuses</option>
          {Object.entries(TASK_STATUSES).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
        </select>
        <label className="sr-only" htmlFor="task-category">Filter by category</label>
        <select id="task-category" className={fieldClass} value={params.get('category') || ''} onChange={(event) => update('category', event.target.value)}>
          <option value="">All categories</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <label className="sr-only" htmlFor="task-tag">Filter by tag</label>
        <select id="task-tag" className={fieldClass} value={params.get('tag') || ''} onChange={(event) => update('tag', event.target.value)}>
          <option value="">All tags</option>
          {tags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
        </select>
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="task-sort">Sort tasks by</label>
          <select id="task-sort" className={`${fieldClass} min-w-0 flex-1`} value={params.get('sort') || 'dueAt'} onChange={(event) => update('sort', event.target.value)}>
            <option value="dueAt">Due date</option>
            <option value="priority">Priority</option>
          </select>
          <label className="sr-only" htmlFor="task-direction">Sort direction</label>
          <select id="task-direction" className={`${fieldClass} w-28`} value={params.get('direction') || 'asc'} onChange={(event) => update('direction', event.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
}
