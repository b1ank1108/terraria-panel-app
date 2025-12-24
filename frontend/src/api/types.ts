export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  meta: {
    timestamp: string;
    version: string;
  };
}

export interface ServerInfo {
  port: number;
  maxPlayers: number;
  worldName: string;
  worldSize: 'small' | 'medium' | 'large' | '';
  difficulty: 'classic' | 'expert' | 'master' | 'journey' | '';
  worldPath: string;
  seed: string;
  password: string;
  motd: string;
  language: string;
  secure: boolean;
  upnp: boolean;
  priority: number;
  npcstream: number;
  worldRollbacksToKeep: number;
}

export interface ServerStatus {
  running: boolean;
  status: string;
  info?: ServerInfo;
}

export interface ServerConfig {
  config: string;
}

export interface LogsResponse {
  logs: string[];
  count: number;
}

export interface BackupInfo {
  name: string;
  path: string;
  size: number;
  modTime: string;
}

export interface BackupsResponse {
  backups: BackupInfo[];
  count: number;
}

export class ApiError extends Error {
  code: string;
  details?: string;

  constructor(code: string, message: string, details?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}
