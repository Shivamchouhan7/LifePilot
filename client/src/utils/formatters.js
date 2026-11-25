import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, isPast, parseISO } from 'date-fns';
import { storage } from './storage';

function getSettings() {
  return storage.get('settings', [])[0] || {};
}

export function formatDate(dateInput, formatStr) {
  if (!dateInput) return '—';
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    return format(date, formatStr || getSettings().dateFormat || 'MMM d, yyyy');
  } catch {
    return '—';
  }
}

export function formatDateTime(dateInput) {
  const settings = getSettings();
  const timeFormat = settings.timeFormat === '24h' ? 'HH:mm' : 'h:mm a';
  return formatDate(dateInput, `${settings.dateFormat || 'MMM d, yyyy'} ${timeFormat}`);
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
