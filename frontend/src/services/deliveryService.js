import api from './api';
export const deliveryService = {
  getAll: async () => (await api.get('/deliveries')).data,
  create: async (data) => (await api.post('/deliveries', data)).data,
  validate: async (id) => (await api.post(`/deliveries/${id}/validate`)).data,
  update: async (id, data) => (await api.put(`/deliveries/${id}`, data)).data,
};
