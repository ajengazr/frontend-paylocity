import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Penjaga rute. Tanpa argumen, hanya memastikan pengguna sudah masuk. Dengan
// prop `roles`, rute hanya dibuka untuk peran yang disebut.
//
// Ini murni soal tampilan, bukan batas keamanan: yang benar-benar menegakkan
// hak akses adalah backend, dan setiap endpoint sudah memeriksanya sendiri.
// Gunanya di sini agar pengguna tidak dibawa ke halaman yang seluruh datanya
// akan ditolak server.
const ProtectedRoute = ({ roles }) => {
    const { isAuthenticated, isLoading, role } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f9f9ff]">
                <div className="w-8 h-8 border-4 border-[#ff6b00] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (roles && roles.length > 0) {
        const current = String(role || '').toUpperCase();
        const allowed = roles.map((r) => String(r).toUpperCase());

        if (!allowed.includes(current)) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
