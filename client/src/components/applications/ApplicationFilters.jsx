import React from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { APPLICATION_STATUSES } from '../../constants/status';
import { getApplicationFilterOptions } from '../../utils/applicationFilters';

const fieldClass = 'h-10 min-w-0 rounded-lg border border-input bg-background px-3 text-sm text-foreground';

export function ApplicationFilters({ applications }) {
  const [params, setParams] = useSearchParams();
  const companies = getApplicationFilterOptions(applications, 'company');
  const sources = getApplicationFilterOptions(applications, 'source');
  const jobTypes = getApplicationFilterOptions(applications, 'jobType');

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(params);
    ['q', 'company', 'status', 'jobType', 'source'].forEach((key) => next.delete(key));
    setParams(next, { replace: true });
  };
  const hasFilters = ['q', 'company', 'status', 'jobType', 'source'].some((key) => params.has(key));

  return (
    <section className="space-y-3" aria-label="Filter applications">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          className={`${fieldClass} w-full pl-9`}
          type="search"
          value={params.get('q') || ''}
          onChange={(event) => update('q', event.target.value)}
          placeholder="Search company, role, skills, recruiter..."
          aria-label="Search applications"
        />
      </label>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <select className={fieldClass} value={params.get('company') || ''} onChange={(event) => update('company', event.target.value)} aria-label="Filter by company">
          <option value="">All companies</option>
          {companies.map((company) => <option key={company} value={company}>{company}</option>)}
        </select>
        <select className={fieldClass} value={params.get('status') || ''} onChange={(event) => update('status', event.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {Object.entries(APPLICATION_STATUSES).map(([status, config]) => <option key={status} value={status}>{config.label}</option>)}
        </select>
        <select className={fieldClass} value={params.get('jobType') || ''} onChange={(event) => update('jobType', event.target.value)} aria-label="Filter by job type">
          <option value="">All job types</option>
          {jobTypes.map((jobType) => <option key={jobType} value={jobType}>{jobType.replace('_', ' ')}</option>)}
        </select>
        <select className={fieldClass} value={params.get('source') || ''} onChange={(event) => update('source', event.target.value)} aria-label="Filter by source">
          <option value="">All sources</option>
          {sources.map((source) => <option key={source} value={source}>{source}</option>)}
        </select>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          onClick={clearFilters}
          disabled={!hasFilters}
        >
          <RotateCcw className="h-4 w-4" />
          Clear filters
        </button>
      </div>
    </section>
  );
}
