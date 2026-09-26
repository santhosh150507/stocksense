import api from './api';
export const receiptService = {
  getAll: async () => (await api.get('/receipts')).data,
  create: async (data) => (await api.post('/receipts', data)).data,
  validate: async (id) => (await api.post(`/receipts/${id}/validate`)).data,
  update: async (id, data) => (await api.put(`/receipts/${id}`, data)).data,
};
