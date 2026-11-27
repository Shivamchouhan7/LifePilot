import React from 'react';
import { format, isValid } from 'date-fns';
import { GripVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CompanyAvatar } from '../common/CompanyAvatar';
import { StatusBadge } from '../common/StatusBadge';

function appliedDate(value) {
  if (!value) return 'No applied date';
  const date = new Date(value);
  return isValid(date) ? `Applied ${format(date, 'MMM d, yyyy')}` : 'Applied date unavailable';
}

export function ApplicationCard({ application, dragHandleProps = {}, isDragging = false }) {
  return (
    <article className={`rounded-xl border border-border bg-card p-3 shadow-sm ${isDragging ? 'ring-2 ring-primary/40 shadow-lg' : ''}`}>
      <div className="flex items-start gap-2">
        <div
          {...dragHandleProps}
          className="mt-1 cursor-grab rounded p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Move ${application.company} — ${application.jobTitle}`}
          title="Drag or press Space to move"
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </div>
        <Link to={`/applications/${application.id}`} className="min-w-0 flex-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <div className="flex items-center gap-2">
            <CompanyAvatar name={application.company} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{application.company}</p>
              <p className="truncate text-xs text-muted-foreground">{application.jobTitle}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={application.status} />
            <span className="text-xs text-muted-foreground">{appliedDate(application.appliedDate)}</span>
          </div>
          {application.location && <p className="mt-2 truncate text-xs text-muted-foreground">{application.location}</p>}
        </Link>
      </div>
    </article>
  );
}
