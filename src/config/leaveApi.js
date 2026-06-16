import api from '../config/api';

export const leaveApi = {
    create: (data) => api.post('/api/leaves', data),
    getAll: () => api.get('/api/leaves'),
    getMy: () => api.get('/api/leaves/my'),
    getById: (id) => api.get(`/api/leaves/${id}`),
    updateStatus: (id, data) => api.patch(`/api/leaves/${id}/status`, data),
    delete: (id) => api.delete(`/api/leaves/${id}`)
};