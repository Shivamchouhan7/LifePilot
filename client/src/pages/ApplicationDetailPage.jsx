import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useApplication, useDeleteApplication, useUpdateApplication } from '../hooks/useApplications';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Button } from '../components/ui/button';
import { ApplicationDetails } from '../components/applications/ApplicationDetails';
import { ApplicationFormDialog } from '../components/applications/ApplicationFormDialog';
import { ApplicationHistory } from '../components/applications/ApplicationHistory';
import { ApplicationStatusControl } from '../components/applications/ApplicationStatusControl';

const fieldClass = 'mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground';

export function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const applicationQuery = useApplication(id);
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();
  const [editingApplication, setEditingApplication] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const application = applicationQuery.data;

  const changeStatus = (status, note = '') => {
    if (!application || status === application.status) return;
    if (['interview', 'hr_round'].includes(status) && !application.interviewAt) {
      setEditingApplication({ ...application, status });
      return;
    }
    updateApplication.mutate(
      { id: application.id, payload: { status, statusNote: note } },
      { onSuccess: () => setStatusNote('') }
    );
  };

  const saveApplication = async (payload) => {
    await updateApplication.mutateAsync({ id: application.id, payload });
    setEditingApplication(null);
  };

  const removeApplication = () => {
    if (!application) return;
    deleteApplication.mutate(application.id, {
      onSuccess: () => navigate('/applications'),
    });
  };

  if (applicationQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading application details…</p>;
  }

  if (applicationQuery.isError) {
    const notFound = applicationQuery.error?.message?.includes('item not found');
    return (
      <div>
        <PageHeader title="Application" breadcrumbs={[{ label: 'Applications', path: '/applications' }, { label: 'Details' }]} />
        {notFound ? (
          <EmptyState
            title="Application not found"
            description="This application may have been deleted or the link may be incorrect."
            actionLabel="Back to applications"
            onAction={() => navigate('/applications')}
          />
        ) : (
          <ErrorState title="Application could not be loaded" description={applicationQuery.error?.message} onRetry={applicationQuery.refetch} />
        )}
      </div>
    );
  }

  if (!application) {
    return <ErrorState title="Application data is unavailable" description="The application query returned no record." onRetry={applicationQuery.refetch} />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={application.company}
        breadcrumbs={[{ label: 'Applications', path: '/applications' }, { label: application.company }]}
        description={application.jobTitle}
        className="sm:!flex-col sm:!items-stretch lg:!flex-row lg:!items-center"
        actions={(
          <>
            <Button asChild type="button" size="sm" variant="outline"><Link to="/applications"><ArrowLeft className="mr-2 h-4 w-4" />All applications</Link></Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setEditingApplication(application)}><Pencil className="mr-2 h-4 w-4" />Edit</Button>
            <Button type="button" size="sm" variant="destructive" onClick={() => setDeleteOpen(true)}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
          </>
        )}
      />

      <section className="grid gap-4 rounded-xl border border-border bg-card p-4 shadow-sm lg:grid-cols-[minmax(12rem,20rem)_1fr] lg:items-end">
        <ApplicationStatusControl
          application={application}
          onChange={changeStatus}
          isUpdating={updateApplication.isPending}
          statusNote={statusNote}
        />
        <label className="block text-sm font-medium">
          Status change note <span className="font-normal text-muted-foreground">(optional)</span>
          <input
            className={fieldClass}
            value={statusNote}
            onChange={(event) => setStatusNote(event.target.value)}
            maxLength={300}
            placeholder="Add context for the timeline"
            disabled={updateApplication.isPending}
          />
        </label>
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
        <ApplicationDetails application={application} />
        <ApplicationHistory history={application.statusHistory || []} />
      </div>

      <ApplicationFormDialog
        open={Boolean(editingApplication)}
        onOpenChange={(open) => { if (!open && !updateApplication.isPending) setEditingApplication(null); }}
        application={editingApplication}
        onSave={saveApplication}
        isSaving={updateApplication.isPending}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => { if (!deleteApplication.isPending) setDeleteOpen(open); }}
        title="Delete application?"
        description={`${application.company} — ${application.jobTitle} will be permanently removed.`}
        confirmText="Delete application"
        isLoading={deleteApplication.isPending}
        onConfirm={removeApplication}
      />
    </div>
  );
}
