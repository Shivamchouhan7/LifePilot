import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { learningService } from '../services/learningService';

export const LEARNING_KEYS = {
  all: ['learning'],
  lists: () => [...LEARNING_KEYS.all, 'list'],
  list: (params) => [...LEARNING_KEYS.lists(), params],
  details: () => [...LEARNING_KEYS.all, 'detail'],
  detail: (id) => [...LEARNING_KEYS.details(), id],
};

export function useLearningGoals(params) {
  return useQuery({
    queryKey: LEARNING_KEYS.list(params),
    queryFn: () => learningService.getAll(params),
  });
}

export function useLearningGoal(id) {
  return useQuery({
    queryKey: LEARNING_KEYS.detail(id),
    queryFn: () => learningService.getById(id),
    enabled: !!id,
  });
}

export function useCreateLearningGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => learningService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEARNING_KEYS.all });
    },
  });
}

export function useUpdateLearningGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => learningService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: LEARNING_KEYS.all });
      queryClient.invalidateQueries({ queryKey: LEARNING_KEYS.detail(data.id) });
    },
  });
}

export function useDeleteLearningGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => learningService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEARNING_KEYS.all });
    },
  });
}
