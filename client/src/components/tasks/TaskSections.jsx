import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { TASK_SECTIONS } from '../../utils/taskFilters';

export function TaskSections({ counts }) {
  const [params, setParams] = useSearchParams();
  const activeSection = params.get('section') || 'all';

  const selectSection = (section) => {
    const next = new URLSearchParams(params);
    if (section === 'all') next.delete('section');
    else next.set('section', section);
    setParams(next, { replace: true });
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Task sections">
      {TASK_SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={activeSection === id}
          aria-label={id === 'upcoming' ? `${label} ${counts[id] || 0} includes tasks without due dates` : undefined}
          className={`shrink-0 rounded-lg border px-3 py-2 text-sm ${activeSection === id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:text-foreground'}`}
          onClick={() => selectSection(id)}
        >
          {label} <span className="ml-1 text-xs">{counts[id] || 0}</span>
        </button>
      ))}
    </div>
  );
}
