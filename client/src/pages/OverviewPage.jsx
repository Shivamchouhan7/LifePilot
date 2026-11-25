import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { addDays, format, isAfter, isBefore, isToday, startOfDay } from 'date-fns';
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  GraduationCap,
  ListTodo,
  Plus,
} from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useApplications } from '../hooks/useApplications';
import { useProjects } from '../hooks/useProjects';
import { useLearningGoals } from '../hooks/useLearningGoals';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { PageHeader } from '../components/common/PageHeader';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { StatusBadge } from '../components/common/StatusBadge';

function MetricCard({ title, value, detail, icon: Icon, href, accent = 'text-primary' }) {
  const content = (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/30">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </div>
      <span className={`rounded-lg bg-muted p-2.5 ${accent}`}><Icon className="h-5 w-5" /></span>
    </div>
  );
  return href ? <Link to={href} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{content}</Link> : content;
}

function SectionHeading({ title, href, linkLabel = 'View all' }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-base font-semibold">{title}</h2>
      {href && <Link to={href} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">{linkLabel}<ArrowRight className="h-3.5 w-3.5" /></Link>}
    </div>
  );
}

export function OverviewPage() {
  const tasksQuery = useTasks();
  const applicationsQuery = useApplications();
  const projectsQuery = useProjects();
  const learningQuery = useLearningGoals();
  const today = useMemo(() => startOfDay(new Date()), []);
  const range = useMemo(() => ({ start: today, end: addDays(today, 7) }), [today]);
  const eventsQuery = useCalendarEvents(range);

  const tasks = tasksQuery.data || [];
  const applications = applicationsQuery.data || [];
  const projects = projectsQuery.data || [];
  const goals = learningQuery.data || [];
  const events = eventsQuery.data || [];

  const overdueTasks = tasks.filter((task) => (
    task.status !== 'completed' && task.dueAt && isBefore(new Date(task.dueAt), today)
  ));
  const openTasks = tasks.filter((task) => task.status !== 'completed');
  const activeApplications = applications.filter((application) => !['rejected', 'withdrawn', 'offered'].includes(application.status));
  const activeProjects = projects.filter((project) => project.status === 'active');
  const learningProgress = goals.length
    ? Math.round(goals.reduce((total, goal) => total + (goal.progress || 0), 0) / goals.length)
    : 0;
  const upcomingEvents = events
    .filter((event) => isAfter(new Date(event.start), new Date()))
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);
  const priorityTasks = openTasks
    .filter((task) => task.priority === 'high')
    .sort((a, b) => new Date(a.dueAt || '9999-12-31') - new Date(b.dueAt || '9999-12-31'))
    .slice(0, 5);
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0))
    .slice(0, 4);
  const isLoading = [tasksQuery, applicationsQuery, projectsQuery, learningQuery, eventsQuery].some((query) => query.isLoading);
  const failedQuery = [tasksQuery, applicationsQuery, projectsQuery, learningQuery, eventsQuery].find((query) => query.isError);

  if (failedQuery) {
    return (
      <ErrorState
        title="Dashboard data could not be loaded"
        description={failedQuery.error?.message}
        onRetry={() => Promise.all([tasksQuery.refetch(), applicationsQuery.refetch(), projectsQuery.refetch(), learningQuery.refetch(), eventsQuery.refetch()])}
      />
    );
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading your workspace…</p>;

  return (
    <div>
      <PageHeader
        title="Overview"
        breadcrumbs={[{ label: 'Overview' }]}
        description={`Your workspace at a glance · ${format(new Date(), 'EEEE, MMMM d')}`}
        actions={<Button asChild size="sm"><Link to="/tasks"><Plus className="mr-2 h-4 w-4" />Add a task</Link></Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Open tasks" value={openTasks.length} detail={`${overdueTasks.length} overdue`} icon={ListTodo} href="/tasks" accent="text-warning" />
        <MetricCard title="Active applications" value={activeApplications.length} detail={`${applications.length} total tracked`} icon={Briefcase} href="/applications" accent="text-secondary" />
        <MetricCard title="Active projects" value={activeProjects.length} detail={`${projects.length} total projects`} icon={FolderKanban} href="/projects" accent="text-primary" />
        <MetricCard title="Learning progress" value={`${learningProgress}%`} detail={`${goals.length} learning roadmaps`} icon={GraduationCap} href="/learning" accent="text-success" />
      </div>

      {overdueTasks.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock3 className="h-4 w-4 text-warning" />
            <span><strong>{overdueTasks.length} overdue {overdueTasks.length === 1 ? 'task' : 'tasks'}</strong> need attention.</span>
          </div>
          <Link to="/tasks" className="text-sm font-medium text-primary hover:underline">Review tasks</Link>
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <SectionHeading title="Upcoming this week" href="/calendar" />
          {upcomingEvents.length ? (
            <div className="divide-y divide-border">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  to={event.entityType === 'project' ? `/projects/${event.entityId}` : event.entityType === 'application' ? `/applications/${event.entityId}` : '/calendar'}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-muted text-[10px] leading-tight text-muted-foreground">
                    <span>{format(new Date(event.start), 'MMM')}</span><strong className="text-sm text-foreground">{format(new Date(event.start), 'd')}</strong>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{event.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {isToday(new Date(event.start)) ? 'Today' : format(new Date(event.start), 'EEE, MMM d')} · {format(new Date(event.start), 'h:mm a')}
                    </span>
                  </span>
                  <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">No upcoming events in the next seven days.</p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <SectionHeading title="High-priority tasks" href="/tasks" />
          {priorityTasks.length ? (
            <div className="divide-y divide-border">
              {priorityTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${task.status === 'in_progress' ? 'bg-primary' : 'bg-warning'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{task.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{task.dueAt ? `Due ${format(new Date(task.dueAt), 'MMM d')}` : 'No due date'}</p>
                  </div>
                  <StatusBadge type="task" status={task.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">No open high-priority tasks. Nice work!</p>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <SectionHeading title="Project progress" href="/projects" />
          {projects.length ? (
            <div className="space-y-4">
              {projects.slice(0, 4).map((project) => {
                const milestones = project.milestones || [];
                const done = milestones.filter((milestone) => milestone.done).length;
                const progress = milestones.length ? Math.round((done / milestones.length) * 100) : 0;
                return (
                  <Link key={project.id} to={`/projects/${project.id}`} className="block">
                    <div className="mb-1.5 flex justify-between gap-2 text-sm">
                      <span className="truncate font-medium">{project.name}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" aria-label={`${project.name} progress`}>
                      <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">Create a project to see its milestone progress here.</p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <SectionHeading title="Recent applications" href="/applications" />
          {recentApplications.length ? (
            <div className="divide-y divide-border">
              {recentApplications.map((application) => (
                <Link key={application.id} to={`/applications/${application.id}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {application.company?.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{application.company}</span>
                    <span className="block truncate text-xs text-muted-foreground">{application.jobTitle}</span>
                  </span>
                  <Badge variant="outline" className="shrink-0 capitalize">{application.status.replace('_', ' ')}</Badge>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">No applications tracked yet.</p>
          )}
        </section>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <CheckCircle2 className="h-4 w-4 text-success" />
        <span>Workspace data is saved locally in this browser.</span>
      </div>
    </div>
  );
}
