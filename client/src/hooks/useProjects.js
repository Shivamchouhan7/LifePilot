import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/projectService';

export const PROJECT_KEYS = {
  all: ['projects'],
  lists: () => [...PROJECT_KEYS.all, 'list'],
  list: (params) => [...PROJECT_KEYS.lists(), params],
  details: () => [...PROJECT_KEYS.all, 'detail'],
  detail: (id) => [...PROJECT_KEYS.details(), id],
};

export function useProjects(params) {
  return useQuery({
    queryKey: PROJECT_KEYS.list(params),
    queryFn: () => projectService.getAll(params),
  });
}

export function useProject(id) {
  return useQuery({
    queryKey: PROJECT_KEYS.detail(id),
    queryFn: () => projectService.getById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => projectService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => projectService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.detail(data.id) });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => projectService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
    },
  });
}
