import api from './api';

const reportApi = {
  getPayrollReport: (period) => api.get('/api/reports/payroll', { params: { period } }),
  getOvertimeReport: (period, status = 'ALL') => api.get('/api/reports/overtime', { params: { period, status } }),
  getEmployeeReport: (params = {}) => api.get('/api/reports/employees', { params }),
  getAnnualReport: (year) => api.get('/api/reports/annual', { params: { year } }),
};

export default reportApi;