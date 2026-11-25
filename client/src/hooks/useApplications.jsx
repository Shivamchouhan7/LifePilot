// src/hooks/useApplications.jsx
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '../services/applicationService';

export function useApplications() {
  const queryClient = useQueryClient();
  const { data: applications = [], isLoading, error, refetch } = useQuery(['applications'], () => applicationService.getAll());

  const create = async (payload) => {
    await applicationService.create(payload);
    queryClient.invalidateQueries(['applications']);
  };

  const update = async (id, payload) => {
    await applicationService.update(id, payload);
    queryClient.invalidateQueries(['applications']);
  };

  const remove = async (id) => {
    await applicationService.remove(id);
    queryClient.invalidateQueries(['applications']);
  };

  return { applications, isLoading, error, refetch, create, update, remove };
}
