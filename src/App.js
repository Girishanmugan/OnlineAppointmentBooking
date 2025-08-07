// src/App.js - Complete working version
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/Common/ErrorBoundary';
import LoadingSpinner from './components/Common/LoadingSpinner';

// Import components directly (not lazy) for debugging
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import UserDashboard from './components/User/UserDashboard';
import ProviderDashboard from './components/Provider/ProviderDashboard';
import ProviderList from './components/User/ProviderList';
import UserAppointments from './components/User/UserAppointments';
import ProviderAppointments from './components/Provider/ProviderAppointments';
import ProviderProfile from './components/Provider/ProviderProfile';
import UserProfile from './components/User/UserProfile';

function App() {
  const { user, loading } = useAuth();

  console.log('App render - User:', user, 'Loading:', loading);

  if (loading) {
    return (
      <div className="app-loading">
        <LoadingSpinner size="lg" />
        <p>Loading AppointMed...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <Routes>
          {/* Debug Route */}
          <Route path="/debug" element={
            <div style={{ padding: '2rem' }}>
              <h1>Debug Info</h1>
              <p>User: {JSON.stringify(user)}</p>
              <p>Loading: {loading.toString()}</p>
              <p>Current URL: {window.location.pathname}</p>
            </div>
          } />

          {/* Public Routes */}
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to={user.role === 'provider' ? '/provider-dashboard' : '/user-dashboard'} replace />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to={user.role === 'provider' ? '/provider-dashboard' : '/user-dashboard'} replace />} 
          />

          {/* User Routes */}
          <Route 
            path="/user-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/providers" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <ProviderList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointments" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserAppointments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserProfile />
              </ProtectedRoute>
            } 
          />

          {/* Provider Routes */}
          <Route 
            path="/provider-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['provider']}>
                <ProviderDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-appointments" 
            element={
              <ProtectedRoute allowedRoles={['provider']}>
                <ProviderAppointments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-profile" 
            element={
              <ProtectedRoute allowedRoles={['provider']}>
                <ProviderProfile />
              </ProtectedRoute>
            } 
          />

          {/* Default Routes */}
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to={user.role === 'provider' ? '/provider-dashboard' : '/user-dashboard'} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* 404 Catch All */}
          <Route path="*" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h1>404 - Page Not Found</h1>
              <p>Current path: {window.location.pathname}</p>
              <p>User role: {user?.role}</p>
              <button onClick={() => window.location.href = '/'}>Go Home</button>
            </div>
          } />
        </Routes>

        <Toaster position="top-right" />
      </div>
    </ErrorBoundary>
  );
}

export default App;
