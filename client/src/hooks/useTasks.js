import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { toast } from 'sonner';

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
      toast.success('Task created.');
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
    onError: (error) => toast.error(`Task could not be created: ${error.message}`),
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => taskService.update(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: TASK_KEYS.all });
      const lists = queryClient.getQueriesData({ queryKey: TASK_KEYS.lists() });
      const detail = queryClient.getQueryData(TASK_KEYS.detail(id));
      queryClient.setQueriesData({ queryKey: TASK_KEYS.lists() }, (items) => (
        Array.isArray(items) ? items.map((task) => task.id === id ? { ...task, ...payload } : task) : items
      ));
      queryClient.setQueryData(TASK_KEYS.detail(id), (task) => task ? { ...task, ...payload } : task);
      return { lists, detail, id };
    },
    onError: (error, _variables, context) => {
      context?.lists?.forEach(([key, value]) => queryClient.setQueryData(key, value));
      if (context) queryClient.setQueryData(TASK_KEYS.detail(context.id), context.detail);
      toast.error(`Task could not be updated: ${error.message}`);
    },
    onSuccess: () => {
      toast.success('Task updated.');
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => taskService.remove(id),
    onSuccess: () => {
      toast.success('Task deleted.');
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
    onError: (error) => toast.error(`Task could not be deleted: ${error.message}`),
  });
}
