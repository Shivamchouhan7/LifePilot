// src/components/tasks/TaskCard.jsx
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useDeleteTask } from '../../hooks/useTasks';
import { format } from 'date-fns';

export function TaskCard({ task }) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const deleteTask = useDeleteTask();

  return (
    <Card className="p-2 hover:shadow-lg transition-shadow">
      <CardHeader className="flex-row items-start justify-between gap-2 p-0">
        <CardTitle className="min-w-0 flex-1 truncate text-sm font-medium" title={task.title}>
          {task.title}
        </CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-danger"
          aria-label={`Delete task ${task.title}`}
          onClick={() => setDeleteConfirmOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0 text-xs">
        <div className="flex flex-wrap gap-1 mt-1">
          {task.priority && (
            <Badge variant="secondary" className="uppercase">{task.priority}</Badge>
          )}
          {task.due && (
            <Badge variant="outline">{format(new Date(task.due), 'MMM d')}</Badge>
          )}
        </div>
        {deleteTask.isError && <p role="alert" className="mt-2 text-danger">{deleteTask.error.message}</p>}
      </CardContent>
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete task?"
        description={`“${task.title}” will be permanently removed.`}
        confirmText="Delete task"
        isLoading={deleteTask.isPending}
        onConfirm={() => deleteTask.mutate(task.id, { onSuccess: () => setDeleteConfirmOpen(false) })}
      />
    </Card>
  );
}
