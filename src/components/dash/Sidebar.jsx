import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLoading } from '../../contexts/LoadingContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
    Menu, X, AlertTriangle, Shield, LogOut,
    LayoutDashboard, Users, Building2, Briefcase, 
    Clock, DollarSign, FileText, UserCircle,
    User, Receipt, Wallet, Calendar, Plus, Search, 
    Bell, Sun, Moon, Check, UserPlus, TrendingUp,
    AlertCircle, Info, ChevronRight, CalendarCheck
} from 'lucide-react';
import { slideLeft, scaleUp, staggerContainer, staggerItem } from '../../animations/variants';

const Sidebar = ({ menu, activeTab, setActiveTab, role }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const { logout } = useAuth();
    const { showLoading, hideLoading } = useLoading();
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const getIcon = (iconName) => {
        const icons = {
            LayoutDashboard, Users, Building2, Briefcase, Clock,
            DollarSign, FileText, UserCircle, User, Receipt,
            Wallet, Calendar, Plus, Search, Bell, Sun, Moon,
            Check, UserPlus, TrendingUp, AlertCircle, Info,
            ChevronRight, CalendarCheck
        };
        return icons[iconName] || LayoutDashboard;
    };

    const handleNav = (name) => {
        setActiveTab(name);
        setIsOpen(false);
    };

    const handleAdmin = () => {
        setActiveTab('Kelola Admin');
        setIsOpen(false);
    };

    const handleLogoutClick = () => {
        setIsLogoutConfirmOpen(true);
    };

    const cancelLogout = () => {
        setIsLogoutConfirmOpen(false);
    };

    const confirmLogout = async () => {
        setIsLogoutConfirmOpen(false);
        showLoading();
        await new Promise(resolve => setTimeout(resolve, 2500));
        logout();
        hideLoading();
        navigate('/login', { replace: true });
    };

    const sidebarVariants = slideLeft || {
        initial: { x: -280, opacity: 0 },
        animate: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
        exit: { x: -280, opacity: 0, transition: { duration: 0.25, ease: 'easeInOut' } }
    };

    const modalVariants = scaleUp || {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    };

    const containerVariants = staggerContainer || {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
    };

    const itemVariants = staggerItem || {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.3 } }
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={`lg:hidden fixed top-4 left-4 z-60 p-2.5 rounded-xl border shadow-md transition-colors ${isDark ? 'bg-[#1a2332] border-[#2d3748] text-white' : 'bg-white border-gray-200 text-[#151c27]'}`}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="w-5 h-5" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="menu"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Menu className="w-5 h-5" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Overlay Mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden fixed inset-0 bg-black/40 z-55 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial="initial"
                animate="animate"
                variants={sidebarVariants}
                className={`fixed inset-y-0 left-0 z-56 flex flex-col border-r transition-colors duration-300 ${isDark ? 'bg-[#1a2332] border-[#2d3748]' : 'bg-white border-[#e5e7eb]'} ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} w-64 lg:w-[16rem]`}
            >
                {/* Logo */}
                <motion.div 
                    className="p-4 sm:p-5 lg:p-6 shrink-0"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                >
                    <motion.img 
                        src="/logo.png" 
                        alt="Paylocity Logo" 
                        className="w-14 sm:w-16 lg:w-20 h-auto mb-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    />
                    <p className={`text-[10px] lg:text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        HRIS Payroll
                    </p>
                </motion.div>

                <motion.nav 
                    className="flex-1 overflow-y-auto px-2 sm:px-3 lg:px-4 space-y-0.5 min-h-0"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {menu.map((item) => {
                        const Icon = getIcon(item.icon);
                        const isActive = activeTab === item.name;
                        return (
                            <motion.button
                                key={item.name}
                                variants={itemVariants}
                                whileHover={{ x: 4, scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleNav(item.name)}
                                className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-[#ff6b00]/10 text-[#ff6b00] shadow-sm'
                                    : isDark
                                        ? 'text-gray-300 hover:bg-[#2a3547]'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 lg:w-5 lg:h-5 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                                <span className="truncate">{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ff6b00]"
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </motion.nav>

                <motion.div 
                    className={`p-2 sm:p-3 lg:p-4 border-t shrink-0 transition-colors duration-300 ${isDark ? 'border-[#2d3748]' : 'border-gray-200'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                >
                    {/* Admin Button */}
                    {role === 'SUPER_ADMIN' && (
                        <motion.button 
                            variants={itemVariants}
                            whileHover={{ x: 4, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAdmin}
                            className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm font-medium rounded-xl transition-all duration-200 ${isDark ? 'text-gray-300 hover:bg-[#2a3547]' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Shield className="w-4 h-4 lg:w-5 lg:h-5" />
                            <span>Kelola Admin</span>
                        </motion.button>
                    )}

                    {/* Logout Button */}
                    <motion.button
                        whileHover={{ x: 4, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm font-medium rounded-xl text-red-500 hover:bg-red-500/10 transition-all duration-200 mt-1"
                    >
                        <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span>Keluar</span>
                    </motion.button>
                </motion.div>
            </motion.aside>

            {/* Modal Konfirmasi Logout */}
            <AnimatePresence>
                {isLogoutConfirmOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className={`w-full max-w-sm rounded-2xl border shadow-2xl p-6 ${isDark ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-white border-gray-100 text-[#151c27]'}`}
                        >
                            <div className="flex flex-col items-center text-center gap-4">
                                <motion.div 
                                    className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                                >
                                    <AlertTriangle className="w-7 h-7 text-red-500" />
                                </motion.div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Yakin Mau Keluar?</h3>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Kamu akan diarahkan ke halaman login.
                                    </p>
                                </div>
                                <div className="flex w-full gap-3 pt-2">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={cancelLogout}
                                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${isDark ? 'border-[#334155] text-gray-300 hover:bg-[#2a3547]' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        Batal
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={confirmLogout}
                                        className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        Ya, Keluar
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;