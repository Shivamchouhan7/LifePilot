import { APPLICATION_STATUSES } from '../constants/status';

const FINAL_STATUSES = new Set(['offered', 'rejected', 'withdrawn']);
const REACHED_APPLIED = new Set(Object.keys(APPLICATION_STATUSES).filter((status) => status !== 'interested'));
const PAST_APPLIED = new Set([...REACHED_APPLIED].filter((status) => status !== 'applied'));
const SORT_FIELDS = new Set(['company', 'jobTitle', 'status', 'appliedDate', 'interviewAt', 'followUpDate']);

function valueForSort(application, field) {
  const value = application[field];
  if (!value) return null;
  if (['appliedDate', 'interviewAt', 'followUpDate'].includes(field)) {
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? null : time;
  }
  if (field === 'status') return APPLICATION_STATUSES[value]?.label || value;
  return String(value).toLocaleLowerCase();
}

export function filterAndSortApplications(applications, params) {
  const query = (params.get('q') || '').trim().toLocaleLowerCase();
  const company = params.get('company') || '';
  const status = params.get('status') || '';
  const jobType = params.get('jobType') || '';
  const source = params.get('source') || '';
  const requestedSort = params.get('sort') || 'appliedDate';
  const sort = SORT_FIELDS.has(requestedSort) ? requestedSort : 'appliedDate';
  const direction = params.get('direction') === 'asc' ? 'asc' : 'desc';

  const filtered = applications.filter((application) => {
    if (company && application.company !== company) return false;
    if (status && application.status !== status) return false;
    if (jobType && application.jobType !== jobType) return false;
    if (source && application.source !== source) return false;
    if (!query) return true;

    const searchable = [
      application.company,
      application.jobTitle,
      application.source,
      application.location,
      application.recruiterName,
      ...(application.skills || []),
    ];
    return searchable.some((value) => String(value || '').toLocaleLowerCase().includes(query));
  });

  return filtered.sort((left, right) => {
    const leftValue = valueForSort(left, sort);
    const rightValue = valueForSort(right, sort);
    if (leftValue == null || rightValue == null) {
      if (leftValue == null && rightValue == null) return 0;
      return leftValue == null ? 1 : -1;
    }
    const result = leftValue < rightValue ? -1 : leftValue > rightValue ? 1 : 0;
    return direction === 'desc' ? -result : result;
  });
}

export function getApplicationCounts(applications) {
  return Object.keys(APPLICATION_STATUSES).reduce((counts, status) => {
    counts[status] = applications.filter((application) => application.status === status).length;
    return counts;
  }, {});
}

export function getApplicationStats(applications) {
  const reachedApplied = applications.filter((application) => REACHED_APPLIED.has(application.status)).length;
  const pastApplied = applications.filter((application) => PAST_APPLIED.has(application.status)).length;

  return {
    total: applications.length,
    active: applications.filter((application) => !FINAL_STATUSES.has(application.status)).length,
    interviews: applications.filter((application) => ['interview', 'hr_round'].includes(application.status)).length,
    offers: applications.filter((application) => application.status === 'offered').length,
    rejected: applications.filter((application) => application.status === 'rejected').length,
    responseRate: reachedApplied ? Math.round((pastApplied / reachedApplied) * 100) : 0,
  };
}

export function getApplicationFilterOptions(applications, field) {
  return [...new Set(applications.map((application) => application[field]).filter(Boolean))]
    .sort((left, right) => String(left).localeCompare(String(right)));
}
