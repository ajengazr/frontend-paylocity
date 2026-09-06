import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import notificationApi from '../config/notificationApi';
import { iconMap } from '../data/IconMap';
import { ArrowLeft } from 'lucide-react';

const NotificationsPage = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await notificationApi.getMyNotifications();
            setNotifications(res.data?.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationApi.markAsRead(id);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await notificationApi.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <iconMap.Check className="w-5 h-5" />
                </div>;
            case 'payroll':
                return <div className="w-10 h-10 rounded-full bg-[#ff6b00]/10 flex items-center justify-center text-[#ff6b00] shrink-0">
                    <iconMap.Wallet className="w-5 h-5" />
                </div>;
            default:
                return <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <iconMap.Info className="w-5 h-5" />
                </div>;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    >
                        <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                    </button>
                    <div className="flex-1">
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Notifikasi
                            {unreadCount > 0 && (
                                <span className={`ml-2 text-sm font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    ({unreadCount})
                                </span>
                            )}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="px-3 py-1.5 text-sm bg-[#ff6b00] text-white rounded-lg hover:bg-[#e05a00] transition-colors"
                            >
                                Baca semua
                            </button>
                        )}
                        {notifications.some(n => n.isRead) && (
                            <button
                                onClick={async () => {
                                    try {
                                        await notificationApi.deleteReadNotifications();
                                        setNotifications(prev => prev.filter(n => !n.isRead));
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}
                                className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Hapus yang dibaca
                            </button>
                        )}
                    </div>
                </div>

                {/* List Notifikasi */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-[#ff6b00] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className={`text-center py-12 rounded-xl ${isDark ? 'bg-[#1e293b]' : 'bg-white'}`}>
                        <iconMap.Bell className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Belum ada notifikasi
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`rounded-xl transition-all ${!notif.isRead
                                        ? (isDark ? 'bg-[#1e293b] border-l-4 border-[#ff6b00]' : 'bg-white border-l-4 border-[#ff6b00] shadow-sm')
                                        : (isDark ? 'bg-[#0f172a] hover:bg-[#1e293b]' : 'bg-gray-50 hover:bg-white')
                                    }`}
                            >
                                <div className="flex items-start gap-4 p-4">
                                    {/* Icon */}
                                    <div className="shrink-0">
                                        {getIcon(notif.type)}
                                    </div>

                                    {/* Content - SEMUA RATA KIRI */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className={`font-semibold text-left ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {notif.title}
                                                    {!notif.isRead && (
                                                        <span className="inline-block w-2 h-2 rounded-full bg-[#ff6b00] ml-2 -mt-0.5 align-middle" />
                                                    )}
                                                </h3>
                                                <p className={`text-sm mt-1 text-left leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {notif.message}
                                                </p>
                                                <p className={`text-xs mt-2 text-left ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    {formatDate(notif.createdAt)}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                {!notif.isRead && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notif.id)}
                                                        className="text-xs text-[#ff6b00] hover:underline whitespace-nowrap"
                                                    >
                                                        Tandai dibaca
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(notif.id)}
                                                    className="text-xs text-red-500 hover:underline whitespace-nowrap"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;