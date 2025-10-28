// services/api.js
const API_BASE = 'http://localhost:5000/api';

// Função auxiliar para fazer requisições
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

export const api = {
  // Clients
  async getClients() {
    return await fetchAPI('/clients');
  },

  async getClient(id) {
    return await fetchAPI(`/clients/${id}`);
  },

  async createClient(client) {
    return await fetchAPI('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  },

  async updateClient(id, client) {
    return await fetchAPI(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    });
  },

  async deleteClient(id) {
    return await fetchAPI(`/clients/${id}`, {
      method: 'DELETE',
    });
  },

  // Employers
  async getEmployers() {
    return await fetchAPI('/employers');
  },

  async getEmployer(id) {
    return await fetchAPI(`/employers/${id}`);
  },

  async createEmployer(employer) {
    return await fetchAPI('/employers', {
      method: 'POST',
      body: JSON.stringify(employer),
    });
  },

  async updateEmployer(id, employer) {
    return await fetchAPI(`/employers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employer),
    });
  },

  async deleteEmployer(id) {
    return await fetchAPI(`/employers/${id}`, {
      method: 'DELETE',
    });
  },

  // Schedules
  async getSchedules() {
    return await fetchAPI('/schedules');
  },

  async createSchedule(schedule) {
    return await fetchAPI('/schedules', {
      method: 'POST',
      body: JSON.stringify(schedule),
    });
  },

  async deleteSchedule(id) {
    return await fetchAPI(`/schedules/${id}`, {
      method: 'DELETE',
    });
  },
};