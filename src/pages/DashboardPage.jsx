import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import DashboardLayout from '../components/dash/DashboardLayout';
import { useTheme } from '../contexts/ThemeContext';

const DashboardPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, role, isAuthenticated, isLoading } = useAuth();
    const { isDark } = useTheme();
    const { addToast } = useToast();


    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (location.state?.fromLogin && user) {
            addToast(
                `Selamat datang kembali, ${user.name || user.username || 'User'}!`,
                'success',
                5000
            );
            navigate('.', { replace: true, state: {} });
        }
    }, [location, user, addToast, navigate]);

    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#151c27]' : 'bg-[#f9f9ff]'}`}>
                <div className="w-8 h-8 border-4 border-[#ff6b00] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated || !role) {
        return null; // Sudah di-redirect oleh useEffect di atas
    }
    console.log("rolenya: ", role);

    return <DashboardLayout role={role} />;
};

export default DashboardPage;