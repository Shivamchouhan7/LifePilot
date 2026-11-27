import React from 'react';
import { APPLICATION_STATUSES } from '../../constants/status';

const fieldClass = 'h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground';

export function ApplicationStatusControl({
  application,
  onChange,
  isUpdating = false,
  statusNote = '',
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
      Status
      <select
        className={fieldClass}
        value={application.status}
        onChange={(event) => onChange(event.target.value, statusNote)}
        disabled={isUpdating}
        aria-label={`Status for ${application.company} — ${application.jobTitle}`}
      >
        {Object.entries(APPLICATION_STATUSES).map(([status, config]) => (
          <option key={status} value={status}>{config.label}</option>
        ))}
      </select>
    </label>
  );
}
