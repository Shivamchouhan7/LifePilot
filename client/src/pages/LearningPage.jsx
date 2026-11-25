import React from 'react';
import { PlaceholderPage } from './PlaceholderPage';
import { GraduationCap } from 'lucide-react';

export function LearningPage() {
  return (
    <PlaceholderPage
      title="Learning & Skills"
      breadcrumbs={[{ label: 'Learning' }]}
      phase="Phase 4"
      description="Track technical study roadmaps, topic checklists, lesson progress percentages, and scheduled spaced-repetition dates."
      icon={GraduationCap}
    />
  );
}
