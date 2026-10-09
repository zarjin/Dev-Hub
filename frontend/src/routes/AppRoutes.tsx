import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages
import { HomePage } from '../pages/Home/HomePage';
import { LoginPage } from '../pages/Login/LoginPage';
import { RegisterPage } from '../pages/Register/RegisterPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { OrganizationsListPage } from '../pages/Organization/OrganizationsListPage';
import { OrganizationDetailsPage } from '../pages/Organization/OrganizationDetailsPage';
import { OrganizationTeamsPage } from '../pages/Organization/OrganizationTeamsPage';
import { TeamDetailsPage } from '../pages/Team/TeamDetailsPage';
import { TeamTasksPage } from '../pages/Team/TeamTasksPage';
import { TaskDetailsPage } from '../pages/Tasks/TaskDetailsPage';
import { NotificationsPage } from '../pages/Notifications/NotificationsPage';
import { ProfilePage } from '../pages/Profile/ProfilePage';
import { SettingsPage } from '../pages/Settings/SettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Application Pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/organizations" element={<OrganizationsListPage />} />
          <Route
            path="/organizations/:organizationId"
            element={<OrganizationDetailsPage />}
          />
          <Route
            path="/organizations/:organizationId/teams"
            element={<OrganizationTeamsPage />}
          />
          <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
          <Route path="/teams/:teamId/tasks" element={<TeamTasksPage />} />
          <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
