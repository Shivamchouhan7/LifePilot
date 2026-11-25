import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noteService } from '../services/noteService';

export const NOTE_KEYS = {
  all: ['notes'],
  lists: () => [...NOTE_KEYS.all, 'list'],
  list: (params) => [...NOTE_KEYS.lists(), params],
  details: () => [...NOTE_KEYS.all, 'detail'],
  detail: (id) => [...NOTE_KEYS.details(), id],
};

export function useNotes(params) {
  return useQuery({
    queryKey: NOTE_KEYS.list(params),
    queryFn: () => noteService.getAll(params),
  });
}

export function useNote(id) {
  return useQuery({
    queryKey: NOTE_KEYS.detail(id),
    queryFn: () => noteService.getById(id),
    enabled: !!id,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => noteService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTE_KEYS.all });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => noteService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: NOTE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: NOTE_KEYS.detail(data.id) });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => noteService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTE_KEYS.all });
    },
  });
}
