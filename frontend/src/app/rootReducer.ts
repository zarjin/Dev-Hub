import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import organizationReducer from '../features/organizations/organizationSlice';
import teamReducer from '../features/teams/teamSlice';
import taskReducer from '../features/tasks/taskSlice';
import notificationReducer from '../features/notifications/notificationSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  organization: organizationReducer,
  team: teamReducer,
  task: taskReducer,
  notification: notificationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
