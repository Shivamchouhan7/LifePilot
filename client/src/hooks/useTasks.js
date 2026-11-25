import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';

export const TASK_KEYS = {
  all: ['tasks'],
  lists: () => [...TASK_KEYS.all, 'list'],
  list: (params) => [...TASK_KEYS.lists(), params],
  details: () => [...TASK_KEYS.all, 'detail'],
  detail: (id) => [...TASK_KEYS.details(), id],
};

export function useTasks(params) {
  return useQuery({
    queryKey: TASK_KEYS.list(params),
    queryFn: () => taskService.getAll(params),
  });
}

export function useTask(id) {
  return useQuery({
    queryKey: TASK_KEYS.detail(id),
    queryFn: () => taskService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => taskService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => taskService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.detail(data.id) });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => taskService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
  });
}
