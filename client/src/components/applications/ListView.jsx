// src/components/applications/ListView.jsx
import React from 'react';
import { ApplicationCard } from './ApplicationCard';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

export function ListView({ applications, refetch }) {
  const handleAdd = () => {
    console.log('Add application clicked');
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleAdd} variant="default">
        <Plus className="h-4 w-4 mr-2" /> Add Application
      </Button>
      {applications.length === 0 ? (
        <p className="text-muted-foreground">No applications yet.</p>
      ) : (
        <div className="grid gap-3">
          {applications.map(app => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
