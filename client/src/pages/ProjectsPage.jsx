import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, Plus, Trash2 } from 'lucide-react';
import { useProjects, useCreateProject, useDeleteProject } from '../hooks/useProjects';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { formatDate } from '../utils/formatters';

const fieldClass = 'mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground';

export function ProjectsPage() {
  const { data: projects = [], isLoading, isError, error, refetch } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', techStack: '', repoUrl: '', liveUrl: '', status: 'active', targetDate: '' });
  const updateForm = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleCreate = (event) => {
    event.preventDefault();
    createProject.mutate({
      ...form,
      techStack: form.techStack.split(',').map((technology) => technology.trim()).filter(Boolean),
      targetDate: form.targetDate ? new Date(`${form.targetDate}T12:00:00`).toISOString() : null,
    }, {
      onSuccess: () => {
        setForm({ name: '', description: '', techStack: '', repoUrl: '', liveUrl: '', status: 'active', targetDate: '' });
        setFormOpen(false);
      },
    });
  };

  const handleDelete = () => {
    deleteProject.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        breadcrumbs={[{ label: 'Projects' }]}
        description="Manage portfolio work, track milestones, and keep project links and tech stacks together."
        actions={<Button onClick={() => setFormOpen(true)}><Plus className="mr-2 h-4 w-4" />New project</Button>}
      />

      {isLoading ? <p className="text-sm text-muted-foreground">Loading projects…</p> : null}
      {isError ? <ErrorState description={error?.message} onRetry={refetch} /> : null}
      {!isLoading && !isError && projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects yet"
          description="Create a project to organize its milestones, tech stack, and links."
          actionLabel="Create project"
          onAction={() => setFormOpen(true)}
        />
      ) : null}

      {!isLoading && !isError && projects.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {projects.map((project) => {
            const milestones = project.milestones || [];
            const completed = milestones.filter((milestone) => milestone.done).length;
            const progress = milestones.length ? Math.round((completed / milestones.length) * 100) : 0;
            return (
              <article key={project.id} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/projects/${project.id}`} className="group min-w-0">
                    <h2 className="truncate text-lg font-semibold group-hover:text-primary">{project.name}</h2>
                    <p className="mt-1 line-clamp-2 min-h-10 text-sm text-muted-foreground">{project.description || 'No description yet.'}</p>
                  </Link>
                  <Button variant="ghost" size="icon" aria-label={`Delete ${project.name}`} onClick={() => setDeleteTarget(project)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge variant={project.status === 'completed' ? 'success' : project.status === 'planning' ? 'warning' : 'secondary'}>
                    {project.status}
                  </Badge>
                  {project.targetDate && <span className="text-xs text-muted-foreground">Due {formatDate(project.targetDate)}</span>}
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                    <span>Milestones</span>
                    <span>{completed}/{milestones.length} · {progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" aria-label={`${project.name} milestone progress`}>
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                {project.techStack?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((technology) => <Badge key={technology} variant="outline">{technology}</Badge>)}
                    {project.techStack.length > 4 && <span className="self-center text-xs text-muted-foreground">+{project.techStack.length - 4}</span>}
                  </div>
                )}
                <Link to={`/projects/${project.id}`} className="mt-5 text-sm font-medium text-primary hover:underline">Open project →</Link>
              </article>
            );
          })}
        </div>
      )}

      <Modal open={formOpen} onOpenChange={setFormOpen} title="New project" description="Add a project workspace with its status and portfolio details.">
        <form className="space-y-4" onSubmit={handleCreate}>
          <label className="block text-sm font-medium">
            Project name
            <input className={fieldClass} value={form.name} onChange={updateForm('name')} required maxLength={100} autoFocus />
          </label>
          <label className="block text-sm font-medium">
            Description
            <textarea className={fieldClass} rows="3" value={form.description} onChange={updateForm('description')} maxLength={1000} />
          </label>
          <label className="block text-sm font-medium">
            Tech stack <span className="font-normal text-muted-foreground">(comma separated)</span>
            <input className={fieldClass} value={form.techStack} onChange={updateForm('techStack')} placeholder="React, Node.js, PostgreSQL" />
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
          {createProject.isError && <p role="alert" className="text-sm text-danger">{createProject.error.message}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createProject.isPending}>{createProject.isPending ? 'Saving…' : 'Create project'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete project?"
        description={`“${deleteTarget?.name || ''}” and its milestones will be removed.`}
        confirmText="Delete project"
        isLoading={deleteProject.isPending}
        onConfirm={handleDelete}
      />
      {deleteProject.isError && <p role="alert" className="mt-4 text-sm text-danger">{deleteProject.error.message}</p>}
    </div>
  );
}
