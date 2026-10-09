import apiClient from '../../services/axios';
import { LoginDto, RegisterDto, AuthResponse } from './auth.types';
import { mockStorage } from '../../services/mockStorage';

export const authApi = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch {
      // Mock fallback
      const users = mockStorage.getUsers();
      const user = users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase()) || users[0];
      const token = `devhub_mock_jwt_${user._id}`;
      localStorage.setItem('devhub_token', token);
      return { user, token };
    }
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch {
      const newUser = {
        _id: `user-${Date.now()}`,
        name: data.name,
        username: data.username,
        email: data.email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const token = `devhub_mock_jwt_${newUser._id}`;
      localStorage.setItem('devhub_token', token);
      return { user: newUser, token };
    }
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const response = await apiClient.get<AuthResponse>('/auth/me');
      return response.data;
    } catch {
      // Default to Zarjin (Lead) for seamless preview
      const users = mockStorage.getUsers();
      const user = users[0];
      const token = `devhub_mock_jwt_${user._id}`;
      return { user, token };
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('devhub_token');
    }
  },
};
