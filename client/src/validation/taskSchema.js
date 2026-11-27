import { z } from 'zod';

const reminderMinutesSchema = z.preprocess(
  (value) => (value === '' || value == null ? undefined : Number(value)),
  z.number().int().min(0, 'Reminder must be zero or more minutes.').optional()
);

export const taskSchema = z.object({
  title: z.string().trim().min(1, 'Enter a task title.').max(120, 'Use 120 characters or fewer.'),
  description: z.string().max(2000, 'Use 2000 characters or fewer.'),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.enum(['todo', 'in_progress', 'completed']),
  dueAt: z.string().refine(
    (value) => !value || !Number.isNaN(new Date(value).getTime()),
    'Enter a valid date and time.'
  ),
  category: z.string(),
  tags: z.array(z.string().trim().min(1)).max(10, 'Use 10 tags or fewer.'),
  recurring: z.enum(['none', 'daily', 'weekly', 'monthly']),
  reminderMinutes: reminderMinutesSchema,
}).superRefine((task, context) => {
  if (task.recurring !== 'none' && !task.dueAt) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['dueAt'],
      message: 'A due date and time are required for recurring tasks.',
    });
  }
});
