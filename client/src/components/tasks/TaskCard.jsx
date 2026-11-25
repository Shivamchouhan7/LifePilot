// src/components/tasks/TaskCard.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';

export function TaskCard({ task }) {
  return (
    <Card className="p-2 hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <CardTitle className="text-sm font-medium truncate" title={task.title}>
          {task.title}
        </CardTitle>
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
      </CardContent>
    </Card>
  );
}
