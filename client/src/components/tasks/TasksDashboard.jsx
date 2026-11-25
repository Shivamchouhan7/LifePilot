// src/components/tasks/TasksDashboard.jsx
import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { ListView } from './ListView';
import { KanbanBoard } from './KanbanBoard';
import { Button } from '../ui/button';
import { LayoutList, Layers } from 'lucide-react';

export function TasksDashboard() {
  const { tasks, isLoading, refetch } = useTasks();
  const [view, setView] = useState('list'); // 'list' | 'kanban'

  if (isLoading) return <div className="p-4">Loading tasks…</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <div className="flex gap-2">
          <Button variant={view === 'list' ? 'default' : 'outline'} onClick={() => setView('list')}>
            <LayoutList className="h-4 w-4 mr-1" /> List
          </Button>
          <Button variant={view === 'kanban' ? 'default' : 'outline'} onClick={() => setView('kanban')}>
            <Layers className="h-4 w-4 mr-1" /> Kanban
          </Button>
        </div>
      </div>
      {view === 'list' ? (
        <ListView tasks={tasks} refetch={refetch} />
      ) : (
        <KanbanBoard tasks={tasks} refetch={refetch} />
      )}
    </div>
  );
}
