import { useState, useEffect } from 'react';
import dashboardApi from '../config/dashboardApi';

const useDashboardData = (role) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                let res;
                if (role === 'EMPLOYEE') {
                    res = await dashboardApi.getEmployeeDashboard();
                } else {
                    res = await dashboardApi.getAdminDashboard();
                }
                
                setData(res.data?.data || null);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
                setError(err?.response?.data?.errors || 'Gagal memuat data dashboard');
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        if (role) fetchData();
    }, [role]);

    return { data, loading, error };
};

export default useDashboardData;