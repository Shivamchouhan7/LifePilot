// src/components/tasks/ListView.jsx
import React from 'react';
import { TaskCard } from './TaskCard';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

export function ListView({ tasks, refetch }) {
  // simple placeholder for add task button – real form omitted for brevity
  const handleAdd = () => {
    // In a real app this would open a modal; here we just log.
    console.log('Add task clicked');
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleAdd} variant="default">
        <Plus className="h-4 w-4 mr-2" /> Add Task
      </Button>
      {tasks.length === 0 ? (
        <p className="text-muted-foreground">No tasks yet.</p>
      ) : (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
