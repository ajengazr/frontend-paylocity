import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { X, Loader2, Eye, Wallet, FileText, ChevronDown, ChevronUp, Printer } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import payslipApi from '../../config/payslipApi';
import { staggerContainer } from '../../animations/variants';

const sectionVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: (i) => ({ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { duration: 0.4, delay: i * 0.08, ease: 'easeOut' }
    })
};

const expandVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
        height: 'auto', 
        opacity: 1,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
    },
    exit: { 
        height: 0, 
        opacity: 0,
        transition: { duration: 0.3, ease: 'easeInOut' }
    }
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
    },
    exit: { 
        opacity: 0, 
        scale: 0.95, 
        y: 20,
        transition: { duration: 0.2 }
    }
};

const MyPayslip = () => {
    const { isDark } = useTheme();
    const { addToast } = useToast();
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedPayslip, setSelectedPayslip] = useState(null);
    const printRef = useRef(null);

    const cardBg = isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100';

    useEffect(() => {
        const fetchMyPayslips = async () => {
            try {
                setLoading(true);
                const res = await payslipApi.getMyPayslips();
                const list = res.data?.data || res.data || [];
                setPayslips(list);
            } catch (err) {
                console.error('Payslip fetch error:', err);
                const msg = err?.response?.data?.errors 
                         || err?.response?.data?.message 
                         || 'Gagal memuat slip gaji';
                addToast(msg, 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchMyPayslips();
    }, [addToast]);

    const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

    const openDetail = (slip) => {
        setSelectedPayslip(slip);
        setIsDetailOpen(true);
    };

    const handleExportPDF = () => {
        if (!selectedPayslip) return;
        window.print();
    };

    const formatRupiah = (val) => {
        if (val === undefined || val === null) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
    };

    const formatPeriod = (period) => {
        if (!period) return '-';
        const [year, month] = period.split('-');
        return new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    };

    const formatDate = (val) => {
        if (!val) return '-';
        return new Date(val).toLocaleDateString('id-ID');
    };

    if (loading) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
            >
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-[#ff6b00]" />
                <p className="text-xs sm:text-sm text-gray-400 mt-3">Memuat slip gaji...</p>
            </motion.div>
        );
    }

    return (
        <motion.div 
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Header */}
            <motion.div 
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4"
            >
                <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">Slip Gaji Saya</h2>
                    <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Lihat rincian gaji dan lembur per periode
                    </p>
                </div>
            </motion.div>

            {/* Payslip List */}
            <motion.div 
                className="space-y-3 sm:space-y-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {payslips.length > 0 ? (
                        payslips.map((slip, idx) => (
                            <motion.div 
                                key={slip.id} 
                                custom={idx}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
                                className={`rounded-xl border shadow-sm overflow-hidden ${cardBg}`}
                            >
                                <div className="p-3 sm:p-4 lg:p-5">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#ff6b00]/10 flex items-center justify-center text-[#ff6b00]">
                                                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xs sm:text-sm lg:text-base">
                                                    Periode {formatPeriod(slip.payroll?.period)}
                                                </h3>
                                                <p className="text-[10px] sm:text-xs text-gray-400">
                                                    {formatDate(slip.payroll?.startPeriod)} - {formatDate(slip.payroll?.endPeriod)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                            <div className="text-right">
                                                <p className="text-[10px] sm:text-xs text-gray-400">Gaji Bersih</p>
                                                <p className="font-bold text-base sm:text-lg text-[#ff6b00]">{formatRupiah(slip.netSalary)}</p>
                                            </div>
                                            <motion.button 
                                                onClick={() => toggleExpand(slip.id)}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-[#ff6b00]"
                                            >
                                                {expandedId === slip.id ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedId === slip.id && (
                                        <motion.div
                                            variants={expandVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            style={{ overflow: 'hidden' }}
                                            className={`px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4 lg:pb-5 ${isDark ? 'bg-[#151c27]' : 'bg-gray-50'}`}
                                        >
                                            <div className={`border-t pt-3 sm:pt-4 ${isDark ? 'border-[#2d3748]' : 'border-gray-200'}`}>
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: 0.1 }}
                                                    className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4"
                                                >
                                                    {[
                                                        { label: 'Gaji Pokok', val: slip.basicSalary },
                                                        { label: 'Lembur', val: slip.overtimePay, color: 'text-emerald-600' },
                                                        { label: 'Potongan', val: slip.totalDeductions, color: 'text-red-500' },
                                                        { label: 'Penghasilan', val: slip.totalEarnings, color: 'text-emerald-600' },
                                                    ].map((item, i) => (
                                                        <motion.div 
                                                            key={i} 
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                                                            className={`p-2 sm:p-3 rounded-lg ${isDark ? 'bg-[#1e293b]' : 'bg-white'}`}
                                                        >
                                                            <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-bold">{item.label}</p>
                                                            <p className={`font-semibold text-xs sm:text-sm mt-1 ${item.color || ''}`}>{formatRupiah(item.val)}</p>
                                                        </motion.div>
                                                    ))}
                                                </motion.div>
                                                <motion.button 
                                                    onClick={() => openDetail(slip)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full py-2 sm:py-2.5 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-medium rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    Lihat Detail Lengkap
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-6 sm:p-8 rounded-xl border shadow-sm text-center ${cardBg}`}
                        >
                            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-xs sm:text-sm text-gray-400">Belum ada slip gaji</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Modal Detail */}
            <AnimatePresence>
                {isDetailOpen && selectedPayslip && (
                    <motion.div 
                        className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm print-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            ref={printRef}
                            id="payslip-print-area"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className={`w-full max-w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border shadow-xl p-4 sm:p-6 ${isDark ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-white border-gray-100 text-[#151c27]'}`}
                        >
                            <div className="flex items-center justify-between mb-4 sm:mb-6 no-print">
                                <h3 className="text-base sm:text-lg font-bold">Detail Slip Gaji</h3>
                                <div className="flex items-center gap-2">
                                    <motion.button 
                                        onClick={handleExportPDF}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-1.5 sm:p-2 bg-[#ff6b00] hover:bg-[#e05e00] text-white rounded-lg transition-colors"
                                        title="Export PDF"
                                    >
                                        <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </motion.button>
                                    <motion.button 
                                        onClick={() => { setIsDetailOpen(false); setSelectedPayslip(null); }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-1 rounded-md hover:bg-black/5 transition-colors"
                                    >
                                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-5 print-content">
                                <div className="text-center border-b-2 border-[#ff6b00] pb-3 sm:pb-4 mb-3 sm:mb-4">
                                    <h1 className="text-lg sm:text-xl font-bold text-[#ff6b00]">PAYLOCITY</h1>
                                    <p className="text-[10px] sm:text-xs text-gray-500">HRIS Payroll System</p>
                                    <p className="text-[10px] sm:text-xs text-gray-500">Slip Gaji Karyawan</p>
                                </div>

                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#ff6b00]/10 flex items-center justify-center text-[#ff6b00] font-bold text-base sm:text-lg">
                                        {(selectedPayslip.employee?.user?.username || '?')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm sm:text-base">
                                            {selectedPayslip.employee?.user?.username || '-'}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-400">{selectedPayslip.employee?.nik || '-'}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-400">
                                            {selectedPayslip.employee?.department?.name || '-'} • {selectedPayslip.employee?.position?.name || '-'}
                                        </p>
                                    </div>
                                </div>

                                <div className={`border-t ${isDark ? 'border-[#334155]' : 'border-gray-200'}`} />

                                <div className="flex items-center justify-between text-xs sm:text-sm">
                                    <span className="text-gray-500">Periode</span>
                                    <span className="font-semibold">{formatPeriod(selectedPayslip.payroll?.period)}</span>
                                </div>

                                <div className={`border-t ${isDark ? 'border-[#334155]' : 'border-gray-200'}`} />

                                <div className="space-y-2 sm:space-y-3">
                                    <h5 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500">Penghasilan</h5>
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-gray-500">Gaji Pokok</span>
                                        <span className="font-medium">{formatRupiah(selectedPayslip.basicSalary)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-gray-500">Lembur</span>
                                        <span className="font-medium text-emerald-600">+ {formatRupiah(selectedPayslip.overtimePay)}</span>
                                    </div>
                                    <div className={`flex justify-between text-xs sm:text-sm font-semibold pt-2 border-t ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
                                        <span>Total Penghasilan</span>
                                        <span className="text-emerald-600">{formatRupiah(selectedPayslip.totalEarnings)}</span>
                                    </div>
                                </div>

                                <div className={`border-t ${isDark ? 'border-[#334155]' : 'border-gray-200'}`} />

                                <div className="space-y-2 sm:space-y-3">
                                    <h5 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500">Potongan</h5>
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-gray-500">BPJS Kesehatan (1%)</span>
                                        <span className="font-medium text-red-500">- {formatRupiah(selectedPayslip.bpjsKesehatan)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-gray-500">BPJS Ketenagakerjaan (2%)</span>
                                        <span className="font-medium text-red-500">- {formatRupiah(selectedPayslip.bpjsKerja)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-gray-500">JHT (2%)</span>
                                        <span className="font-medium text-red-500">- {formatRupiah(selectedPayslip.jht || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-gray-500">PPh 21 TER</span>
                                        <span className="font-medium text-red-500">- {formatRupiah(selectedPayslip.pph21)}</span>
                                    </div>
                                    <div className={`flex justify-between text-xs sm:text-sm font-semibold pt-2 border-t ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
                                        <span>Total Potongan</span>
                                        <span className="text-red-500">{formatRupiah(selectedPayslip.totalDeductions)}</span>
                                    </div>
                                </div>

                                <div className={`border-t ${isDark ? 'border-[#334155]' : 'border-gray-200'}`} />

                                <div className="flex justify-between items-center p-3 sm:p-4 rounded-lg bg-[#ff6b00]/10 border border-[#ff6b00]/20">
                                    <span className="font-bold text-xs sm:text-sm">Gaji Bersih</span>
                                    <span className="font-bold text-lg sm:text-xl text-[#ff6b00]">{formatRupiah(selectedPayslip.netSalary)}</span>
                                </div>

                                <div className="text-center text-[9px] sm:text-[10px] text-gray-400 pt-3 sm:pt-4 border-t border-gray-200/20">
                                    <p>Slip gaji ini digenerate secara otomatis oleh sistem Paylocity.</p>
                                    <p>Untuk pertanyaan, hubungi HRD.</p>
                                </div>

                                <div className="flex justify-end pt-3 sm:pt-4 no-print">
                                    <motion.button 
                                        onClick={() => { setIsDetailOpen(false); setSelectedPayslip(null); }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${isDark ? 'border-[#334155] text-gray-300 hover:bg-[#2a3547]' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        Tutup
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #payslip-print-area, #payslip-print-area * { visibility: visible; }
                    #payslip-print-area {
                        position: absolute; left: 0; top: 0; width: 100%;
                        max-height: none; overflow: visible;
                        background: white !important; color: black !important;
                        border: none !important; box-shadow: none !important;
                    }
                    .no-print { display: none !important; }
                    .print-modal-overlay {
                        background: white !important;
                        position: static !important; padding: 0 !important;
                    }
                }
            `}</style>
        </motion.div>
    );
};

export default MyPayslip;