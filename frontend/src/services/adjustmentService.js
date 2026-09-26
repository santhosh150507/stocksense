import api from './api';
export const adjustmentService = {
  getAll: async () => (await api.get('/adjustments')).data,
  create: async (data) => (await api.post('/adjustments', data)).data,
  validate: async (id) => (await api.post(`/adjustments/${id}/validate`)).data,
};
