import React from 'react';
import { useParams } from 'react-router-dom';
import { PlaceholderPage } from './PlaceholderPage';
import { Briefcase } from 'lucide-react';

export function ApplicationDetailPage() {
  const { id } = useParams();

  return (
    <PlaceholderPage
      title={`Application Details (${id})`}
      breadcrumbs={[
        { label: 'Applications', path: '/applications' },
        { label: id || 'Detail' },
      ]}
      phase="Phase 3"
      description="Deep-dive application view with full status timeline history, interview preparation notes, and recruiter communication log."
      icon={Briefcase}
    />
  );
}
