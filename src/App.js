import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import UserDashboard from './components/User/UserDashboard';
import ProviderDashboard from './components/Provider/ProviderDashboard';
import ProviderList from './components/User/ProviderList';
import BookAppointment from './components/User/BookAppointment';
import UserAppointments from './components/User/UserAppointments';
import ProviderAppointments from './components/Provider/ProviderAppointments';
import ProviderProfile from './components/Provider/ProviderProfile';
import Loading from './components/Common/Loading';

import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}-dashboard`} />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role}-dashboard`} />} />
        
        {/* Protected User Routes */}
        <Route path="/user-dashboard" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/providers" element={
          <ProtectedRoute allowedRoles={['user']}>
            <ProviderList />
          </ProtectedRoute>
        } />
        <Route path="/book-appointment/:providerId" element={
          <ProtectedRoute allowedRoles={['user']}>
            <BookAppointment />
          </ProtectedRoute>
        } />
        <Route path="/my-appointments" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserAppointments />
          </ProtectedRoute>
        } />

        {/* Protected Provider Routes */}
        <Route path="/provider-dashboard" element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderDashboard />
          </ProtectedRoute>
        } />
        <Route path="/provider-appointments" element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderAppointments />
          </ProtectedRoute>
        } />
        <Route path="/provider-profile" element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderProfile />
          </ProtectedRoute>
        } />

        {/* Default Route */}
        <Route path="/" element={
          user ? (
            <Navigate to={`/${user.role}-dashboard`} />
          ) : (
            <Navigate to="/login" />
          )
        } />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
