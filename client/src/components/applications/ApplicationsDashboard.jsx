// src/components/applications/ApplicationsDashboard.jsx
import React, { useState } from 'react';
import { useApplications } from '../../hooks/useApplications';
import { ListView } from './ListView';
import { Button } from '../ui/button';
import { LayoutList } from 'lucide-react';

export function ApplicationsDashboard() {
  const { applications, isLoading, refetch } = useApplications();
  const [view, setView] = useState('list'); // Phase 3 only supports list view now

  if (isLoading) return <div className="p-4">Loading applications…</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Job Applications</h1>
        <div className="flex gap-2">
          <Button variant={view === 'list' ? 'default' : 'outline'} onClick={() => setView('list')}>
            <LayoutList className="h-4 w-4 mr-1" /> List
          </Button>
        </div>
      </div>
      {view === 'list' && <ListView applications={applications} refetch={refetch} />}
    </div>
  );
}
