import React from 'react';
import { format } from 'date-fns';
import { Pencil, Repeat, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';

export function TaskCard({ task, onEdit, onDelete, onToggleComplete, isUpdating = false }) {
  const isCompleted = task.status === 'completed';
  const isOverdue = !isCompleted && task.dueAt && new Date(task.dueAt) < new Date();

  return (
    <Card className={`p-3 transition-shadow hover:shadow-md ${isOverdue ? 'border-danger/50' : ''}`}>
      <CardHeader className="flex-row items-start gap-3 p-0">
        <input
          type="checkbox"
          checked={isCompleted}
          disabled={isUpdating}
          onChange={() => onToggleComplete(task)}
          aria-label={`${isCompleted ? 'Reopen' : 'Complete'} ${task.title}`}
          className="mt-1 h-4 w-4 shrink-0 accent-primary"
        />
        <div className="min-w-0 flex-1">
          <CardTitle className={`text-sm font-medium ${isCompleted ? 'text-muted-foreground line-through' : ''}`}>
            {task.title}
          </CardTitle>
          {task.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>}
        </div>
        {task.recurring && (
          <Repeat className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-label={`Repeats ${task.recurring}`} title={`Repeats ${task.recurring}`} />
        )}
        <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task)}>
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </CardHeader>
      <CardContent className="ml-7 flex flex-wrap items-center gap-2 p-0 pt-3">
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} type="task" />
        {task.dueAt && (
          <span className={`text-xs ${isOverdue ? 'font-medium text-danger' : 'text-muted-foreground'}`}>
            {isOverdue ? 'Overdue · ' : 'Due '}
            {format(new Date(task.dueAt), 'MMM d, h:mm a')}
          </span>
        )}
        {task.category && <span className="text-xs text-muted-foreground">{task.category}</span>}
      </CardContent>
    </Card>
  );
}
