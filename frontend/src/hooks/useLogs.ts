import { useQuery } from '@tanstack/react-query';
import { gameApi } from '../api/game';

export function useLogs(lineNum: number = 200, enabled: boolean = true) {
  return useQuery({
    queryKey: ['logs', lineNum],
    queryFn: () => gameApi.getLogs(lineNum),
    refetchInterval: enabled ? 4000 : false,
  });
}
