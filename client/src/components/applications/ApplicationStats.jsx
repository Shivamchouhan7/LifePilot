import React from 'react';
import { Activity, Briefcase, CheckCircle2, Clock3, Percent, XCircle } from 'lucide-react';

const cards = [
  { key: 'total', label: 'Total applications', icon: Briefcase },
  { key: 'active', label: 'Active pipeline', icon: Activity },
  { key: 'interviews', label: 'Interviews', icon: Clock3 },
  { key: 'offers', label: 'Offers', icon: CheckCircle2 },
  { key: 'rejected', label: 'Rejected', icon: XCircle },
];

export function ApplicationStats({ stats }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6" aria-label="Application statistics">
      {cards.map(({ key, label, icon: Icon }) => (
        <div key={key} className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>{label}</span>
            <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-semibold">{stats[key]}</p>
        </div>
      ))}
      <div
        className="rounded-xl border border-border bg-card p-4 shadow-sm"
        title="Applications past Applied divided by applications that reached Applied. Interested applications are excluded."
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">Response rate</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Past Applied ÷ reached Applied
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Percent className="h-4 w-4 text-primary" aria-hidden="true" />
            <p className="text-2xl font-semibold">{stats.responseRate}%</p>
          </div>
        </div>
      </div>
    </section>
  );
}
