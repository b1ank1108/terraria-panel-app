import { apiClient } from './client';
import type { LoginRequest, LoginResponse } from './types';

export const authApi = {
  // 用户登录
  login: (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};