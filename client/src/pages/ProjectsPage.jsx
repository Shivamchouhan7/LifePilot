import React from 'react';
import { PlaceholderPage } from './PlaceholderPage';
import { FolderGit2 } from 'lucide-react';

export function ProjectsPage() {
  return (
    <PlaceholderPage
      title="Projects"
      breadcrumbs={[{ label: 'Projects' }]}
      phase="Phase 4"
      description="Manage portfolio projects, tech stacks, repository and live deployment links, and chronological milestone checkpoints."
      icon={FolderGit2}
    />
  );
}
