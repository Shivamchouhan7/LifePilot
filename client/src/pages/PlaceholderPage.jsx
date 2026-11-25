import React, { useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { Construction } from 'lucide-react';

export function PlaceholderPage({
  title,
  breadcrumbs = [],
  phase = 'a later phase',
  description,
  icon = Construction,
}) {
  useEffect(() => {
    document.title = `${title} - LifePilot`;
  }, [title]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        breadcrumbs={breadcrumbs}
        description={description || `This module is scheduled for implementation in ${phase}.`}
      />
      <EmptyState
        icon={icon}
        title={`${title} Module`}
        description={`The complete feature set for ${title} will be unlocked during ${phase}. The underlying data models, seed generators, and storage services are already fully operational.`}
      />
    </div>
  );
}
