import api from './api';

const payslipApi = {
    // Admin
    getByPeriod: (period) => api.get(`/api/payslips/${period}`),
    getDetail: (period, employeeId) => api.get(`/api/payslips/${period}/employee/${employeeId}`),

    // Employee
    getMyPayslips: (params = {}) => api.get('/api/my-payslips', { params }),
    getMyDetail: (id) => api.get(`/api/my-payslips/${id}`),
};

export default payslipApi;