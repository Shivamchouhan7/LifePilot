import { addDays, addMonths, addWeeks } from 'date-fns';

export function getNextDueDate(dueAt, recurring) {
  if (!dueAt || !recurring || recurring === 'none') return null;

  const date = new Date(dueAt);
  if (Number.isNaN(date.getTime())) return null;

  const nextDate = {
    daily: addDays,
    weekly: addWeeks,
    monthly: addMonths,
  }[recurring]?.(date, 1);

  return nextDate ? nextDate.toISOString() : null;
}
