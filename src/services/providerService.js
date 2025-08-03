import api from './api';

export const providerService = {
  getProviders: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/providers?${params}`);
    return response;
  },

  getProvider: async (id) => {
    const response = await api.get(`/providers/${id}`);
    return response;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/providers/profile', profileData);
    return response;
  }
};
