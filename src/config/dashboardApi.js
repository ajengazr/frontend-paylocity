import api from './api';

const dashboardApi = {
    getEmployeeDashboard: () => api.get('/dashboard/employee'),
    getEmployeeStats: () => api.get('/dashboard/employee/stats'),
    getEmployeeChart: () => api.get('/dashboard/employee/chart'),
    getEmployeeOvertime: () => api.get('/dashboard/employee/overtime-history'),
    getEmployeeActivity: () => api.get('/dashboard/employee/activity-log'),
    getEmployeePayrollSummary: (period) => api.get(`/dashboard/employee/payroll-summary${period ? `?period=${period}` : ''}`),
    getEmployeePayrollPeriods: () => api.get('/dashboard/employee/payroll-periods'),
    
    getAdminDashboard: () => api.get('/dashboard/admin'),
    getAdminStats: () => api.get('/dashboard/admin/stats'),
    getAdminChart: () => api.get('/dashboard/admin/chart'),
    getAdminOvertime: () => api.get('/dashboard/admin/overtime-history'),
    getAdminActivity: () => api.get('/dashboard/admin/activity-log'),
    getAdminPayrollSummary: () => api.get('/dashboard/admin/payroll-summary'),
    getAllPayrolls: () => api.get('/payroll/all'),
    getPayrollPeriods: () => api.get('/payroll/periods'),
    getPayrollByPeriod: (period) => api.get(`/payroll/${period}`),
};

export default dashboardApi;