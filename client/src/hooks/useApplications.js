import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { applicationService } from '../services/applicationService';
import { CALENDAR_KEYS } from './useCalendarEvents';

export const APPLICATION_KEYS = {
  all: ['applications'],
  lists: () => [...APPLICATION_KEYS.all, 'list'],
  list: (params) => [...APPLICATION_KEYS.lists(), params],
  details: () => [...APPLICATION_KEYS.all, 'detail'],
  detail: (id) => [...APPLICATION_KEYS.details(), id],
};

export function useApplications(params) {
  return useQuery({
    queryKey: APPLICATION_KEYS.list(params),
    queryFn: () => applicationService.getAll(params),
  });
}

export function useApplication(id) {
  return useQuery({
    queryKey: APPLICATION_KEYS.detail(id),
    queryFn: () => applicationService.getById(id),
    enabled: !!id,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => applicationService.create(payload),
    onSuccess: () => toast.success('Application created.'),
    onError: (error) => toast.error(error.message || 'The application could not be created.'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.all });
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => applicationService.update(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: APPLICATION_KEYS.all });
      const previous = queryClient.getQueriesData({ queryKey: APPLICATION_KEYS.all });
      const { statusNote, ...applicationPayload } = payload;
      queryClient.setQueriesData({ queryKey: APPLICATION_KEYS.all }, (data) => {
        const update = (application) => {
          if (!application || application.id !== id) return application;
          const changedStatus = payload.status && payload.status !== application.status;
          return {
            ...application,
            ...applicationPayload,
            ...(changedStatus ? {
              statusHistory: [
                ...(application.statusHistory || []),
                {
                  status: payload.status,
                  at: new Date().toISOString(),
                  note: statusNote || `Status updated to ${payload.status}`,
                },
              ],
            } : {}),
          };
        };
        return Array.isArray(data) ? data.map(update) : update(data);
      });
      return { previous };
    },
    onError: (error, _variables, context) => {
      context?.previous.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data));
      toast.error(error.message || 'The application could not be updated.');
    },
    onSuccess: () => toast.success('Application updated.'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.all });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => applicationService.remove(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: APPLICATION_KEYS.all });
      const previous = queryClient.getQueriesData({ queryKey: APPLICATION_KEYS.all });
      queryClient.setQueriesData({ queryKey: APPLICATION_KEYS.all }, (data) => {
        if (Array.isArray(data)) return data.filter((application) => application.id !== id);
        return data?.id === id ? undefined : data;
      });
      return { previous };
    },
    onError: (error, _id, context) => {
      context?.previous.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data));
      toast.error(error.message || 'The application could not be deleted.');
    },
    onSuccess: () => toast.success('Application deleted.'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.all });
    },
  });
}
