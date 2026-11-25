import React from 'react';
import { TASK_PRIORITIES } from '../../constants/status';
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

export function PriorityBadge({ priority = 'medium', className = '' }) {
  const config = TASK_PRIORITIES[priority] || TASK_PRIORITIES.medium;

  const Icon =
    priority === 'high' ? ArrowUp : priority === 'low' ? ArrowDown : ArrowRight;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${config.color} ${className}`}
    >
      <Icon className="h-3 w-3 stroke-[2.5]" />
      {config.label}
    </span>
  );
}
