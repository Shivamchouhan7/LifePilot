import React from 'react';
import { PlaceholderPage } from './PlaceholderPage';
import { Calendar as CalendarIcon } from 'lucide-react';

export function CalendarPage() {
  return (
    <PlaceholderPage
      title="Calendar"
      breadcrumbs={[{ label: 'Calendar' }]}
      phase="Phase 5"
      description="Unified schedule view displaying derived task deadlines, interview dates, assessments, and project milestone milestones via react-big-calendar."
      icon={CalendarIcon}
    />
  );
}
