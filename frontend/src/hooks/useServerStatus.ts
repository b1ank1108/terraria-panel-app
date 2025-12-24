import { useQuery } from '@tanstack/react-query';
import { gameApi } from '../api/game';

export function useServerStatus() {
  return useQuery({
    queryKey: ['serverStatus'],
    queryFn: gameApi.getStatus,
    refetchInterval: 3000,
  });
}
