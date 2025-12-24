import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gameApi } from '../api/game';

export function useConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: gameApi.getConfig,
  });
}

export function useSaveConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: gameApi.saveConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
    },
  });
}

export function useConfigStructured() {
  return useQuery({
    queryKey: ['config', 'structured'],
    queryFn: gameApi.getConfigStructured,
  });
}

export function useUpdateConfigStructured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: gameApi.updateConfigStructured,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
      queryClient.invalidateQueries({ queryKey: ['status'] });
    },
  });
}
