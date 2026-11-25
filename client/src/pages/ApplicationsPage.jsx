import React from 'react';
import { PlaceholderPage } from './PlaceholderPage';
import { Briefcase } from 'lucide-react';

export function ApplicationsPage() {
  return (
    <PlaceholderPage
      title="Job Applications"
      breadcrumbs={[{ label: 'Applications' }]}
      phase="Phase 3"
      description="Track job applications across all 8 pipeline stages with salary comparisons, interview logs, and recruiter contact cards."
      icon={Briefcase}
    />
  );
}
