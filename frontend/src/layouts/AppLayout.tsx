import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { AppHeader } from '../components/layout/AppHeader';
import { MobileNav } from '../components/layout/MobileNav';
import { CreateTaskModal } from '../features/tasks/components/CreateTaskModal';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchOrganizations } from '../features/organizations/organizationSlice';
import { fetchTeams } from '../features/teams/teamSlice';
import { fetchUsers } from '../features/users/userSlice';
import { fetchNotifications } from '../features/notifications/notificationSlice';
import { checkAuth } from '../features/auth/authSlice';

export const AppLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(fetchOrganizations());
    dispatch(fetchTeams());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchNotifications(user._id));
    }
  }, [dispatch, user?._id]);

  // Derive breadcrumbs based on pathname
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/dashboard') return [{ label: 'Dashboard' }];
    if (path.startsWith('/organizations')) {
      return [{ label: 'Organizations', path: '/organizations' }];
    }
    if (path.startsWith('/teams')) {
      return [{ label: 'Teams', path: '/teams' }];
    }
    if (path.startsWith('/tasks')) {
      return [{ label: 'Tasks', path: '/tasks' }];
    }
    if (path === '/notifications') return [{ label: 'Notifications' }];
    if (path === '/profile') return [{ label: 'Profile' }];
    if (path === '/settings') return [{ label: 'Settings' }];
    return [{ label: 'DevHub' }];
  };

  return (
    <div className="flex h-screen w-full bg-surface-background text-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar
        className="hidden md:flex flex-shrink-0"
        onOpenCreateTask={() => setCreateTaskModalOpen(true)}
      />

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <Sidebar
            className="relative z-10 w-4/5 max-w-xs h-full"
            onCloseMobile={() => setMobileMenuOpen(false)}
            onOpenCreateTask={() => {
              setMobileMenuOpen(false);
              setCreateTaskModalOpen(true);
            }}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AppHeader
          breadcrumbs={getBreadcrumbs()}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenCreateTask={() => setCreateTaskModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

        {/* Mobile Navigation bar */}
        <MobileNav />
      </div>

      {/* Global Create Task Modal */}
      <CreateTaskModal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
      />
    </div>
  );
};
