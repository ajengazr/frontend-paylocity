import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUser({ ...parsedUser, token: storedToken });
            } catch (e) {
                console.error('Gagal parse user dari storage', e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('token');
            }
        }

        setIsLoading(false);
    }, []);

    const login = (userData, remember = true) => {
        console.log('login() called with:', userData);

        const storage = remember ? localStorage : sessionStorage;

        const safeUser = {
            name: userData?.name || userData?.username || 'User',
            email: userData?.email || '',
            role: userData?.role || 'employee',
            token: userData?.token || '',
            ...userData,
        };

        storage.setItem('user', JSON.stringify(safeUser));
        storage.setItem('token', safeUser.token);

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