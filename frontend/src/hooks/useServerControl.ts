import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gameApi } from '../api/game';

export function useStartServer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: gameApi.start,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serverStatus'] });
    },
  });
}

export function useStopServer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: gameApi.stop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serverStatus'] });
    },
  });
}

export function useSendCommand() {
  return useMutation({
    mutationFn: gameApi.sendCommand,
  });
}
