import React from 'react';
import { Skeleton } from './Skeleton';

export function TableSkeleton({ rows = 5, columns = 4, className = '' }) {
  return (
    <div className={`w-full rounded-xl border border-border bg-card p-4 space-y-4 ${className}`}>
      {/* Header skeleton */}
      <div className="flex gap-4 border-b border-border pb-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`th_${i}`} className="h-5 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={`tr_${r}`} className="flex gap-4 py-2">
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton key={`td_${r}_${c}`} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
