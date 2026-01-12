import type { ApiResponse } from './types';
import { ApiError } from './types';

export async function apiClient<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  // 获取存储的 Token
  const token = localStorage.getItem('auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...init?.headers as Record<string, string>,
  };

  // 如果有 Token 且不是登录接口，添加 Authorization 头
  if (token && !path.includes('/login')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${path}`, {
    headers,
    ...init,
  });

  const json: ApiResponse<T> = await response.json();

  if (json.status === 'error' && json.error) {
    throw new ApiError(json.error.code, json.error.message, json.error.details);
  }

  return json.data as T;
}
