import React from 'react';
import { PlaceholderPage } from './PlaceholderPage';
import { LayoutDashboard } from 'lucide-react';

export function OverviewPage() {
  return (
    <PlaceholderPage
      title="Overview"
      breadcrumbs={[{ label: 'Overview' }]}
      phase="Phase 6"
      description="Executive dashboard summarizing high-priority tasks, upcoming interviews, project velocity, and learning streaks."
      icon={LayoutDashboard}
    />
  );
}
