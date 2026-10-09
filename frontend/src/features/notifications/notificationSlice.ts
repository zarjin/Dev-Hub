import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Notification } from './notification.types';
import { notificationApi } from './notification.api';

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk<Notification[], string, { rejectValue: string }>(
  'notifications/fetchNotifications',
  async (userId, { rejectWithValue }) => {
    try {
      return await notificationApi.getNotifications(userId);
    } catch (err: unknown) {
      const error = err as { message?: string };
      return rejectWithValue(error.message || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk<
  Notification,
  string,
  { rejectValue: string }
>('notifications/markAsRead', async (id, { rejectWithValue }) => {
  try {
    return await notificationApi.markAsRead(id);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to mark notification as read');
  }
});

export const markAllNotificationsAsRead = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('notifications/markAllAsRead', async (userId, { rejectWithValue }) => {
  try {
    await notificationApi.markAllAsRead(userId);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to mark all as read');
  }
});

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to load notifications';
      })
      // Mark single read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const idx = state.notifications.findIndex((n) => n._id === action.payload._id);
        if (idx !== -1) {
          state.notifications[idx] = action.payload;
          state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
        }
      })
      // Mark all read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.isRead = true;
          n.readAt = new Date().toISOString();
        });
        state.unreadCount = 0;
      });
  },
});

export default notificationSlice.reducer;
