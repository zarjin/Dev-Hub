import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);

  // If token is in localStorage or user is authenticated, allow entry
  const hasToken = token || localStorage.getItem('devhub_token');

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
