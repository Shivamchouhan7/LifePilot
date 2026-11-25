import React from 'react';
import { PlaceholderPage } from './PlaceholderPage';
import { Settings as SettingsIcon } from 'lucide-react';

export function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      breadcrumbs={[{ label: 'Settings' }]}
      phase="Phase 6"
      description="Manage account profile, display themes, notification preferences, and export/reset options."
      icon={SettingsIcon}
    />
  );
}
