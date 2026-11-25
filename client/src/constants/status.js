export const TASK_PRIORITIES = {
  high: { label: 'High', color: 'text-danger bg-danger/10 border-danger/20' },
  medium: { label: 'Medium', color: 'text-warning bg-warning/10 border-warning/20' },
  low: { label: 'Low', color: 'text-success bg-success/10 border-success/20' },
};

export const TASK_STATUSES = {
  todo: { label: 'To Do', color: 'text-muted-foreground bg-muted border-border' },
  in_progress: { label: 'In Progress', color: 'text-primary bg-primary/10 border-primary/20' },
  completed: { label: 'Completed', color: 'text-success bg-success/10 border-success/20' },
};

export const APPLICATION_STATUSES = {
  interested: { label: 'Interested', color: 'text-muted-foreground bg-muted border-border' },
  applied: { label: 'Applied', color: 'text-primary bg-primary/10 border-primary/20' },
  assessment: { label: 'Assessment', color: 'text-warning bg-warning/10 border-warning/20' },
  interview: { label: 'Interview', color: 'text-secondary bg-secondary/10 border-secondary/20' },
  hr_round: { label: 'HR Round', color: 'text-secondary bg-secondary/10 border-secondary/20' },
  offered: { label: 'Offered', color: 'text-success bg-success/10 border-success/20' },
  rejected: { label: 'Rejected', color: 'text-danger bg-danger/10 border-danger/20' },
  withdrawn: { label: 'Withdrawn', color: 'text-muted-foreground bg-muted border-border' },
};

export const PROJECT_STATUSES = {
  planning: { label: 'Planning', color: 'text-muted-foreground bg-muted border-border' },
  active: { label: 'Active', color: 'text-primary bg-primary/10 border-primary/20' },
  paused: { label: 'Paused', color: 'text-warning bg-warning/10 border-warning/20' },
  completed: { label: 'Completed', color: 'text-success bg-success/10 border-success/20' },
};
