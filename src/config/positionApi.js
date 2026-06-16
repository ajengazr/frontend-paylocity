import api from './api';

export default {
    getAll: () => api.get('/api/positions'),
    getById: (id) => api.get(`/api/positions/${id}`),
    create: (data) => api.post('/api/positions', data),
    update: (id, data) => api.put(`/api/positions/${id}`, data),
    delete: (id) => api.delete(`/api/positions/${id}`),
};