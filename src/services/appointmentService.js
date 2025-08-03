import api from './api';

export const appointmentService = {
  bookAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response;
  },

  getUserAppointments: async () => {
    const response = await api.get('/appointments/my');
    return response;
  },

  getProviderAppointments: async () => {
    const response = await api.get('/appointments/provider');
    return response;
  },

  updateAppointmentStatus: async (id, status) => {
    const response = await api.put(`/appointments/${id}/status`, { status });
    return response;
  },

  cancelAppointment: async (id) => {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response;
  }
};
