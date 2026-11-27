// src/components/applications/ListView.jsx
import React from 'react';
import { format, isValid } from 'date-fns';
import { Link } from 'react-router-dom';
import { JOB_TYPES } from '../../constants/jobTypes';
import { ApplicationStatusControl } from './ApplicationStatusControl';

const columns = [
  ['company', 'Company'],
  ['jobTitle', 'Role'],
  ['status', 'Status'],
  ['appliedDate', 'Applied'],
  ['interviewAt', 'Interview'],
  ['followUpDate', 'Follow-up'],
];

function formatDate(value, withTime = false) {
  if (!value) return '—';
  const date = new Date(value);
  return isValid(date) ? format(date, withTime ? 'MMM d, h:mm a' : 'MMM d, yyyy') : 'Unavailable';
}

export function ListView({ applications, sort, direction, onSort, onEdit, onStatusChange, isUpdating }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[900px] border-collapse text-left text-sm">
        <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {columns.map(([field, label]) => (
              <th key={field} scope="col" className="px-4 py-3 font-semibold">
                <button type="button" className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => onSort(field)}>
                  {label}
                  {sort === field && <span aria-label={direction === 'asc' ? 'ascending' : 'descending'}>{direction === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
            ))}
            <th scope="col" className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {applications.map((application) => (
            <tr key={application.id} className="align-middle hover:bg-muted/20">
              <td className="max-w-52 px-4 py-3">
                <Link to={`/applications/${application.id}`} className="font-medium text-primary hover:underline">{application.company}</Link>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{application.source || 'Source not set'}</p>
              </td>
              <td className="max-w-64 px-4 py-3">
                <Link to={`/applications/${application.id}`} className="block truncate hover:text-primary">{application.jobTitle}</Link>
                <span className="text-xs text-muted-foreground">{JOB_TYPES[application.jobType]?.label}</span>
              </td>
              <td className="px-4 py-3">
                <ApplicationStatusControl application={application} onChange={(status) => onStatusChange(application.id, status)} isUpdating={isUpdating} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(application.appliedDate)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(application.interviewAt, true)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(application.followUpDate)}</td>
              <td className="px-4 py-3">
                <button type="button" className="rounded px-2 py-1 text-primary hover:bg-primary/10" onClick={() => onEdit(application)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
          {!applications.length && (
            <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={7}>No applications match these filters.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
