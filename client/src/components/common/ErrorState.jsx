import React from 'react';
import { Button } from '../ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';

export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred while loading this data. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div
      className={`flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-danger/20 bg-danger/5 p-8 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {onRetry && (
        <div className="mt-5">
          <Button variant="outline" onClick={onRetry} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
