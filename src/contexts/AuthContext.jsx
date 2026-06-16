import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUser({ ...parsedUser, token: storedToken });
            } catch (e) {
                console.error('Gagal parse user dari localStorage', e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }

        setIsLoading(false);
    }, []);

    const login = (userData) => {
        console.log('login() called with:', userData);

        const safeUser = {
            name: userData?.name || userData?.username || 'User',
            email: userData?.email || '',
            role: userData?.role || 'employee',
            token: userData?.token || '',
            ...userData,
        };

        localStorage.setItem('user', JSON.stringify(safeUser));
        localStorage.setItem('token', safeUser.token);

        setUser(safeUser);
        setIsLoading(false);
    };

    const logout = () => {
        console.log('masuk logout');
        
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
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