import api from './api';

const notificationApi = {
    getMyNotifications: () => api.get('/api/notifications'),
    getUnreadCount: () => api.get('/api/notifications/unread-count'),
    markAsRead: (id) => api.patch(`/api/notifications/${id}/read`),
    markAllAsRead: () => api.patch('/api/notifications/read-all'),
    deleteNotification: (id) => api.delete(`/api/notifications/${id}`),
    deleteReadNotifications: () => api.delete('/api/notifications/read'),
};

export default notificationApi;