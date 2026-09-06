import { useState, useMemo } from 'react';
import { ROLE_CONFIG } from '../../data/dashboardConfig';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import DashboardContent from './DashboardContent';
import ProcessPayrollModal from './ProcessPayrollModal';
import useDashboardData from '../../hooks/useDashboardData';
import payrollApi from '../../config/payrollApi';
import overtimeApi from '../../config/overtimeApi';
import { useToast } from '../../contexts/ToastContext';

const formatRupiah = (val) => {
    if (val === undefined || val === null || val === '') return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const formatNumber = (val) => {
    if (val === undefined || val === null || val === '') return '0';
    return String(val);
};

const DashboardLayout = ({ role, initialTab = 'Dashboard' }) => {
    const config = ROLE_CONFIG[role];
    const { isDark } = useTheme();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState(initialTab);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: dynamicData, loading, error } = useDashboardData(role);

    // ============ MERGE STATS ============
    const mergedStats = useMemo(() => {
        const s = dynamicData?.stats || {};

        return config.stats.map((stat) => {
            // EMPLOYEE
            if (stat.label === 'Gaji Bulan Ini') {
                return { ...stat, value: formatRupiah(s.currentSalary), trend: s.salaryStatus === 'SUDAH_PROSES' ? 'Sudah diproses' : 'Belum diproses' };
            }
            if (stat.label === 'Jam Lembur') {
                return { ...stat, value: formatNumber(s.totalOvertimeHours), trend: `${s.pendingOvertimeCount || 0} menunggu approval` };
            }
            if (stat.label === 'Sisa Cuti') {
                return { ...stat, value: formatNumber(s.remainingLeave), trend: 'Dari 12 hari/tahun' };
            }
            if (stat.label === 'PPh 21 Terpotong') {
                return { ...stat, value: formatRupiah(s.pphDeducted), trend: 'Metode TER' };
            }

            // ADMIN
            if (stat.label === 'Total Karyawan') {
                return { ...stat, value: formatNumber(s.totalKaryawan), trend: 'Aktif' };
            }
            if (stat.label === 'Total Departemen') {
                return { ...stat, value: formatNumber(s.totalDepartemen), trend: 'Departemen' };
            }
            if (stat.label === 'Total Jam Lembur') {
                return { ...stat, value: formatNumber(s.totalOvertimeHours), trend: 'Menunggu review' };
            }
            if (stat.label === 'Total Penggajian') {
                return { ...stat, value: formatRupiah(s.totalNetSalary), trend: 'Periode terakhir' };
            }
            return stat;
        });
    }, [dynamicData, config.stats]);

    // ============ PAYROLL SUMMARY ============
    const mergedPayrollSummary = useMemo(() => {
        if (!dynamicData?.payrollSummary) return null;

        const ps = dynamicData.payrollSummary;

        // FORMAT EMPLOYEE 
        if (ps.gajiPokok !== undefined || ps.takeHomePay !== undefined) {
            return {
                gajiPokok: ps.gajiPokok ?? 0,
                tunjangan: ps.tunjangan ?? 0,
                lembur: ps.lembur ?? 0,
                potongan: ps.potongan ?? 0,
                pph21: ps.pph21 ?? 0,
                takeHomePay: ps.takeHomePay ?? 0,
                status: ps.status || 'Belum diproses',
                period: ps.period || ''
            };
        }

        // FORMAT ADMIN 
        const items = ps.items || [];
        if (items.length === 0 && ps.grandTotal) {
            return {
                items: [
                    { label: 'Gaji Pokok', value: formatRupiah(ps.totalBasic || 0), color: 'bg-[#ff6b00]' },
                    { label: 'Lembur', value: formatRupiah(ps.totalOvertime || 0), color: 'bg-blue-500' },
                    { label: 'Potongan', value: formatRupiah(ps.totalDeductions || 0), color: 'bg-red-500' },
                    { label: 'PPh 21', value: formatRupiah(ps.pph21 || 0), color: 'bg-purple-500' },
                    { label: 'BPJS', value: formatRupiah(ps.bpjs || 0), color: 'bg-amber-500' },
                ],
                grandTotal: formatRupiah(ps.grandTotal || ps.totalNetSalary || 0),
                footerNote: ps.footerNote || (ps.period ? `Periode ${ps.period}` : 'Data periode terakhir.'),
                status: ps.status || 'Belum diproses',
                period: ps.period || ''
            };
        }

        return {
            items: items.map(item => ({
                ...item,
                value: typeof item.value === 'number' ? formatRupiah(item.value) : item.value
            })),
            grandTotal: typeof ps.grandTotal === 'number' ? formatRupiah(ps.grandTotal) : (ps.grandTotal || 'Rp 0'),
            footerNote: ps.footerNote || 'Data periode terakhir.',
            status: ps.status || 'Belum diproses',
            period: ps.period || ''
        };
    }, [dynamicData]);

    // ============ DATA LAIN ============
    const mergedDonutData = dynamicData?.donutData || [];

    const mergedChartData = useMemo(() => {
        if (!dynamicData?.chartData) return [];
        // Backend udah return format { month, year, salary, period }, pake langsung
        return dynamicData.chartData.map(item => ({
            month: item.month || item.label || '',
            year: item.year || new Date().getFullYear(),
            salary: item.salary ?? item.value ?? 0,
            period: item.period || ''
        })).filter(item => item.period);
    }, [dynamicData]);

    const mergedTableData = useMemo(() => {
        // Backend full dashboard return overtimeHistory, individual endpoint return tableData
        const raw = dynamicData?.overtimeHistory || dynamicData?.tableData || [];
        console.log('=== mergedTableData raw ===', raw);

        if (!Array.isArray(raw) || raw.length === 0) return [];

        return raw.map(row => ({
            ...row,
            // Backend udah format tanggal jadi string "15 Jun 2026", jangan di new Date() lagi
            tanggal: row.tanggal || row.date || '-',
            // Backend udah format jam jadi "5 jam", jangan ditambahin suffix lagi
            jam: row.jam || (row.totalHours ? `${row.totalHours} jam` : '-'),
            // Backend udah format status jadi "Disetujui"/"Pending"/"Ditolak", preserve aja
            status: row.status || '-',
            keterangan: row.keterangan || row.reason || '-',
            honor: row.honor || row.overtimePay || '-',
        }));
    }, [dynamicData]);

    const mergedActivityData = useMemo(() => {
        // Backend return activityLog, bukan activityData
        const raw = dynamicData?.activityLog || dynamicData?.activityData || [];
        if (!Array.isArray(raw)) return [];
        // Backend udah format time jadi "Baru saja" / "2 jam lalu", jangan di new Date()
        return raw;
    }, [dynamicData]);

    if (!config) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-[#151c27] text-[#ebf1ff]' : 'bg-[#f9f9ff] text-[#151c27]'}`}>
                <div className="text-center">
                    <p className="text-lg font-semibold text-red-500">Role "{role}" tidak dikenali</p>
                    <p className="text-sm text-gray-500 mt-2">Silakan hubungi administrator</p>
                </div>
            </div>
        );
    }

    const handleConfirm = async (periodFromModal) => {
        try {
            if (config.isAdmin) {
                if (!periodFromModal) {
                    addToast('Periode wajib diisi untuk memproses payroll.', 'error');
                    return;
                }
                await payrollApi.create({ period: periodFromModal });
                addToast(`Payroll periode ${periodFromModal} berhasil diproses!`, 'success');
            } else {
                const today = new Date().toISOString().split('T')[0];
                await overtimeApi.create({
                    date: today,
                    startTime: '17:00',
                    endTime: '18:00',
                    dayType: 'WEEKDAY',
                    reason: 'Pengajuan lembur dari dashboard',
                });
                addToast('Pengajuan lembur berhasil dikirim!', 'success');
            }
        } catch (err) {
            const msg =
                (typeof err?.response?.data?.errors === 'string' && err.response.data.errors) ||
                (Array.isArray(err?.response?.data?.errors) && err.response.data.errors.join(', ')) ||
                'Terjadi kesalahan saat memproses. Coba lagi.';
            addToast(msg, 'error');
        } finally {
            setIsModalOpen(false);
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#151c27]' : 'bg-[#f9f9ff]'}`}>
                <div className="w-8 h-8 border-4 border-[#ff6b00] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 relative overflow-hidden ${isDark ? 'bg-[#151c27] text-[#ebf1ff]' : 'bg-[#f6f7f9] text-[#151c27]'}`}>
            <div className="relative">
            <Sidebar menu={config.menu} activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="min-h-screen flex flex-col lg:pl-64 pt-14 lg:pt-0">
                <TopHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} userName={config.userName} userRole={config.userRole} userAvatar={config.userAvatar} />

                <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-360 mx-auto w-full grow">
                    {error && (
                        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <DashboardContent
                        activeTab={activeTab}
                        config={config}
                        searchQuery={searchQuery}
                        role={role}
                        mergedStats={mergedStats}
                        mergedDonutData={mergedDonutData}
                        mergedTableData={mergedTableData}
                        mergedChartData={mergedChartData}
                        mergedActivityData={mergedActivityData}
                        mergedPayrollSummary={mergedPayrollSummary}
                        hasDynamicData={!!dynamicData}
                        setIsModalOpen={setIsModalOpen}
                    />
                </div>
            </main>

            <ProcessPayrollModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirm}
                title={config.modalTitle}
                desc={config.modalDesc}
                btnConfirm={config.modalBtnConfirm}
                btnCancel={config.modalBtnCancel}
                requirePeriod={config.isAdmin}
            />
            </div>
        </div>
    );
};

export default DashboardLayout;