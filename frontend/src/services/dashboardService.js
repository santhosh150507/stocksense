import api from './api';

export const dashboardService = {
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },
  getLowStock: async () => {
    const response = await api.get('/dashboard/low-stock');
    return response.data;
  }
};
