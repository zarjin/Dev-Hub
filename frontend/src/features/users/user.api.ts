import apiClient from '../../services/axios';
import { User, UpdateUserProfileDto } from './user.types';
import { mockStorage } from '../../services/mockStorage';

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get<User[]>('/users');
      return response.data;
    } catch {
      return mockStorage.getUsers();
    }
  },

  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await apiClient.get<User>(`/users/${id}`);
      return response.data;
    } catch {
      const user = mockStorage.getUserById(id);
      if (!user) throw new Error('User not found');
      return user;
    }
  },

  updateProfile: async (id: string, updates: UpdateUserProfileDto): Promise<User> => {
    try {
      const response = await apiClient.patch<User>(`/users/${id}`, updates);
      return response.data;
    } catch {
      return mockStorage.updateUser(id, updates);
    }
  },
};
