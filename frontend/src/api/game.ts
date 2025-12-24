import { apiClient } from './client';
import type {
  ServerStatus,
  ServerConfig,
  ServerInfo,
  LogsResponse,
  BackupsResponse,
} from './types';

export const gameApi = {
  getStatus: () => apiClient<ServerStatus>('/game/status'),

  start: () => apiClient<{ status: string; message: string }>('/game/start'),

  stop: () => apiClient<{ message: string }>('/game/stop'),

  getConfig: () => apiClient<ServerConfig>('/game/config'),

  saveConfig: (config: string) =>
    apiClient<{ message: string }>('/game/config', {
      method: 'POST',
      body: JSON.stringify({ config }),
    }),

  getConfigStructured: () => apiClient<ServerInfo>('/config/structured'),

  updateConfigStructured: (config: Partial<ServerInfo>) =>
    apiClient<ServerInfo>('/config/structured', {
      method: 'PATCH',
      body: JSON.stringify(config),
    }),

  sendCommand: (cmd: string) =>
    apiClient<{ message: string }>('/game/cmd', {
      method: 'POST',
      body: JSON.stringify({ cmd }),
    }),

  getLogs: (lineNum: number = 200) =>
    apiClient<LogsResponse>(`/game/log?lineNum=${lineNum}`),

  getBackups: () => apiClient<BackupsResponse>('/game/backup'),

  restoreBackup: (backupFilePath: string) =>
    apiClient<{ message: string }>(
      `/game/backup/restore?backupFilePath=${encodeURIComponent(backupFilePath)}`
    ),

  deleteBackup: (backupFilePath: string) =>
    apiClient<{ message: string }>(
      `/game/backup?backupFilePath=${encodeURIComponent(backupFilePath)}`,
      { method: 'DELETE' }
    ),
};
