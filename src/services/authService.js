// src/services/authService.js
import api from './api';

export const authService = {
  login: async (email, password) => {
    try {
      console.log('AuthService: Sending login request...');
      const response = await api.post('/auth/login', { email, password });
      console.log('AuthService: Login response received:', response);
      return response;
    } catch (error) {
      console.error('AuthService: Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      console.log('AuthService: Sending registration request...');
      const response = await api.post('/auth/register', userData);
      console.log('AuthService: Registration response received:', response);
      return response;
    } catch (error) {
      console.error('AuthService: Registration error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      console.log('AuthService: Getting current user...');
      const response = await api.get('/auth/me');
      console.log('AuthService: Current user response:', response);
      return response.user;
    } catch (error) {
      console.error('AuthService: Get current user error:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      console.log('AuthService: Updating profile...');
      const response = await api.put('/auth/profile', profileData);
      console.log('AuthService: Profile update response:', response);
      return response;
    } catch (error) {
      console.error('AuthService: Profile update error:', error);
      throw error;
    }
  }
};
