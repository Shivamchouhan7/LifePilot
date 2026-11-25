import React from 'react';
import { TASK_STATUSES, APPLICATION_STATUSES, PROJECT_STATUSES } from '../../constants/status';

export function StatusBadge({ status, type = 'application', className = '' }) {
  let config = { label: status, color: 'text-muted-foreground bg-muted border-border' };

  if (type === 'task' && TASK_STATUSES[status]) {
    config = TASK_STATUSES[status];
  } else if (type === 'application' && APPLICATION_STATUSES[status]) {
    config = APPLICATION_STATUSES[status];
  } else if (type === 'project' && PROJECT_STATUSES[status]) {
    config = PROJECT_STATUSES[status];
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${config.color} ${className}`}
    >
      {config.label}
    </span>
  );
}
