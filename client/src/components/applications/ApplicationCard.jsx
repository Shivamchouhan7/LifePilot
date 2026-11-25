// src/components/applications/ApplicationCard.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';

export function ApplicationCard({ application }) {
  return (
    <Card className="p-2 hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <CardTitle className="text-sm font-medium truncate" title={application.title}>
          {application.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 text-xs">
        <div className="flex flex-wrap gap-1 mt-1">
          {application.company && (
            <Badge variant="secondary" className="uppercase">{application.company}</Badge>
          )}
          {application.status && (
            <Badge variant="outline">{application.status}</Badge>
          )}
          {application.appliedAt && (
            <Badge variant="outline">{format(new Date(application.appliedAt), 'MMM d')}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
