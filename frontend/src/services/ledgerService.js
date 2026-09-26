import api from './api';
export const ledgerService = {
  getAll: async () => (await api.get('/ledger')).data,
};
