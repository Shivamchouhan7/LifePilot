import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '../services/applicationService';

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.all });
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => applicationService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.detail(data.id) });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => applicationService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.all });
    },
  });
}
