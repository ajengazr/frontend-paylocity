import { useState, useEffect } from 'react';
import { Wallet, Info, ArrowUpRight, ArrowDownRight, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import dashboardApi from '../../config/dashboardApi';

const formatRupiah = (val) => {
    if (val === undefined || val === null || val === '') return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const PayrollSummary = ({ initialData, role }) => {
    const { isDark } = useTheme();
    const isAdmin = role === 'SUPER_ADMIN' || role === 'HR_ADMIN';

    const [periods, setPeriods] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const transformData = (raw) => {
        if (!raw) return null;

        // Format 1: Admin 
        if (raw.items && Array.isArray(raw.items) && raw.items.length > 0) {
            return {
                items: raw.items.map(item => ({
                    ...item,
                    value: typeof item.value === 'number' ? formatRupiah(item.value) : item.value
                })),
                grandTotal: typeof raw.grandTotal === 'number' ? formatRupiah(raw.grandTotal) : (raw.grandTotal || 'Rp 0'),
                footerNote: raw.footerNote || (raw.period ? `Periode ${raw.period}` : 'Data periode terakhir.'),
                status: raw.status || 'Belum diproses',
                period: raw.period || '',
            };
        }

        // Format 2: Employee
        const hasEmployeeFormat = raw.gajiPokok !== undefined || raw.takeHomePay !== undefined;
        if (hasEmployeeFormat) {
            const items = [
                { label: 'Gaji Pokok', value: formatRupiah(raw.gajiPokok ?? 0), color: 'bg-[#ff6b00]' },
                { label: 'Tunjangan', value: formatRupiah(raw.tunjangan ?? 0), color: 'bg-[#1a2332]' },
                { label: 'Lembur', value: formatRupiah(raw.lembur ?? 0), color: 'bg-gray-400' },
                { label: 'Potongan', value: formatRupiah(raw.potongan ?? 0), color: 'bg-red-500' },
                { label: 'PPh 21', value: formatRupiah(raw.pph21 ?? 0), color: 'bg-red-600' },
            ];
            return {
                items,
                grandTotal: formatRupiah(raw.takeHomePay ?? 0),
                footerNote: raw.period === 'all' ? 'Akumulasi semua periode' : (raw.period ? `Periode ${raw.period}` : 'Periode saat ini'),
                status: raw.status || 'Belum diproses',
                period: raw.period || '',
            };
        }

        // Format 3: Admin fallback
        if (raw.grandTotal) {
            return {
                items: [
                    { label: 'Gaji Pokok', value: formatRupiah(raw.totalBasic || 0), color: 'bg-[#ff6b00]' },
                    { label: 'Lembur', value: formatRupiah(raw.totalOvertime || 0), color: 'bg-blue-500' },
                    { label: 'Potongan', value: formatRupiah(raw.totalDeductions || 0), color: 'bg-red-500' },
                    { label: 'PPh 21', value: formatRupiah(raw.pph21 || 0), color: 'bg-purple-500' },
                    { label: 'BPJS', value: formatRupiah(raw.bpjs || 0), color: 'bg-amber-500' },
                ],
                grandTotal: typeof raw.grandTotal === 'number' ? formatRupiah(raw.grandTotal) : (raw.grandTotal || 'Rp 0'),
                footerNote: raw.footerNote || (raw.period ? `Periode ${raw.period}` : 'Data periode terakhir.'),
                status: raw.status || 'Belum diproses',
                period: raw.period || '',
            };
        }

        return null;
    };

    // Init + fetch periods
    useEffect(() => {
        let mounted = true;

        const init = async () => {
            if (initialData) {
                const transformed = transformData(initialData);
                if (mounted) {
                    setData(transformed);
                    if (initialData.period) setSelectedPeriod(initialData.period);
                }
            }

            try {
                // FIX: bedain endpoint admin vs employee
                const res = isAdmin
                    ? await dashboardApi.getPayrollPeriods()
                    : await dashboardApi.getEmployeePayrollPeriods();

                const list = res.data?.data || [];
                if (!mounted) return;
                setPeriods(['all', ...list]);
            } catch (err) {
                console.error('Fetch periods error:', err);
            }
        };

        init();
        return () => { mounted = false; };
    }, [initialData, isAdmin]);

    // Fetch saat ganti period
    useEffect(() => {
        if (!selectedPeriod) return;
        if (initialData?.period === selectedPeriod && initialData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setData(transformData(initialData));
            return;
        }

        let mounted = true;
        const fetchDetail = async () => {
            try {
                setLoading(true);

                // FIX: bedain endpoint admin vs employee
                const res = isAdmin
                    ? await dashboardApi.getPayrollByPeriod(selectedPeriod)
                    : await dashboardApi.getEmployeePayrollSummary(selectedPeriod);

                if (!mounted) return;
                setData(transformData(res.data?.data));
            } catch (err) {
                console.error('Fetch payroll error:', err);
                if (mounted) setData(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchDetail();
        return () => { mounted = false; };
    }, [selectedPeriod, initialData, isAdmin]);

    const hasData = data && data.items && data.items.length > 0;
    const { items, grandTotal, footerNote, status } = data || {};
    const isProcessed = status === 'Sudah diproses' || status === 'Akumulasi';

    const totalIncome = hasData
        ? items.filter(i => !['Potongan', 'PPh 21'].includes(i.label)).reduce((sum, i) => sum + (parseInt(String(i.value).replace(/\D/g, '')) || 0), 0)
        : 0;
    const totalDeductions = hasData
        ? items.filter(i => ['Potongan', 'PPh 21'].includes(i.label)).reduce((sum, i) => sum + (parseInt(String(i.value).replace(/\D/g, '')) || 0), 0)
        : 0;

    return (
        <div className={`rounded-xl border shadow-sm overflow-hidden transition-all ${isDark ? 'bg-[#0f172a] border-[#2d3748]' : 'bg-white border-gray-200'}`}>
            {/* Header */}
            <div className={`px-6 py-5 border-b ${isDark ? 'border-gray-800/50' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#ff6b00]/10 rounded-lg">
                            <Wallet className="w-5 h-5 text-[#ff6b00]" />
                        </div>
                        <div>
                            <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Rincian Gaji</h3>
                            <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {isProcessed ? (status === 'Akumulasi' ? 'Akumulasi semua periode' : 'Payroll sudah diproses') : 'Perkiraan gaji periode ini'}
                            </p>
                        </div>
                    </div>

                    {periods.length > 0 && (
                        <div className="relative">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className={`appearance-none px-3 py-1.5 pr-8 rounded-lg border text-xs font-medium outline-none cursor-pointer ${isDark ? 'bg-[#1e293b] border-[#334155] text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                            >
                                {periods.map(p => (
                                    <option key={p} value={p}>
                                        {p === 'all' ? 'Semua Periode' : p}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            {loading ? (
                <div className="p-6 flex justify-center">
                    <div className="w-6 h-6 border-2 border-[#ff6b00] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : !hasData ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${isDark ? 'bg-[#2a3547]' : 'bg-gray-50'}`}>
                        <Wallet className={`w-7 h-7 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Ringkasan Payroll Belum Tersedia
                    </h4>
                    <p className={`text-xs max-w-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Data rincian gaji akan muncul setelah payroll periode ini diproses oleh HR.
                    </p>
                </div>
            ) : (
                <div className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {items.map((item, i) => {
                            const isNegative = ['Potongan', 'PPh 21'].includes(item.label);
                            const isHighlight = item.label === 'Gaji Pokok';
                            return (
                                <div key={i} className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${isDark ? 'bg-[#1e293b] border-[#2d3748] hover:border-[#ff6b00]/30' : 'bg-gray-50 border-gray-100 hover:border-[#ff6b00]/30'}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                        <p className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</p>
                                    </div>
                                    <p className={`text-lg font-bold ${isNegative ? 'text-red-500' : isHighlight ? 'text-[#ff6b00]' : isDark ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        {isNegative ? <ArrowDownRight className="w-3 h-3 text-red-500" /> : <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
                                        <span className={`text-[10px] font-medium ${isNegative ? 'text-red-500' : 'text-emerald-500'}`}>{isNegative ? 'Pengurang' : 'Penambah'}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className={`border-t my-6 ${isDark ? 'border-gray-800' : 'border-gray-100'}`} />

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-start gap-2">
                            <Info className={`w-4 h-4 mt-0.5 shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                            <p className={`text-xs leading-relaxed max-w-md ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{footerNote}</p>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Gaji Bersih</p>
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-extrabold text-[#ff6b00]">{grandTotal}</p>
                                {isProcessed && (
                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded border border-emerald-500/20">
                                        {status === 'Akumulasi' ? 'TOTAL' : 'NET'}
                                    </span>
                                )}
                            </div>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {totalIncome > 0 && `Penghasilan: ${formatRupiah(totalIncome)} • `}
                                {totalDeductions > 0 && `Potongan: ${formatRupiah(totalDeductions)}`}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayrollSummary;