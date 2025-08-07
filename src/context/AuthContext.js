// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('Initializing auth, token:', token ? 'exists' : 'not found');
      
      if (token) {
        try {
          console.log('Validating existing token...');
          const userData = await authService.getCurrentUser();
          console.log('Token valid, user data:', userData);
          setUser(userData);
        } catch (error) {
          console.error('Token validation failed:', error);
          // Clear invalid token
          localStorage.removeItem('token');
          toast.error('Session expired. Please login again.');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('AuthContext: Attempting login...');
      
      const response = await authService.login(email, password);
      console.log('AuthContext: Login response:', response);
      
      const { token, user: userData } = response;
      
      if (!token || !userData) {
        throw new Error('Invalid response from server');
      }
      
      // Store token and user data
      localStorage.setItem('token', token);
      setUser(userData);
      
      console.log('AuthContext: Login successful, user:', userData);
      toast.success(`Welcome back, ${userData.name}!`);
      
      return userData;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('AuthContext: Attempting registration...');
      
      const response = await authService.register(userData);
      console.log('AuthContext: Registration response:', response);
      
      const { token, user: newUser } = response;
      
      if (!token || !newUser) {
        throw new Error('Invalid response from server');
      }
      
      // Store token and user data
      localStorage.setItem('token', token);
      setUser(newUser);
      
      console.log('AuthContext: Registration successful, user:', newUser);
      toast.success(`Welcome to AppointMed, ${newUser.name}!`);
      
      return newUser;
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out...');
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
