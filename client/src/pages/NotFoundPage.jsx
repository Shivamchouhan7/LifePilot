import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  useEffect(() => {
    document.title = '404 Page Not Found - LifePilot';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 shadow-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
          <FileQuestion className="h-8 w-8 stroke-[1.5]" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">404</h1>
        <h2 className="text-lg font-semibold text-foreground mt-1">Page Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The view or route you requested does not exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild className="gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
