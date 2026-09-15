import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Sesi dipegang cookie httpOnly yang dipasang server saat login. Storage di
    // browser hanya menyimpan profil tampilan (nama, email, peran) supaya antarmuka
    // tidak berkedip saat halaman dimuat ulang. Token sengaja tidak ikut disimpan:
    // token di localStorage bisa dibaca skrip mana pun yang berhasil masuk ke
    // halaman, dan itu menghapus seluruh manfaat cookie httpOnly.
    useEffect(() => {
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

        if (storedUser) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Gagal parse user dari storage', e);
                localStorage.removeItem('user');
                sessionStorage.removeItem('user');
            }
        }

        // Token sisa dari versi lama dibersihkan sekali saat aplikasi dibuka.
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');

        setIsLoading(false);
    }, []);

    const login = (userData, remember = true) => {
        const storage = remember ? localStorage : sessionStorage;

        const safeUser = {
            ...(userData || {}),
            name: userData?.name || userData?.username || 'User',
            email: userData?.email || '',
            role: userData?.role || 'employee',
        };

        // Jaga-jaga bila ada pemanggil lama yang masih menyertakan token.
        delete safeUser.token;

        storage.setItem('user', JSON.stringify(safeUser));

        setUser(safeUser);
        setIsLoading(false);
    };

    const logout = async () => {
        try {
            // Bersihkan cookie httpOnly di server agar sesi benar-benar berakhir
            await api.get('/api/user/logout');
        } catch (err) {
            console.error('Gagal logout di server:', err);
        }

        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');

        setUser(null);
        setIsLoading(false);
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        role: user?.role || null,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};