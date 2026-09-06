import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { iconMap } from '../../data/IconMap';
import { X, Sun, Moon, Bell } from 'lucide-react';
import notificationApi from '../../config/notificationApi';

const dropdownVariants = {
    hidden: { opacity: 0, y: -6, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.15 } }
};

const TopHeader = ({ searchQuery, setSearchQuery, userAvatar }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifs, setNotifs] = useState([]);
    const [loadingNotif, setLoadingNotif] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const notifRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            setLoadingNotif(true);
            const res = await notificationApi.getMyNotifications();
            setNotifs(res.data?.data || []);
        } catch (err) {
            console.error('Fetch notif error:', err);
        } finally {
            setLoadingNotif(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const res = await notificationApi.getUnreadCount();
            setUnreadCount(res.data?.data?.unreadCount || 0);
        } catch (err) {
            console.error('Fetch unread count error:', err);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchNotifications();
        fetchUnreadCount();
        const interval = setInterval(() => {
            fetchNotifications();
            fetchUnreadCount();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setIsNotifOpen(false);
            }
        };
        if (isNotifOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isNotifOpen]);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationApi.markAsRead(id);
            setNotifs(prev => prev.map(n => n.id === parseInt(id) ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteNotification = async (id, e) => {
        e.stopPropagation();
        try {
            await notificationApi.deleteNotification(id);
            const deleted = notifs.find(n => n.id === parseInt(id));
            setNotifs(prev => prev.filter(n => n.id !== parseInt(id)));
            if (!deleted?.isRead) setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteReadNotifications = async () => {
        try {
            await notificationApi.deleteReadNotifications();
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const clearSearch = () => setSearchQuery('');

    const getNotifIcon = (type) => {
        if (type === 'success') return (
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <iconMap.Check className="w-4 h-4" />
            </div>
        );
        if (type === 'payroll') return (
            <div className="w-8 h-8 rounded-full bg-[#ff6b00]/10 flex items-center justify-center text-[#ff6b00] shrink-0">
                <iconMap.Wallet className="w-4 h-4" />
            </div>
        );
        return (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <iconMap.Info className="w-4 h-4" />
            </div>
        );
    };

    const formatTime = (date) => {
        const d = new Date(date);
        const diff = (new Date() - d) / 1000;
        if (diff < 60) return 'Baru saja';
        if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
        return d.toLocaleDateString('id-ID');
    };

    return (
        <header className={`
            sticky top-0 z-30 w-full px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 
            flex items-center justify-between border-b glass
            transition-colors duration-200
            ${isDark ? 'border-gray-700/70' : 'border-gray-200/70'}
        `}>
            {/* Search */}
            <div className="relative flex-1 max-w-40 sm:max-w-xs lg:max-w-md">
                <input
                    type="text"
                    placeholder="Cari data..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`
                        w-full px-3 sm:px-4 py-2 rounded-xl text-sm outline-none 
                        transition-all duration-200
                        ${isDark 
                            ? 'bg-[#252d3a] text-[#ebf1ff] placeholder-gray-500 focus:ring-2 focus:ring-[#ff6b00]/30' 
                            : 'bg-gray-100 text-[#151c27] placeholder-gray-400 focus:ring-2 focus:ring-[#ff6b00]/20 focus:bg-white'
                        }
                    `}
                />
                <AnimatePresence>
                    {searchQuery && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={clearSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-600/50 transition-colors"
                        >
                            <X className="w-3.5 h-3.5 text-gray-400" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0 ml-3">
                {/* Theme Toggle */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className={`
                        p-2 rounded-xl transition-colors
                        ${isDark ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'}
                    `}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isDark ? 'sun' : 'moon'}
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </motion.div>
                    </AnimatePresence>
                </motion.button>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setIsNotifOpen(!isNotifOpen);
                            if (!isNotifOpen) {
                                fetchNotifications();
                                fetchUnreadCount();
                            }
                        }}
                        className={`
                            p-2 rounded-xl border relative transition-colors
                            ${isDark 
                                ? 'bg-[#1e293b] border-[#334155] text-gray-300 hover:bg-[#2a3547]' 
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
                            }
                        `}
                    >
                        <motion.div
                            animate={unreadCount > 0 ? { rotate: [0, -12, 12, -12, 12, 0] } : { rotate: 0 }}
                            transition={{ duration: 0.6, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 2.6 }}
                            style={{ transformOrigin: 'top center' }}
                        >
                            <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                        </motion.div>
                        <AnimatePresence>
                            {unreadCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                    className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1 border-2 border-white dark:border-[#1a2332]"
                                >
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    <AnimatePresence>
                        {isNotifOpen && (
                            <motion.div
                                variants={dropdownVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className={`
                                    absolute right-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-80 lg:w-96 
                                    max-w-sm rounded-2xl border shadow-xl overflow-hidden z-50
                                    ${isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-200'}
                                `}
                            >
                                <div className={`
                                    flex items-center justify-between px-4 py-3 border-b
                                    ${isDark ? 'border-[#2d3748]' : 'border-gray-100'}
                                `}>
                                    <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Notifikasi
                                        {unreadCount > 0 && (
                                            <span className={`ml-2 text-xs font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                ({unreadCount})
                                            </span>
                                        )}
                                    </h4>
                                    <div className="flex gap-2">
                                        {unreadCount > 0 && (
                                            <button onClick={handleMarkAllRead} className="text-xs text-[#ff6b00] hover:underline font-medium">
                                                Baca semua
                                            </button>
                                        )}
                                        {notifs.some(n => n.isRead) && (
                                            <button onClick={handleDeleteReadNotifications} className="text-xs text-red-500 hover:underline font-medium">
                                                Hapus dibaca
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto overscroll-contain">
                                    {loadingNotif ? (
                                        <div className="px-4 py-8 text-center">
                                            <div className="w-5 h-5 border-2 border-[#ff6b00] border-t-transparent rounded-full animate-spin mx-auto" />
                                        </div>
                                    ) : notifs.length === 0 ? (
                                        <div className="px-4 py-8 text-center">
                                            <Bell className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                Tidak ada notifikasi
                                            </p>
                                        </div>
                                    ) : (
                                        notifs.map((n) => (
                                            <div
                                                key={n.id}
                                                onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                                                className={`
                                                    relative group cursor-pointer
                                                    px-4 py-3 transition-colors border-b last:border-b-0
                                                    ${isDark ? 'border-[#2d3748] hover:bg-[#2a3547]' : 'border-gray-100 hover:bg-gray-50'}
                                                    ${!n.isRead ? (isDark ? 'bg-[#151c27]/50' : 'bg-blue-50/40') : ''}
                                                `}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {getNotifIcon(n.type)}
                                                    <div className="flex-1 min-w-0 text-left">
                                                        <div className="flex items-center gap-2">
                                                            <p className={`text-xs font-semibold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                                                {n.title}
                                                            </p>
                                                            {!n.isRead && (
                                                                <span className="w-2 h-2 rounded-full bg-[#ff6b00] shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className={`text-[11px] mt-0.5 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            {n.message}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            {formatTime(n.createdAt)}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => handleDeleteNotification(n.id, e)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 shrink-0"
                                                    >
                                                        <X className="w-3 h-3 text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className={`
                                    px-4 py-2.5 border-t text-center
                                    ${isDark ? 'border-[#2d3748] bg-[#151c27]' : 'border-gray-100 bg-gray-50'}
                                `}>
                                    <button
                                        onClick={() => {
                                            setIsNotifOpen(false);
                                            navigate('/notifications');
                                        }}
                                        className="text-xs font-medium text-[#ff6b00] hover:underline"
                                    >
                                        Lihat semua notifikasi
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-2 sm:gap-3 border-l pl-2 sm:pl-4 border-gray-300 dark:border-gray-700">
                    <div className="relative">
                        <img 
                            src={userAvatar} 
                            alt={user?.name} 
                            className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-[#ff6b00]"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1a2332]" />
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className={`text-sm font-semibold leading-tight ${isDark ? 'text-[#ebf1ff]' : 'text-[#151c27]'}`}>
                            {user?.name}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopHeader;