import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useProject, useUpdateProject, useDeleteProject } from '../hooks/useProjects';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { formatDate } from '../utils/formatters';

const fieldClass = 'mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground';
const createId = () => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `milestone_${Date.now()}`);
const toInputDate = (date) => (date ? new Date(date).toISOString().slice(0, 10) : '');

export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, isError, error, refetch } = useProject(id);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const [form, setForm] = useState(null);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || '',
        description: project.description || '',
        techStack: (project.techStack || []).join(', '),
        repoUrl: project.repoUrl || '',
        liveUrl: project.liveUrl || '',
        status: project.status || 'active',
        targetDate: toInputDate(project.targetDate),
        notes: project.notes || '',
      });
    }
  }, [project]);

  const updateForm = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const saveProject = (event) => {
    event.preventDefault();
    updateProject.mutate({
      id,
      payload: {
        ...form,
        techStack: form.techStack.split(',').map((technology) => technology.trim()).filter(Boolean),
        targetDate: form.targetDate ? new Date(`${form.targetDate}T12:00:00`).toISOString() : null,
        milestones: project.milestones || [],
      },
    });
  };

  const toggleMilestone = (milestoneId) => {
    const milestones = (project.milestones || []).map((milestone) => (
      milestone.id === milestoneId ? { ...milestone, done: !milestone.done } : milestone
    ));
    updateProject.mutate({ id, payload: { milestones } });
  };

  const addMilestone = (event) => {
    event.preventDefault();
    const milestones = [
      ...(project.milestones || []),
      {
        id: createId(),
        title: milestoneTitle.trim(),
        dueDate: milestoneDate ? new Date(`${milestoneDate}T12:00:00`).toISOString() : null,
        done: false,
      },
    ];
    updateProject.mutate({ id, payload: { milestones } }, {
      onSuccess: () => {
        setMilestoneTitle('');
        setMilestoneDate('');
      },
    });
  };

  const removeMilestone = (milestoneId) => {
    const milestones = (project.milestones || []).filter((milestone) => milestone.id !== milestoneId);
    updateProject.mutate({ id, payload: { milestones } });
  };

  const removeProject = () => {
    deleteProject.mutate(id, {
      onSuccess: () => navigate('/projects'),
    });
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading project…</p>;
  if (isError) return <ErrorState description={error?.message} onRetry={refetch} />;
  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="This project may have been deleted or the link may be incorrect."
        actionLabel="Back to projects"
        onAction={() => navigate('/projects')}
      />
    );
  }
  if (!form) return null;

  const milestones = project.milestones || [];
  const completed = milestones.filter((milestone) => milestone.done).length;
  const isPending = updateProject.isPending || deleteProject.isPending;

  return (
    <div>
      <PageHeader
        title={project.name}
        breadcrumbs={[{ label: 'Projects', path: '/projects' }, { label: project.name }]}
        description={project.description}
        actions={
          <>
            <Button asChild variant="outline"><Link to="/projects"><ArrowLeft className="mr-2 h-4 w-4" />Projects</Link></Button>
            <Button variant="destructive" onClick={() => setConfirmDelete(true)}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
          </>
        }
      />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Milestones</h2>
              <p className="text-sm text-muted-foreground">{completed} of {milestones.length} complete</p>
            </div>
            <Badge variant={project.status === 'completed' ? 'success' : project.status === 'planning' ? 'warning' : 'secondary'}>{project.status}</Badge>
          </div>

          {milestones.length ? (
            <div className="divide-y divide-border">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-start gap-3 py-3">
                  <input
                    type="checkbox"
                    checked={Boolean(milestone.done)}
                    onChange={() => toggleMilestone(milestone.id)}
                    aria-label={`Mark ${milestone.title} ${milestone.done ? 'incomplete' : 'complete'}`}
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${milestone.done ? 'text-muted-foreground line-through' : ''}`}>{milestone.title}</p>
                    {milestone.dueDate && <p className="mt-1 text-xs text-muted-foreground">Due {formatDate(milestone.dueDate)}</p>}
                  </div>
                  {milestone.done && <Check className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />}
                  <Button variant="ghost" size="icon" aria-label={`Delete ${milestone.title}`} onClick={() => removeMilestone(milestone.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">No milestones yet. Add one to start tracking progress.</p>
          )}

          <form onSubmit={addMilestone} className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
            <label className="text-sm font-medium">
              New milestone
              <input className={fieldClass} value={milestoneTitle} onChange={(event) => setMilestoneTitle(event.target.value)} required maxLength={150} placeholder="What needs to be done?" />
            </label>
            <label className="text-sm font-medium">
              Due date
              <input className={fieldClass} type="date" value={milestoneDate} onChange={(event) => setMilestoneDate(event.target.value)} />
            </label>
            <Button className="self-end" type="submit" disabled={isPending}><Plus className="mr-2 h-4 w-4" />Add milestone</Button>
          </form>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Project details</h2>
          <form className="space-y-4" onSubmit={saveProject}>
            <label className="block text-sm font-medium">
              Name
              <input className={fieldClass} value={form.name} onChange={updateForm('name')} required maxLength={100} />
            </label>
            <label className="block text-sm font-medium">
              Description
              <textarea className={fieldClass} rows="3" value={form.description} onChange={updateForm('description')} maxLength={1000} />
            </label>
            <label className="block text-sm font-medium">
              Tech stack <span className="font-normal text-muted-foreground">(comma separated)</span>
              <input className={fieldClass} value={form.techStack} onChange={updateForm('techStack')} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Status
                <select className={fieldClass} value={form.status} onChange={updateForm('status')}>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
              <label className="block text-sm font-medium">
                Target date
                <input className={fieldClass} type="date" value={form.targetDate} onChange={updateForm('targetDate')} />
              </label>
            </div>
            <label className="block text-sm font-medium">
              Repository URL
              <input className={fieldClass} type="url" value={form.repoUrl} onChange={updateForm('repoUrl')} placeholder="https://" />
            </label>
            <label className="block text-sm font-medium">
              Live URL
              <input className={fieldClass} type="url" value={form.liveUrl} onChange={updateForm('liveUrl')} placeholder="https://" />
            </label>
            <label className="block text-sm font-medium">
              Notes
              <textarea className={fieldClass} rows="3" value={form.notes} onChange={updateForm('notes')} maxLength={2000} />
            </label>
            <div className="flex flex-wrap gap-3">
              {project.repoUrl && <a className="inline-flex items-center gap-1 text-sm text-primary hover:underline" href={project.repoUrl} target="_blank" rel="noreferrer">Repository <ExternalLink className="h-3.5 w-3.5" /></a>}
              {project.liveUrl && <a className="inline-flex items-center gap-1 text-sm text-primary hover:underline" href={project.liveUrl} target="_blank" rel="noreferrer">Live project <ExternalLink className="h-3.5 w-3.5" /></a>}
            </div>
            {updateProject.isError && <p role="alert" className="text-sm text-danger">{updateProject.error.message}</p>}
            <Button type="submit" disabled={isPending}>{updateProject.isPending ? 'Saving…' : 'Save details'}</Button>
          </form>
        </section>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete project?"
        description={`“${project.name}” and its milestones will be removed.`}
        confirmText="Delete project"
        isLoading={deleteProject.isPending}
        onConfirm={removeProject}
      />
      {deleteProject.isError && <p role="alert" className="mt-4 text-sm text-danger">{deleteProject.error.message}</p>}
    </div>
  );
}
