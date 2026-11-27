import React from 'react';
import { APPLICATION_STATUSES } from '../../constants/status';
import { getApplicationCounts } from '../../utils/applicationFilters';

export function ApplicationPipeline({ applications, selectedStatus, onSelectStatus }) {
  const counts = getApplicationCounts(applications);

  return (
    <section aria-label="Application pipeline">
      <h2 className="mb-2 text-sm font-semibold">Pipeline</h2>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(APPLICATION_STATUSES).map(([status, config]) => (
          <button
            key={status}
            type="button"
            aria-pressed={selectedStatus === status}
            onClick={() => onSelectStatus(status)}
            className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
              selectedStatus === status
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card hover:border-primary/40'
            }`}
          >
            <span>{config.label}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {counts[status] || 0}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
