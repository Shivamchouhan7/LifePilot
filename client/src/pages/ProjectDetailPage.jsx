import React from 'react';
import { useParams } from 'react-router-dom';
import { PlaceholderPage } from './PlaceholderPage';
import { FolderGit2 } from 'lucide-react';

export function ProjectDetailPage() {
  const { id } = useParams();

  return (
    <PlaceholderPage
      title={`Project Details (${id})`}
      breadcrumbs={[
        { label: 'Projects', path: '/projects' },
        { label: id || 'Detail' },
      ]}
      phase="Phase 4"
      description="Project workspace covering milestone deliverables, associated tasks, and technical documentation."
      icon={FolderGit2}
    />
  );
}
