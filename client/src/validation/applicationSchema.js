import { startOfDay } from 'date-fns';
import { z } from 'zod';
import { JOB_TYPES } from '../constants/jobTypes';
import { APPLICATION_STATUSES } from '../constants/status';

function isValidDate(value) {
  return !value || !Number.isNaN(new Date(value).getTime());
}

function isValidUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export const applicationSchema = z.object({
  company: z.string().trim().min(1, 'Enter a company name.').max(150, 'Use 150 characters or fewer.'),
  jobTitle: z.string().trim().min(1, 'Enter a job title.').max(150, 'Use 150 characters or fewer.'),
  jobType: z.enum(Object.keys(JOB_TYPES)),
  source: z.string().trim().min(1, 'Enter where you found this role.').max(100, 'Use 100 characters or fewer.'),
  url: z.string().trim().refine(isValidUrl, 'Enter a valid HTTP or HTTPS URL.'),
  appliedDate: z.string().min(1, 'Choose the application date.').refine(isValidDate, 'Enter a valid application date.'),
  status: z.string().refine(
    (status) => Object.prototype.hasOwnProperty.call(APPLICATION_STATUSES, status),
    'Choose a valid application status.'
  ),
  recruiterName: z.string().max(100, 'Use 100 characters or fewer.'),
  recruiterEmail: z.string().trim().refine((value) => !value || z.string().email().safeParse(value).success, 'Enter a valid email address.'),
  description: z.string().max(5000, 'Use 5000 characters or fewer.'),
  skills: z.array(z.string().trim().min(1)).max(20, 'Use 20 skills or fewer.'),
  salary: z.string().max(150, 'Use 150 characters or fewer.'),
  location: z.string().max(150, 'Use 150 characters or fewer.'),
  followUpDate: z.string().refine(isValidDate, 'Enter a valid follow-up date.'),
  interviewAt: z.string().refine(isValidDate, 'Enter a valid interview date and time.'),
  assessmentAt: z.string().refine(isValidDate, 'Enter a valid assessment date and time.'),
  notes: z.string().max(5000, 'Use 5000 characters or fewer.'),
}).superRefine((application, context) => {
  if (['interview', 'hr_round'].includes(application.status) && !application.interviewAt) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['interviewAt'],
      message: 'An interview date and time are required for this status.',
    });
  }

  const appliedDate = application.appliedDate ? startOfDay(new Date(`${application.appliedDate}T00:00`)) : null;
  for (const field of ['interviewAt', 'assessmentAt']) {
    const value = application[field];
    if (appliedDate && value && startOfDay(new Date(value)) < appliedDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [field],
        message: 'This date cannot be before the application date.',
      });
    }
  }
});
