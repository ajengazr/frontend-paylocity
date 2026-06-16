import api from './api';

const employeeApi = {
    getAll: () => api.get('/api/employees'),
    getById: (id) => api.get(`/api/employees/${id}`),
    create: (data) => api.post('/api/employees/create', data),
    update: (id, data) => api.put(`/api/employees/${id}`, data),
    delete: (id) => api.delete(`/api/employees/${id}`),
    getMe: () => api.get('/api/employees/me'),
    updateMe: (data) => api.put('/api/employees/me', data),
};

export default employeeApi;

