import React from 'react';
import { PlaceholderPage } from './PlaceholderPage';
import { FileText } from 'lucide-react';

export function NotesPage() {
  return (
    <PlaceholderPage
      title="Notes & Resources"
      breadcrumbs={[{ label: 'Notes' }]}
      phase="Phase 5"
      description="Markdown note taking and interview knowledge base with category tags, pinning, and live preview rendering via react-markdown."
      icon={FileText}
    />
  );
}
