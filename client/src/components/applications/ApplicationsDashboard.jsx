import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, Columns3, LayoutList, Plus } from 'lucide-react';
import { useApplications, useCreateApplication, useDeleteApplication, useUpdateApplication } from '../../hooks/useApplications';
import { filterAndSortApplications, getApplicationStats } from '../../utils/applicationFilters';
import { PageHeader } from '../common/PageHeader';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { TableSkeleton } from '../common/TableSkeleton';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Button } from '../ui/button';
import { ApplicationFormDialog } from './ApplicationFormDialog';
import { ApplicationStats } from './ApplicationStats';
import { ApplicationPipeline } from './ApplicationPipeline';
import { ApplicationFilters } from './ApplicationFilters';
import { ApplicationKanban } from './ApplicationKanban';
import { ListView } from './ListView';

export function ApplicationsDashboard() {
  const applicationsQuery = useApplications();
  const createApplication = useCreateApplication();
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();
  const [params, setParams] = useSearchParams();
  const [editingApplication, setEditingApplication] = useState(null);
  const [deletingApplication, setDeletingApplication] = useState(null);
  const applications = applicationsQuery.data || [];
  const visibleApplications = useMemo(
    () => filterAndSortApplications(applications, params),
    [applications, params]
  );
  const stats = useMemo(() => getApplicationStats(applications), [applications]);
  const view = params.get('view') === 'kanban' ? 'kanban' : 'list';
  const isFormOpen = Boolean(editingApplication) || params.get('new') === '1';
  const isSaving = createApplication.isPending || updateApplication.isPending;

  const updateParams = (updates, remove = []) => {
    const next = new URLSearchParams(params);
    remove.forEach((key) => next.delete(key));
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setParams(next, { replace: true });
  };

  const openNewApplication = () => {
    setEditingApplication(null);
    updateParams({ new: '1' });
  };

  const closeForm = (open) => {
    if (open) {
      if (!editingApplication) updateParams({ new: '1' });
      return;
    }
    if (isSaving) return;
    setEditingApplication(null);
    updateParams({}, ['new']);
  };

  const saveApplication = async (payload) => {
    if (editingApplication) {
      await updateApplication.mutateAsync({ id: editingApplication.id, payload });
    } else {
      await createApplication.mutateAsync(payload);
    }
    setEditingApplication(null);
    updateParams({}, ['new']);
  };

  const changeStatus = (id, status, statusNote = '') => {
    const application = applications.find((item) => item.id === id);
    if (['interview', 'hr_round'].includes(status) && !application?.interviewAt) {
      setEditingApplication({ ...application, status });
      return;
    }
    updateApplication.mutate({ id, payload: { status, statusNote } });
  };

  const removeApplication = () => {
    if (!deletingApplication) return;
    deleteApplication.mutate(deletingApplication.id, {
      onSuccess: () => setDeletingApplication(null),
    });
  };

  const clearFilters = () => updateParams({}, ['q', 'company', 'status', 'jobType', 'source']);
  const selectPipelineStatus = (status) => updateParams({ status: params.get('status') === status ? '' : status });
  const changeView = (nextView) => updateParams({ view: nextView });
  const changeSort = (field) => {
    const currentSort = params.get('sort') || 'appliedDate';
    const currentDirection = params.get('direction') || 'desc';
    const dateFields = ['appliedDate', 'interviewAt', 'followUpDate'];
    const defaultDirection = dateFields.includes(field) ? 'desc' : 'asc';
    let direction = defaultDirection;
    if (currentSort === field) direction = currentDirection === 'asc' ? 'desc' : 'asc';
    updateParams({ sort: field, direction });
  };

  if (applicationsQuery.isError) {
    return <ErrorState title="Applications could not be loaded" description={applicationsQuery.error?.message} onRetry={applicationsQuery.refetch} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        breadcrumbs={[{ label: 'Applications' }]}
        description="Track opportunities from first interest through offer or close."
        actions={<Button onClick={openNewApplication}><Plus className="mr-2 h-4 w-4" />New application</Button>}
      />
      {applicationsQuery.isLoading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : (
        <>
          <ApplicationStats stats={stats} />
          <ApplicationPipeline
            applications={applications}
            selectedStatus={params.get('status') || ''}
            onSelectStatus={selectPipelineStatus}
          />
          <ApplicationFilters applications={applications} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Showing {visibleApplications.length} of {applications.length} applications
            </p>
            <div className="flex gap-2" aria-label="Application display">
              <Button type="button" size="sm" variant={view === 'list' ? 'default' : 'outline'} onClick={() => changeView('list')} aria-pressed={view === 'list'}>
                <LayoutList className="mr-1.5 h-4 w-4" />Table
              </Button>
              <Button type="button" size="sm" variant={view === 'kanban' ? 'default' : 'outline'} onClick={() => changeView('kanban')} aria-pressed={view === 'kanban'}>
                <Columns3 className="mr-1.5 h-4 w-4" />Kanban
              </Button>
            </div>
          </div>
          {!applications.length ? (
            <EmptyState
              icon={Briefcase}
              title="No applications yet"
              description="Add an opportunity to start tracking your pipeline."
              actionLabel="New application"
              onAction={openNewApplication}
            />
          ) : !visibleApplications.length ? (
            <EmptyState
              title="No matching applications"
              description="Try changing your search or filters."
              actionLabel="Clear filters"
              onAction={clearFilters}
            />
          ) : view === 'kanban' ? (
            <ApplicationKanban applications={visibleApplications} onStatusChange={changeStatus} isUpdating={updateApplication.isPending} />
          ) : (
            <ListView
              applications={visibleApplications}
              sort={params.get('sort') || 'appliedDate'}
              direction={params.get('direction') || 'desc'}
              onSort={changeSort}
              onEdit={setEditingApplication}
              onStatusChange={changeStatus}
              isUpdating={updateApplication.isPending}
            />
          )}
        </>
      )}
      <ApplicationFormDialog
        open={isFormOpen}
        onOpenChange={closeForm}
        application={editingApplication}
        onSave={saveApplication}
        isSaving={isSaving}
      />
      <ConfirmDialog
        open={Boolean(deletingApplication)}
        onOpenChange={(open) => { if (!open && !deleteApplication.isPending) setDeletingApplication(null); }}
        title="Delete application?"
        description={`${deletingApplication?.company || 'This application'} will be permanently removed from your tracker.`}
        confirmText="Delete application"
        isLoading={deleteApplication.isPending}
        onConfirm={removeApplication}
      />
    </div>
  );
}
