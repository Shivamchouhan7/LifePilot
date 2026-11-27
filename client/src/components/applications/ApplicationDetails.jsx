import React from 'react';
import { format, isValid } from 'date-fns';
import { ExternalLink, Mail } from 'lucide-react';
import { Badge } from '../ui/badge';

function displayDate(value, withTime = false) {
  if (!value) return '—';
  const date = new Date(value);
  if (!isValid(date)) return 'Date unavailable';
  return format(date, withTime ? 'MMM d, yyyy · h:mm a' : 'MMM d, yyyy');
}

function Detail({ label, children }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm">{children || '—'}</dd>
    </div>
  );
}

export function ApplicationDetails({ application }) {
  return (
    <section className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h2 className="font-semibold">Application details</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Detail label="Job type">{application.jobType?.replace('_', ' ')}</Detail>
          <Detail label="Source">{application.source}</Detail>
          <Detail label="Applied">{displayDate(application.appliedDate)}</Detail>
          <Detail label="Location">{application.location}</Detail>
          <Detail label="Salary / stipend">{application.salary}</Detail>
          <Detail label="Follow-up">{displayDate(application.followUpDate)}</Detail>
          <Detail label="Interview">{displayDate(application.interviewAt, true)}</Detail>
          <Detail label="Assessment">{displayDate(application.assessmentAt, true)}</Detail>
        </dl>
      </div>

      <div className="border-t border-border pt-5">
        <h3 className="text-sm font-semibold">Recruiter</h3>
        <dl className="mt-3 grid gap-4 sm:grid-cols-2">
          <Detail label="Name">{application.recruiterName}</Detail>
          <Detail label="Email">
            {application.recruiterEmail ? (
              <a className="inline-flex items-center gap-1 text-primary hover:underline" href={`mailto:${application.recruiterEmail}`}>
                <Mail className="h-3.5 w-3.5" />{application.recruiterEmail}
              </a>
            ) : '—'}
          </Detail>
        </dl>
      </div>

      {application.url && (
        <a
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          href={application.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View job posting <ExternalLink className="h-4 w-4" />
        </a>
      )}

      <div className="border-t border-border pt-5">
        <h3 className="text-sm font-semibold">Skills</h3>
        {application.skills?.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {application.skills.map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}
          </div>
        ) : <p className="mt-2 text-sm text-muted-foreground">No skills added.</p>}
      </div>

      <div className="border-t border-border pt-5">
        <h3 className="text-sm font-semibold">Job description</h3>
        <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{application.description || 'No description added.'}</p>
      </div>

      <div className="border-t border-border pt-5">
        <h3 className="text-sm font-semibold">Notes</h3>
        <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{application.notes || 'No notes added.'}</p>
      </div>
    </section>
  );
}
