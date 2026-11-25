import React from 'react';
import { Button } from '../ui/button';
import { Inbox } from 'lucide-react';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no records to display.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-8 text-center animate-in fade-in-50 ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        <Icon className="h-7 w-7 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
