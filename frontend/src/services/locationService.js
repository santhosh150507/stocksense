import api from './api';

export const locationService = {
  getAll: async (params) => {
    const response = await api.get('/warehouses/locations/all', { params });
    return response.data;
  },
  create: async (warehouseId, data) => {
    const response = await api.post(`/warehouses/${warehouseId}/locations`, data);
    return response.data;
  }
};
