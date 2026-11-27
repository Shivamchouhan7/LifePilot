import React from 'react';
import { TaskCard } from './TaskCard';

export function ListView({ tasks, onEdit, onDelete, onToggleComplete, isUpdating }) {
  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  );
}
