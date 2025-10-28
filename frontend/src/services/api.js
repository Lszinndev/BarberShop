import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  getClients: async () => {
    const response = await apiClient.get('/api/clients');
    return response.data;
  },
  createClient: async (client) => {
    const response = await apiClient.post('/api/clients', client);
    return response.data;
  },
  updateClient: async (id, client) => {
    const response = await apiClient.put(`/api/clients/${id}`, client);
    return response.data;
  },
  deleteClient: async (id) => {
    const response = await apiClient.delete(`/api/clients/${id}`);
    return response.data;
  },
  getSchedules: async () => {
    const response = await apiClient.get('/api/schedules');
    return response.data;
  },
  getEmployers: async () => {
    const response = await apiClient.get('/api/employers');
    return response.data;
  },
  createEmployer: async (employer) => {
    const response = await apiClient.post('/api/employers', employer);
    return response.data;
  },
  updateEmployer: async (id, employer) => {
    const response = await apiClient.put(`/api/employers/${id}`, employer);
    return response.data;
  },
  deleteEmployer: async (id) => {
    const response = await apiClient.delete(`/api/employers/${id}`);
    return response.data;
  },
};
