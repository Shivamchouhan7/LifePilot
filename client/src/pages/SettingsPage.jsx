import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Download, RotateCcw, Save, Settings2 } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/ui/button';
import { useSettings, useUpdateSettings } from '../hooks/useSettings';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { resetSeedData } from '../data/seed';
import { storage } from '../utils/storage';

const DEFAULT_PROFILE = {
  name: 'Alex Morgan',
  role: 'Staff Frontend Engineer',
};

const EXPORT_ENTITIES = ['tasks', 'applications', 'learning', 'projects', 'notes', 'events', 'settings'];

function SettingSection({ title, description, children }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Field({ label, children, description }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {description && <span className="block text-xs text-muted-foreground">{description}</span>}
    </label>
  );
}

const inputClass = 'mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function SettingsPage() {
  const settingsQuery = useSettings();
  const updateSettings = useUpdateSettings();
  const queryClient = useQueryClient();
  const { user, updateProfile } = useAuth();
  const { setTheme } = useTheme();
  const [form, setForm] = useState(null);
  const [notice, setNotice] = useState(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (settingsQuery.data) {
      setForm({
        ...settingsQuery.data,
        profile: { ...settingsQuery.data.profile },
      });
    }
  }, [settingsQuery.data]);

  if (settingsQuery.isError) {
    return (
      <ErrorState
        title="Settings could not be loaded"
        description={settingsQuery.error?.message}
        onRetry={() => settingsQuery.refetch()}
      />
    );
  }

  if (settingsQuery.isLoading || !form) {
    return <p className="text-sm text-muted-foreground">Loading your settings…</p>;
  }

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };
  const setProfileField = (field, value) => {
    setForm((current) => ({
      ...current,
      profile: { ...current.profile, [field]: value },
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setNotice(null);
    try {
      const saved = await updateSettings.mutateAsync(form);
      setTheme(saved.theme);
      updateProfile({ name: saved.profile.name, role: saved.profile.role });
      setNotice({ type: 'success', text: 'Your settings have been saved.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.message || 'Your settings could not be saved.' });
    }
  };

  const handleExport = () => {
    try {
      const data = Object.fromEntries(
        EXPORT_ENTITIES.map((entity) => [entity, storage.get(entity, [])])
      );
      const file = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), data }, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lifepilot-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setNotice({ type: 'success', text: 'Your LifePilot data has been exported.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.message || 'Your data could not be exported.' });
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all LifePilot data to the original demo data? This cannot be undone.')) return;
    setResetting(true);
    setNotice(null);
    try {
      resetSeedData();
      setTheme('dark');
      updateProfile(DEFAULT_PROFILE);
      await queryClient.invalidateQueries();
      setNotice({ type: 'success', text: 'Your workspace has been reset to the original demo data.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.message || 'The workspace could not be reset.' });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        breadcrumbs={[{ label: 'Settings' }]}
        description="Manage your profile, workspace preferences, and local data."
        actions={(
          <Button type="submit" form="settings-form" size="sm" disabled={updateSettings.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateSettings.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        )}
      />

      {notice && (
        <p
          className={`mb-5 rounded-lg border px-4 py-3 text-sm ${notice.type === 'error' ? 'border-danger/30 bg-danger/5 text-danger' : 'border-success/30 bg-success/5 text-success'}`}
          role={notice.type === 'error' ? 'alert' : 'status'}
        >
          {notice.text}
        </p>
      )}

      <form id="settings-form" className="space-y-5" onSubmit={handleSave}>
        <SettingSection title="Profile" description="Update the name and role shown in your workspace.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Display name">
              <input
                className={inputClass}
                value={form.profile.name || ''}
                onChange={(event) => setProfileField('name', event.target.value)}
                required
                maxLength={80}
                autoComplete="name"
              />
            </Field>
            <Field label="Role">
              <input
                className={inputClass}
                value={form.profile.role || ''}
                onChange={(event) => setProfileField('role', event.target.value)}
                maxLength={80}
                autoComplete="organization-title"
              />
            </Field>
            <Field label="Account email" description="Email changes are not supported for the local demo account.">
              <input className={inputClass} value={user?.email || form.profile.email || ''} readOnly />
            </Field>
          </div>
        </SettingSection>

        <SettingSection title="Appearance" description="Choose the theme used across LifePilot.">
          <Field label="Theme">
            <select className={inputClass} value={form.theme} onChange={(event) => setField('theme', event.target.value)}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </Field>
        </SettingSection>

        <SettingSection title="Notifications" description="Choose whether workspace notification indicators are enabled.">
          <label className="flex items-center justify-between gap-4">
            <span>
              <span className="block text-sm font-medium">Enable notifications</span>
              <span className="mt-1 block text-xs text-muted-foreground">Show notification indicators in the workspace.</span>
            </span>
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={Boolean(form.notifications)}
              onChange={(event) => setField('notifications', event.target.checked)}
            />
          </label>
        </SettingSection>

        <SettingSection title="Regional preferences" description="Set how dates and times are displayed.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date format">
              <select className={inputClass} value={form.dateFormat} onChange={(event) => setField('dateFormat', event.target.value)}>
                <option value="MMM d, yyyy">Jun 5, 2026</option>
                <option value="MM/dd/yyyy">06/05/2026</option>
                <option value="dd/MM/yyyy">05/06/2026</option>
                <option value="yyyy-MM-dd">2026-06-05</option>
              </select>
            </Field>
            <Field label="Time format">
              <select className={inputClass} value={form.timeFormat} onChange={(event) => setField('timeFormat', event.target.value)}>
                <option value="12h">12-hour (2:30 PM)</option>
                <option value="24h">24-hour (14:30)</option>
              </select>
            </Field>
          </div>
        </SettingSection>

        <SettingSection title="Task defaults" description="Set the priority automatically assigned to new tasks.">
          <Field label="Default task priority">
            <select
              className={inputClass}
              value={form.defaultTaskPriority}
              onChange={(event) => setField('defaultTaskPriority', event.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </Field>
        </SettingSection>
      </form>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <SettingSection title="Export your data" description="Download a JSON copy of your locally saved workspace records.">
          <Button type="button" variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export workspace data
          </Button>
        </SettingSection>
        <SettingSection title="Reset workspace" description="Replace saved workspace records with the original demo data.">
          <Button type="button" variant="destructive" onClick={handleReset} disabled={resetting}>
            {resetting ? <Settings2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />}
            {resetting ? 'Resetting…' : 'Reset to demo data'}
          </Button>
        </SettingSection>
      </div>
    </div>
  );
}
