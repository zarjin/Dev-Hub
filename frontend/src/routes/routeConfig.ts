export interface RouteItem {
  path: string;
  title: string;
  isProtected?: boolean;
}

export const APP_ROUTES_CONFIG: RouteItem[] = [
  { path: '/', title: 'DevHub - Platform', isProtected: false },
  { path: '/login', title: 'Sign In', isProtected: false },
  { path: '/register', title: 'Create Account', isProtected: false },
  { path: '/dashboard', title: 'Engineering Dashboard', isProtected: true },
  { path: '/organizations', title: 'Organizations', isProtected: true },
  { path: '/organizations/:organizationId', title: 'Organization Overview', isProtected: true },
  { path: '/organizations/:organizationId/teams', title: 'Organization Teams', isProtected: true },
  { path: '/teams/:teamId', title: 'Team Hub', isProtected: true },
  { path: '/teams/:teamId/tasks', title: 'Task Board', isProtected: true },
  { path: '/tasks/:taskId', title: 'Task Details', isProtected: true },
  { path: '/notifications', title: 'Notification Center', isProtected: true },
  { path: '/profile', title: 'User Profile', isProtected: true },
  { path: '/settings', title: 'Settings', isProtected: true },
];
