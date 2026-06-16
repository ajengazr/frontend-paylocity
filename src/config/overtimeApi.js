import api from './api';

const overtimeApi = {
    getAll: () => api.get('/api/overtimes'),
    getMyOvertime: () => api.get('/api/overtimes/my'),
    getById: (id) => api.get(`/api/overtimes/${id}`),
    create: (data) => api.post('/api/overtimes', data),
    createByAdmin: (data) => {
        const payload = {
            ...data,
            employeeId: Number(data.employeeId)
        };
        return api.post('/api/overtimes/admin', payload);
    },
    updateByAdmin: (id, data) => api.put(`/api/overtimes/${id}`, data),
    updateStatus: (id, data) => api.patch(`/api/overtimes/${id}/status`, data),
    delete: (id) => api.delete(`/api/overtimes/${id}`),
};

export default overtimeApi;