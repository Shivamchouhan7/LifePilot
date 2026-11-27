import React from 'react';
import { format, isValid } from 'date-fns';
import { Clock3 } from 'lucide-react';
import { APPLICATION_STATUSES } from '../../constants/status';
import { StatusBadge } from '../common/StatusBadge';

export function ApplicationHistory({ history = [] }) {
  const entries = [...history].sort((left, right) => new Date(right.at) - new Date(left.at));

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm" aria-labelledby="application-history-title">
      <h2 id="application-history-title" className="font-semibold">Status history</h2>
      {entries.length ? (
        <ol className="mt-4 space-y-4">
          {entries.map((entry, index) => {
            const date = new Date(entry.at);
            return (
              <li key={`${entry.status}-${entry.at}-${index}`} className="flex gap-3">
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={entry.status} />
                    <time className="text-xs text-muted-foreground" dateTime={entry.at}>
                      {isValid(date) ? format(date, 'MMM d, yyyy · h:mm a') : 'Date unavailable'}
                    </time>
                  </div>
                  {entry.note && <p className="mt-1 text-sm text-muted-foreground">{entry.note}</p>}
                  {!APPLICATION_STATUSES[entry.status] && (
                    <p className="mt-1 text-xs text-warning">This history entry uses an unknown status.</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">No status changes recorded.</p>
      )}
    </section>
  );
}
