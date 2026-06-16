import api from './api';

export default {
    getAll: () => api.get('/api/departments'),
    getById: (id) => api.get(`/api/departments/${id}`),
    create: (data) => api.post('/api/departments', data),
    update: (id, data) => api.put(`/api/departments/${id}`, data),
    delete: (id) => api.delete(`/api/departments/${id}`),
};