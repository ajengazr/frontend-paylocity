import api from './api';

const payrollApi = {
    getAll: () => api.get('/api/payrolls'),
    create: (data) => api.post('/api/payrolls', data),
    getByPeriod: (period) => api.get(`/api/payrolls/${period}`),
};

export default payrollApi;