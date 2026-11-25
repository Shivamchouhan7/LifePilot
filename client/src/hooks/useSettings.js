import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settingsService';

export const SETTINGS_KEYS = {
  all: ['settings'],
};

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_KEYS.all,
    queryFn: () => settingsService.getAll(),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => settingsService.update('current_settings', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.all });
    },
  });
}
