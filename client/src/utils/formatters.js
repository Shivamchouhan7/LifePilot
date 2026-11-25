import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, isPast, parseISO } from 'date-fns';

export function formatDate(dateInput, formatStr = 'MMM d, yyyy') {
  if (!dateInput) return '—';
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    return format(date, formatStr);
  } catch {
    return '—';
  }
}

export function formatDateTime(dateInput) {
  return formatDate(dateInput, 'MMM d, yyyy h:mm a');
}

export function formatRelativeDate(dateInput) {
  if (!dateInput) return '—';
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return '—';
  }
}

export function isDatePast(dateInput) {
  if (!dateInput) return false;
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    return isPast(date) && !isToday(date);
  } catch {
    return false;
  }
}

export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
