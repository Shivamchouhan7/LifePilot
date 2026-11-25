import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => calendarService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.all }),
  });
}

export function useUpdateCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => calendarService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.all }),
  });
}

export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => calendarService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.all }),
  });
}
