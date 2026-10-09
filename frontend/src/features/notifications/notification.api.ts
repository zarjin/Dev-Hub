import apiClient from '../../services/axios';
import { Notification } from './notification.types';
import { mockStorage } from '../../services/mockStorage';

export const notificationApi = {
  getNotifications: async (userId: string): Promise<Notification[]> => {
    try {
      const response = await apiClient.get<Notification[]>('/notifications', {
        params: { userId },
      });
      return response.data;
    } catch {
      return mockStorage.getNotifications(userId);
    }
  },

  markAsRead: async (id: string): Promise<Notification> => {
    try {
      const response = await apiClient.patch<Notification>(`/notifications/${id}/read`);
      return response.data;
    } catch {
      return mockStorage.markNotificationRead(id);
    }
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    try {
      await apiClient.post('/notifications/read-all', { userId });
    } catch {
      mockStorage.markAllNotificationsRead(userId);
    }
  },
};
