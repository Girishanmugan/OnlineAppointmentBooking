// src/components/Auth/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../Common/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute:', {
    user,
    loading,
    allowedRoles,
    currentPath: location.pathname,
    userRole: user?.role
  });

  if (loading) {
    return <LoadingSpinner size="lg" message="Authenticating..." />;
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('User role not allowed:', user.role, 'Allowed:', allowedRoles);
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute: Access granted');
  return children;
};

export default ProtectedRoute;
