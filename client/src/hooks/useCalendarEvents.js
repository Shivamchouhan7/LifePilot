import { useQuery } from '@tanstack/react-query';
import { calendarService } from '../services/calendarService';

export const CALENDAR_KEYS = {
  all: ['calendar_events'],
  range: (range) => [...CALENDAR_KEYS.all, range],
};

export function useCalendarEvents(range) {
  return useQuery({
    queryKey: CALENDAR_KEYS.range(range),
    queryFn: () => calendarService.getEvents(range),
  });
}
