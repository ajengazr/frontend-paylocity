/* eslint-disable react-hooks/static-components */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Plus, X, Loader2, Eye, ChevronDown, ChevronUp,
  Calendar, Users, Wallet, ArrowDownRight, ArrowUpRight,
  ChevronLeft, ChevronRight, ArrowUp, ArrowDown
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import payrollApi from '../../config/payrollApi';
import payslipApi from '../../config/payslipApi';

const sectionVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
};

const rowVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { duration: 0.35, delay: i * 0.05, ease: 'easeOut' } })
};

const expandVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 13, mass: 0.8 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

const PayrollCrud = ({ role }) => {
  const { isDark } = useTheme();
  const { addToast } = useToast();
  const isAdmin = role === 'HR_ADMIN' || role === 'SUPER_ADMIN';

  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedPeriod, setExpandedPeriod] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [loadingPayslips, setLoadingPayslips] = useState(false);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [periodInput, setPeriodInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const cardBg = isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100';
  const inputBg = isDark ? 'bg-[#151c27] border-[#334155] text-white' : 'bg-[#f9fafb] border-gray-200 text-[#111827]';

  const fetchPayrolls = useCallback(async () => {
    try {
      setLoading(true);
      let data;
      if (isAdmin) {
        const res = await payrollApi.getAll();
        // Response: { success: true, data: [...] }
        data = res.data?.data || [];
      } else {
        const res = await payslipApi.getMyPayslips();
        // Response: { success: true, data: { data: [...], pagination: {...} } }
        const slips = res.data?.data?.data || res.data?.data || [];
        const periods = [...new Set(slips.map(s => s.payroll?.period).filter(Boolean))];
        data = periods.map(p => ({ period: p, status: 'PROCESSED', payslipsCount: slips.filter(s => s.payroll?.period === p).length }));
      }
      setPayrolls(data);
    } catch (err) {
      addToast(err.response?.data?.errors || 'Gagal memuat data payroll', 'error');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, addToast]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchPayrolls(); }, [fetchPayrolls]);

  const togglePayslips = async (period) => {
    if (expandedPeriod === period) {
      setExpandedPeriod(null);
      setPayslips([]);
      return;
    }
    try {
      setLoadingPayslips(true);
      setExpandedPeriod(period);
      let data;
      if (isAdmin) {
        const res = await payrollApi.getByPeriod(period);
        data = res.data?.data?.payslips || [];
      } else {
        const res = await payslipApi.getMyPayslips();
        const slips = res.data?.data?.data || res.data?.data || [];
        data = slips.filter(p => p.payroll?.period === period);
      }
      setPayslips(data);
    } catch (err) {
      console.error(err);
      addToast('Gagal memuat payslips', 'error');
    } finally {
      setLoadingPayslips(false);
    }
  };

  const handleProcessPayroll = async (e) => {
    e.preventDefault();
    if (!periodInput) return;
    try {
      setProcessing(true);
      await payrollApi.create({ period: periodInput });
      addToast('Payroll berhasil diproses!', 'success');
      setIsProcessOpen(false);
      setPeriodInput('');
      fetchPayrolls();
    } catch (err) {
      addToast(err.response?.data?.errors || 'Gagal memproses payroll', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const openDetail = (payslip) => {
    setSelectedPayslip(payslip);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedPayslip(null);
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

  const handleSort = (key) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
    setCurrentPage(1);
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ArrowUp className="w-3 h-3 ml-1 text-gray-400 opacity-0 group-hover:opacity-50 transition-opacity" />;
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 text-[#ff6b00]" /> : <ArrowDown className="w-3 h-3 ml-1 text-[#ff6b00]" />;
  };

  const sortedPayrolls = [...payrolls].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aVal, bVal;
    switch (sortConfig.key) {
      case 'period': aVal = a.period || ''; bVal = b.period || ''; break;
      case 'status': aVal = a.status || ''; bVal = b.status || ''; break;
      case 'count': aVal = (a.payslips?.length || a.payslipsCount || 0); bVal = (b.payslips?.length || b.payslipsCount || 0); break;
      case 'totalNet': aVal = isAdmin ? (a.payslips || []).reduce((sum, s) => sum + parseFloat(s.netSalary || 0), 0) : 0; bVal = isAdmin ? (b.payslips || []).reduce((sum, s) => sum + parseFloat(s.netSalary || 0), 0) : 0; break;
      case 'date': aVal = new Date(a.processedAt || a.createdAt || 0).getTime(); bVal = new Date(b.processedAt || b.createdAt || 0).getTime(); break;
      default: return 0;
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    const aStr = String(aVal).toLowerCase(); const bStr = String(bVal).toLowerCase();
    if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedPayrolls.length / itemsPerPage) || 1;
  const paginatedPayrolls = sortedPayrolls.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const getPageRange = () => { const range = []; const start = Math.max(1, currentPage - 2); const end = Math.min(totalPages, currentPage + 2); for (let i = start; i <= end; i++) range.push(i); return range; };

  return (
    <motion.div className="space-y-4 sm:space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">Penggajian</h2>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {isAdmin ? 'Kelola payroll dan payslip karyawan' : 'Lihat slip gaji Anda'}
          </p>
        </div>
        {isAdmin && (
          <motion.button onClick={() => setIsProcessOpen(true)} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-medium rounded-lg shadow-sm flex items-center gap-2 transition-all text-xs sm:text-sm">
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Proses Payroll</span>
            <span className="sm:hidden">Proses</span>
          </motion.button>
        )}
      </motion.div>

      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className={`rounded-xl border shadow-sm overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`border-b text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase ${isDark ? 'border-[#2d3748] text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                <th onClick={() => handleSort('period')} className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 cursor-pointer group select-none hover:text-[#ff6b00] transition-colors">
                  <div className="flex items-center"><span className="hidden sm:inline">Periode</span><span className="sm:hidden">Per.</span><SortIcon columnKey="period" /></div>
                </th>
                <th onClick={() => handleSort('status')} className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 cursor-pointer group select-none hover:text-[#ff6b00] transition-colors">
                  <div className="flex items-center">
                    <SortIcon columnKey="status" /><span className="ml-1">Status</span>
                  </div>
                </th>
                <th onClick={() => handleSort('count')} className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 cursor-pointer group select-none hover:text-[#ff6b00] transition-colors">
                  <div className="flex items-center"><span className="hidden sm:inline">Jumlah</span><span className="sm:hidden">Jml</span><SortIcon columnKey="count" /></div>
                </th>
                <th onClick={() => handleSort('totalNet')} className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 cursor-pointer group select-none hover:text-[#ff6b00] transition-colors">
                  <div className="flex items-center"><span className="hidden sm:inline">Total Net</span><span className="sm:hidden">Net</span><SortIcon columnKey="totalNet" /></div>
                </th>
                <th onClick={() => handleSort('date')} className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 cursor-pointer group select-none hover:text-[#ff6b00] transition-colors hidden sm:table-cell">
                  <div className="flex items-center">Tanggal
                    <SortIcon columnKey="date" />
                  </div>
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-right">Aksi</th>
              </tr>
            </thead>

            {loading && <tbody className="text-xs sm:text-sm"><tr><td colSpan={6} className="text-center py-6 sm:py-8"><Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mx-auto text-[#ff6b00]" /></td></tr></tbody>}
            {!loading && paginatedPayrolls.length === 0 && <tbody className="text-xs sm:text-sm"><tr><td colSpan={6} className="text-center py-6 sm:py-8 text-gray-400 text-xs">Tidak ada data payroll</td></tr></tbody>}

            {!loading && paginatedPayrolls.map((payroll, idx) => {
              const totalNet = isAdmin ? (payroll.payslips || []).reduce((sum, s) => sum + parseFloat(s.netSalary || 0), 0) : 0;
              const isExpanded = expandedPeriod === payroll.period;
              return (
                <motion.tbody key={payroll.period} custom={idx} variants={rowVariants} initial="hidden" animate="visible" className="divide-y divide-gray-100/10 text-xs sm:text-sm">
                  <tr className="hover:bg-gray-500/5 transition-colors">
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5 sm:gap-2"><Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff6b00]" />{formatPeriod(payroll.period)}</div>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
                      <span className={`inline-flex px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium ${payroll.status === 'PROCESSED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {payroll.status === 'PROCESSED' ? 'Diproses' : payroll.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
                      <div className="flex items-center gap-1.5 sm:gap-2"><Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />{isAdmin ? (payroll.payslips?.length || payroll.payslipsCount || 0) : '-'}</div>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 font-semibold">{isAdmin ? formatRupiah(totalNet) : '-'}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-gray-500 hidden sm:table-cell">{formatDate(payroll.processedAt || payroll.createdAt)}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
                      <div className="flex items-center justify-end gap-1">
                        <motion.button onClick={() => togglePayslips(payroll.period)} whileTap={{ scale: 0.9 }} className={`p-1 sm:p-1.5 rounded-md transition-colors ${isExpanded ? 'text-[#ff6b00] bg-[#ff6b00]/10' : 'text-gray-400 hover:text-[#ff6b00] hover:bg-gray-100'}`} title="Lihat Payslips">
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        </motion.button>
                      </div>
                    </td>
                  </tr>

                  <AnimatePresence>
                    {isExpanded && (
                      <tr className={`${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
                        <td colSpan={6} className="p-0">
                          <motion.div variants={expandVariants} initial="hidden" animate="visible" exit="exit" style={{ overflow: 'hidden' }}>
                            <div className="p-3 sm:p-4 lg:p-6">
                              {loadingPayslips && <div className="flex items-center justify-center py-4 sm:py-6"><Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#ff6b00]" /></div>}
                              {!loadingPayslips && payslips.length === 0 && <div className="text-center py-4 sm:py-6 text-xs text-gray-400">Tidak ada payslip untuk periode ini</div>}
                              {!loadingPayslips && payslips.length > 0 && (
                                <div className={`rounded-lg border overflow-hidden ${isDark ? 'border-[#1e293b]' : 'border-gray-200'}`}>
                                  <table className="w-full text-left text-xs sm:text-sm">
                                    <thead>
                                      <tr className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'bg-[#151c27] text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3">No</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3">Karyawan</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-right">Gaji Bersih</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">Aksi</th>
                                      </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDark ? 'divide-[#1e293b]' : 'divide-gray-200'}`}>
                                      {payslips.map((slip, sIdx) => (
                                        <motion.tr key={slip.id || sIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: sIdx * 0.05 }} className="hover:bg-gray-500/5 transition-colors">
                                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-500">{sIdx + 1}</td>
                                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#ff6b00]/10 flex items-center justify-center text-[#ff6b00] font-bold text-[10px] sm:text-xs shrink-0">
                                                {(slip.employee?.user?.username || slip.employee?.username || '?')[0].toUpperCase()}
                                              </div>
                                              <div>
                                                <p className="font-medium text-xs sm:text-sm">{slip.employee?.user?.username || slip.employee?.username || '-'}</p>
                                                <p className="text-[9px] sm:text-[10px] text-gray-400">{slip.employee?.nik || '-'} • {slip.employee?.department?.name || '-'}</p>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-right font-bold text-[#ff6b00] text-xs sm:text-sm">{formatRupiah(slip.netSalary)}</td>
                                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                            <motion.button onClick={() => openDetail(slip)} whileTap={{ scale: 0.9 }} className="p-1 sm:p-1.5 rounded-md transition-colors text-gray-400 hover:text-[#ff6b00] hover:bg-[#ff6b00]/10" title="Lihat Detail">
                                              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            </motion.button>
                                          </td>
                                        </motion.tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </motion.tbody>
              );
            })}
          </table>
        </div>

        {!loading && sortedPayrolls.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className={`flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border-t ${isDark ? 'border-[#2d3748]' : 'border-gray-200'}`}>
            <div className="text-[10px] sm:text-xs text-gray-400">
              Menampilkan {paginatedPayrolls.length} dari {sortedPayrolls.length} periode{totalPages > 1 && ` • Hal ${currentPage}/${totalPages}`}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className={`px-2 py-1 sm:py-1.5 rounded-lg border text-[10px] sm:text-xs ${inputBg}`}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              <motion.button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} whileTap={{ scale: 0.9 }} className="p-1 sm:p-1.5 rounded-lg border transition-all disabled:opacity-40">
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </motion.button>
              {getPageRange().map(page => (
                <motion.button key={page} onClick={() => setCurrentPage(page)} whileTap={{ scale: 0.9 }} className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${currentPage === page ? 'bg-[#ff6b00] text-white' : isDark ? 'hover:bg-[#2a3547] text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
                  {page}
                </motion.button>
              ))}
              <motion.button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} whileTap={{ scale: 0.9 }} className="p-1 sm:p-1.5 rounded-lg border transition-all disabled:opacity-40">
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Modal Proses Payroll */}
      <AnimatePresence>
        {isProcessOpen && (
          <motion.div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className={`w-full max-w-[95%] sm:max-w-sm rounded-2xl border shadow-xl p-4 sm:p-6 ${isDark ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-white border-gray-100 text-[#151c27]'}`}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-bold">Proses Payroll</h3>
                <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setIsProcessOpen(false)} className="p-1.5 rounded-md hover:bg-black/5 transition-colors">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>
              <form onSubmit={handleProcessPayroll} className="space-y-3 sm:space-y-4">
                <div>
                  <label htmlFor="periodInput" className="text-[10px] sm:text-xs font-semibold mb-1 block">Periode (YYYY-MM)</label>
                  <input id="periodInput" type="text" placeholder="Contoh: 2026-06" value={periodInput} onChange={e => setPeriodInput(e.target.value)} required pattern="\d{4}-\d{2}" className={`w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 ${inputBg}`} />
                  <p className="text-[10px] text-gray-400 mt-1">Format: Tahun-Bulan (misal 2026-06)</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg text-[10px] sm:text-xs ${isDark ? 'bg-[#0f172a] text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                  <p>• Akan memproses semua karyawan ACTIVE</p>
                  <p>• Periode: tanggal 28 bulan lalu s/d 27 bulan ini</p>
                  <p>• Lembur APPROVED dalam periode akan otomatis masuk</p>
                </div>
                <div className="flex justify-end gap-2 sm:gap-3 pt-2">
                  <motion.button type="button" onClick={() => setIsProcessOpen(false)} whileTap={{ scale: 0.95 }} className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${isDark ? 'border-[#334155] text-gray-300 hover:bg-[#2a3547]' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                    Batal
                  </motion.button>
                  <motion.button type="submit" disabled={processing} whileTap={{ scale: 0.95 }} className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-semibold rounded-lg text-xs sm:text-sm transition-all disabled:opacity-60 flex items-center gap-2">
                    {processing && <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />}
                    {processing ? 'Memproses...' : 'Proses'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Detail Payslip */}
      <AnimatePresence>
        {isDetailOpen && selectedPayslip && (
          <motion.div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className={`w-full max-w-[95%] sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border shadow-xl p-4 sm:p-6 ${isDark ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-white border-gray-100 text-[#151c27]'}`}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-bold">Detail Payslip</h3>
                <motion.button onClick={closeDetail} whileTap={{ scale: 0.9 }} className="p-1 rounded-md hover:bg-black/5 transition-colors">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="text-center border-b-2 border-[#ff6b00] pb-3 sm:pb-4 mb-3 sm:mb-4">
                  <h1 className="text-lg sm:text-xl font-bold text-[#ff6b00]">PAYLOCITY</h1>
                  <p className="text-[10px] sm:text-xs text-gray-500">HRIS Payroll System</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Slip Gaji Karyawan</p>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#ff6b00]/10 flex items-center justify-center text-[#ff6b00] font-bold text-base sm:text-lg">
                    {(selectedPayslip.employee?.user?.username || selectedPayslip.employee?.username || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">{selectedPayslip.employee?.user?.username || selectedPayslip.employee?.username || '-'}</h4>
                    <p className="text-xs sm:text-sm text-gray-400">{selectedPayslip.employee?.nik || '-'}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400">{selectedPayslip.employee?.department?.name || '-'} • {selectedPayslip.employee?.position?.name || '-'}</p>
                  </div>
                </div>

                <div className={`border-t ${isDark ? 'border-[#334155]' : 'border-gray-200'}`} />

                {/* Periode & PTKP */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] sm:text-xs text-gray-400">Periode Payroll</span>
                    <span className="font-semibold text-xs sm:text-sm">
                      {formatPeriod(selectedPayslip.payroll?.period || expandedPeriod)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] sm:text-xs text-gray-400">Status PTKP</span>
                    <span className="font-semibold text-xs sm:text-sm">
                      {selectedPayslip.employee?.taxStatus?.toUpperCase() || '-'}
                    </span>
                  </div>
                </div>

                <div className={`border-t ${isDark ? 'border-[#334155]' : 'border-gray-200'}`} />

                {/* Penghasilan */}
                <div className="space-y-2 sm:space-y-3">
                  <h5 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500">Penghasilan</h5>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Gaji Pokok</span>
                    <span className="font-medium">{formatRupiah(selectedPayslip.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Lembur</span>
                    <span className="font-medium text-emerald-600 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" /> + {formatRupiah(selectedPayslip.overtimePay)}
                    </span>
                  </div>
                  <div className={`flex justify-between text-xs sm:text-sm font-semibold pt-2 border-t ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
                    <span>Total Penghasilan</span>
                    <span className="text-emerald-600">{formatRupiah(selectedPayslip.totalEarnings)}</span>
                  </div>
                </div>

                <div className={`border-t ${isDark ? 'border-[#334155]' : 'border-gray-200'}`} />

                {/* Potongan */}
                <div className="space-y-2 sm:space-y-3">
                  <h5 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500">Potongan</h5>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">BPJS Kesehatan (1%)</span>
                    <span className="font-medium text-red-500 flex items-center gap-1">
                      <ArrowDownRight className="w-3 h-3" /> - {formatRupiah(selectedPayslip.bpjsKesehatan)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">BPJS Ketenagakerjaan (2%)</span>
                    <span className="font-medium text-red-500 flex items-center gap-1">
                      <ArrowDownRight className="w-3 h-3" /> - {formatRupiah(selectedPayslip.bpjsKerja)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">JHT (2%)</span>
                    <span className="font-medium text-red-500 flex items-center gap-1">
                      <ArrowDownRight className="w-3 h-3" /> - {formatRupiah(selectedPayslip.jht || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">PPh 21 TER</span>
                    <span className="font-medium text-red-500 flex items-center gap-1">
                      <ArrowDownRight className="w-3 h-3" /> - {formatRupiah(selectedPayslip.pph21)}
                    </span>
                  </div>
                  <div className={`flex justify-between text-xs sm:text-sm font-semibold pt-2 border-t ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
                    <span>Total Potongan</span>
                    <span className="text-red-500">{formatRupiah(selectedPayslip.totalDeductions)}</span>
                  </div>
                </div>

                <div className={`border-t ${isDark ? 'border-[#334155]' : 'border-gray-200'}`} />

                {/* Gaji Bersih */}
                <div className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-[#ff6b00]/10 border border-[#ff6b00]/20">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff6b00]" />
                    <span className="font-bold text-xs sm:text-sm">Gaji Bersih</span>
                  </div>
                  <span className="font-bold text-lg sm:text-xl text-[#ff6b00]">{formatRupiah(selectedPayslip.netSalary)}</span>
                </div>

                <div className="text-center text-[9px] sm:text-[10px] text-gray-400 pt-3 sm:pt-4 border-t border-gray-200/20">
                  <p>Slip gaji ini digenerate secara otomatis oleh sistem Paylocity.</p>
                  <p>Untuk pertanyaan, hubungi HRD.</p>
                </div>

                <div className="flex justify-end pt-3 sm:pt-4">
                  <motion.button onClick={closeDetail} whileTap={{ scale: 0.95 }} className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${isDark ? 'border-[#334155] text-gray-300 hover:bg-[#2a3547]' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                    Tutup
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PayrollCrud;