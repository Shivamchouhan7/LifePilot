import React from 'react';
import { PlaceholderPage } from './PlaceholderPage';
import { BarChart3 } from 'lucide-react';

export function AnalyticsPage() {
  return (
    <PlaceholderPage
      title="Analytics"
      breadcrumbs={[{ label: 'Analytics' }]}
      phase="Phase 6"
      description="Interactive charts visualizing application conversion funnels, task velocity, study hours, and weekly productivity metrics via Recharts."
      icon={BarChart3}
    />
  );
}
