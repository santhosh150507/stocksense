import api from './api';
export const transferService = {
  getAll: async () => (await api.get('/transfers')).data,
  create: async (data) => (await api.post('/transfers', data)).data,
  validate: async (id) => (await api.post(`/transfers/${id}/validate`)).data,
};
