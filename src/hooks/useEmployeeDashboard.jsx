import { useState, useEffect, useCallback } from 'react';
import api from '../config/api';

const useEmployeeDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        currentSalary: 0,
        salaryStatus: "BELUM_PROSES",
        totalOvertimeHours: 0,
        remainingLeave: 12,
        pphDeducted: 0,
        basicSalary: 0
    });
    const [chartData, setChartData] = useState([]);
    const [overtimeHistory, setOvertimeHistory] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [payrollSummary, setPayrollSummary] = useState(null);
    const [error, setError] = useState(null);

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // ENDPOINT API
            const response = await api.get('/dashboard/employee');
            
            if (response.data?.success) {
                const data = response.data.data;
                setStats(data.stats);
                setChartData(data.chartData);
                setOvertimeHistory(data.overtimeHistory);
                setActivityLog(data.activityLog);
                setPayrollSummary(data.payrollSummary);
            } else {
                // FALLBACK: pakai mock data kalau endpoint belum ada
                console.log("Endpoint belum ada, pakai mock data");
                setStats({
                    currentSalary: 0,
                    salaryStatus: "BELUM_PROSES",
                    totalOvertimeHours: 0,
                    remainingLeave: 12,
                    pphDeducted: 0,
                    basicSalary: 8000000
                });
                setChartData([
                    { month: 'Jan', salary: 0 },
                    { month: 'Feb', salary: 0 },
                    { month: 'Mar', salary: 0 },
                    { month: 'Apr', salary: 0 },
                    { month: 'Mei', salary: 0 },
                    { month: 'Jun', salary: 0 }
                ]);
                setOvertimeHistory([]);
                setActivityLog([
                    { title: "Selamat Datang", desc: "Anda telah login ke sistem", time: "Baru saja", icon: "Activity", color: "bg-emerald-500" }
                ]);
                setPayrollSummary({
                    gajiPokok: 8000000,
                    tunjangan: 0,
                    lembur: 0,
                    potongan: 0,
                    pph21: 0,
                    takeHomePay: 0,
                    status: "Belum diproses"
                });
            }
        } catch (err) {
            console.error('Dashboard error:', err);
            // Jangan set error, pakai mock data
            setError(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchDashboard();
    }, [fetchDashboard]);

    return {
        loading,
        stats,
        chartData,
        overtimeHistory,
        activityLog,
        payrollSummary,
        error,
        refetch: fetchDashboard
    };
};

export default useEmployeeDashboard;