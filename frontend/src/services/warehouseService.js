import api from './api';

export const warehouseService = {
  getAll: async (params) => {
    const response = await api.get('/warehouses', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/warehouses/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/warehouses', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/warehouses/${id}`, data);
    return response.data;
  }
};
