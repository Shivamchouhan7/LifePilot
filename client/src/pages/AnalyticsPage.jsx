import React, { useMemo } from 'react';
import { format, startOfWeek, subWeeks } from 'date-fns';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, Briefcase, CheckCircle2, GraduationCap, ListTodo } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useApplications } from '../hooks/useApplications';
import { useProjects } from '../hooks/useProjects';
import { useLearningGoals } from '../hooks/useLearningGoals';
import { PageHeader } from '../components/common/PageHeader';
import { ErrorState } from '../components/common/ErrorState';

const chartColors = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--danger))',
  'hsl(var(--event-followup))',
  'hsl(var(--muted-foreground))',
];

const chartTooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.75rem',
  color: 'hsl(var(--foreground))',
};

function StatCard({ title, value, note, icon: Icon }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

function ChartCard({ title, description, children }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      <div className="mt-5 h-64 min-w-0">{children}</div>
    </section>
  );
}

export function AnalyticsPage() {
  const tasksQuery = useTasks();
  const applicationsQuery = useApplications();
  const projectsQuery = useProjects();
  const learningQuery = useLearningGoals();
  const tasks = tasksQuery.data || [];
  const applications = applicationsQuery.data || [];
  const projects = projectsQuery.data || [];
  const goals = learningQuery.data || [];
  const queries = [tasksQuery, applicationsQuery, projectsQuery, learningQuery];
  const failedQuery = queries.find((query) => query.isError);
  const isLoading = queries.some((query) => query.isLoading);

  const taskStatusData = useMemo(() => [
    { name: 'To do', value: tasks.filter((task) => task.status === 'todo').length },
    { name: 'In progress', value: tasks.filter((task) => task.status === 'in_progress').length },
    { name: 'Completed', value: tasks.filter((task) => task.status === 'completed').length },
  ].filter((entry) => entry.value > 0), [tasks]);

  const applicationData = useMemo(() => {
    const statuses = [
      ['Interested', 'interested'],
      ['Applied', 'applied'],
      ['Assessment', 'assessment'],
      ['Interview', 'interview'],
      ['HR round', 'hr_round'],
      ['Offered', 'offered'],
      ['Rejected', 'rejected'],
      ['Withdrawn', 'withdrawn'],
    ];
    return statuses.map(([name, status]) => ({
      name,
      count: applications.filter((application) => application.status === status).length,
    }));
  }, [applications]);

  const weeklyCompletion = useMemo(() => {
    const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 8 }, (_, index) => {
      const week = subWeeks(currentWeek, 7 - index);
      const nextWeek = subWeeks(currentWeek, 6 - index);
      const completed = tasks.filter((task) => {
        if (task.status !== 'completed' || !task.completedAt) return false;
        const completedAt = new Date(task.completedAt);
        return completedAt >= week && completedAt < nextWeek;
      }).length;
      return { week: format(week, 'MMM d'), completed };
    });
  }, [tasks]);

  const learningData = useMemo(() => goals
    .map((goal) => ({ name: goal.skill, progress: goal.progress || 0 }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 7), [goals]);

  const averageProgress = goals.length
    ? Math.round(goals.reduce((total, goal) => total + (goal.progress || 0), 0) / goals.length)
    : 0;
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const taskCompletionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const activeProjects = projects.filter((project) => project.status === 'active').length;

  if (failedQuery) {
    return (
      <ErrorState
        title="Analytics data could not be loaded"
        description={failedQuery.error?.message}
        onRetry={() => Promise.all(queries.map((query) => query.refetch()))}
      />
    );
  }
  if (isLoading) return <p className="text-sm text-muted-foreground">Preparing your analytics…</p>;

  return (
    <div>
      <PageHeader
        title="Analytics"
        breadcrumbs={[{ label: 'Analytics' }]}
        description="A data-driven view of your tasks, applications, projects, and learning progress."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Task completion" value={`${taskCompletionRate}%`} note={`${completedTasks} of ${tasks.length} tasks complete`} icon={CheckCircle2} />
        <StatCard title="Application pipeline" value={applications.length} note={`${applications.filter((application) => ['interview', 'hr_round', 'assessment'].includes(application.status)).length} in interview stages`} icon={Briefcase} />
        <StatCard title="Active projects" value={activeProjects} note={`${projects.length} projects tracked`} icon={Activity} />
        <StatCard title="Learning progress" value={`${averageProgress}%`} note={`Across ${goals.length} learning roadmaps`} icon={GraduationCap} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <ChartCard title="Task status" description="Current distribution of tasks by workflow status.">
          {taskStatusData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={taskStatusData} dataKey="value" nameKey="name" cx="50%" cy="48%" outerRadius={82} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {taskStatusData.map((entry, index) => <Cell key={entry.name} fill={chartColors[index]} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend verticalAlign="bottom" height={28} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="flex h-full items-center justify-center text-sm text-muted-foreground">No task data to chart yet.</p>}
        </ChartCard>

        <ChartCard title="Application pipeline" description="Applications grouped by their current stage.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={applicationData} margin={{ top: 8, right: 12, bottom: 8, left: -18 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={55} />
              <YAxis allowDecimals={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="count" name="Applications" fill={chartColors[0]} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly task completions" description="Completed tasks by the date they were marked done.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyCompletion} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="completed" name="Completed" fill={chartColors[2]} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Learning roadmap progress" description="Lesson completion percentage for your most active skills.">
          {learningData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={learningData} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 16 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value}%`, 'Progress']} />
                <Bar dataKey="progress" name="Progress" fill={chartColors[1]} radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="flex h-full items-center justify-center text-sm text-muted-foreground">Add a learning goal to chart progress.</p>}
        </ChartCard>
      </div>
      <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><ListTodo className="h-4 w-4" />Charts update from your saved workspace data.</p>
    </div>
  );
}
