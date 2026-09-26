import api from './api';

export const receiptService = {
  getAll: async () => {
    const res = await api.get('/receipts');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/receipts/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/receipts', data);
    return res.data;
  },
  validate: async (id) => {
    const res = await api.post(`/receipts/${id}/validate`);
    return res.data;
  }
};
