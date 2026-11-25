// src/hooks/useTasks.jsx
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';

export function useTasks() {
  const queryClient = useQueryClient();
  const { data: tasks = [], isLoading, error, refetch } = useQuery(['tasks'], () => taskService.getAll());

  const create = async (payload) => {
    await taskService.create(payload);
    queryClient.invalidateQueries(['tasks']);
  };

  const update = async (id, payload) => {
    await taskService.update(id, payload);
    queryClient.invalidateQueries(['tasks']);
  };

  const remove = async (id) => {
    await taskService.remove(id);
    queryClient.invalidateQueries(['tasks']);
  };

  return { tasks, isLoading, error, refetch, create, update, remove };
}
