import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import {
  Wallet, Clock, Users, BarChart3, Search,
  Loader2, Download
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import reportApi from '../../config/reportApi';
import departmentApi from '../../config/departmentApi';
import PayrollReportPDF from './PayrollReportPDF';
import OvertimeReportPDF from './OvertimeReportPDF';
import EmployeeReportPDF from './EmployeeReportPDF';
import { fadeInUp, staggerContainer, staggerItem } from '../../animations/variants';

// Fallback variants (compatible dengan format hidden/visible dari variants.js)
const sectionVariants = fadeInUp || {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
};

const cardVariants = staggerItem || {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } }
};

const tabContentVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] } },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2 } }
};

const barVariants = {
  hidden: { height: 0 },
  visible: (heightPct) => ({
    height: `${heightPct}%`,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  })
};

const formatRupiah = (val) => {
  if (val === undefined || val === null) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const formatDate = (val) => {
  if (!val) return '-';
  return new Date(val).toLocaleDateString('id-ID');
};

const TABS = [
  { key: 'payroll', label: 'Penggajian', icon: Wallet },
  { key: 'overtime', label: 'Lembur', icon: Clock },
  { key: 'employee', label: 'Karyawan', icon: Users },
  { key: 'annual', label: 'Rekap Tahunan', icon: BarChart3 },
];

const LaporanCrud = ({ role }) => {
  const { isDark } = useTheme();
  const { addToast } = useToast();
  const isSuperAdmin = role === 'SUPER_ADMIN';

  const [activeTab, setActiveTab] = useState('payroll');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const [period, setPeriod] = useState('');
  const [status, setStatus] = useState('ALL');
  const [departmentId, setDepartmentId] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [departments, setDepartments] = useState([]);

  const cardBg = isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100';
  const inputBg = isDark ? 'bg-[#151c27] border-[#334155] text-white' : 'bg-[#f9fafb] border-gray-200 text-[#111827]';

  useEffect(() => {
    if (activeTab === 'employee') {
      departmentApi.getAll()
        .then(res => {
          const list = res.data?.data || res.data || [];
          setDepartments(Array.isArray(list) ? list : []);
        })
        .catch(() => setDepartments([]));
    }
  }, [activeTab]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(null);
  }, [activeTab]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let res;

      if (activeTab === 'payroll') {
        if (!period) {
          addToast('Masukkan periode (YYYY-MM)', 'error');
          setLoading(false);
          return;
        }
        res = await reportApi.getPayrollReport(period);
      } else if (activeTab === 'overtime') {
        if (!period) {
          addToast('Masukkan periode (YYYY-MM)', 'error');
          setLoading(false);
          return;
        }
        res = await reportApi.getOvertimeReport(period, status);
      } else if (activeTab === 'employee') {
        const params = {};
        if (departmentId) params.department = departmentId;
        if (status !== 'ALL') params.status = status;
        res = await reportApi.getEmployeeReport(params);
      } else if (activeTab === 'annual') {
        if (!isSuperAdmin) {
          addToast('Akses ditolak', 'error');
          setLoading(false);
          return;
        }
        res = await reportApi.getAnnualReport(year);
      }

      setData(res.data?.data || null);
    } catch (err) {
      const msg = err.response?.data?.errors || err.response?.data?.errors || 'Gagal memuat laporan';
      addToast(msg, 'error');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [activeTab, period, status, departmentId, year, isSuperAdmin, addToast]);

  const renderSummaryCards = () => {
    if (!data?.summary) return null;

    const cards = [];
    if (activeTab === 'payroll') {
      const s = data.summary;
      cards.push(
        { label: 'Karyawan Digaji', value: s.totalEmployees ?? 0, color: 'text-blue-500' },
        { label: 'Gaji Pokok', value: formatRupiah(s.totalBasicSalary), color: 'text-[#ff6b00]' },
        { label: 'Tunjangan Lembur', value: formatRupiah(s.totalOvertimePay), color: 'text-emerald-500' },
        { label: 'Potongan BPJS', value: formatRupiah(s.totalBpjsDeductions), color: 'text-amber-500' },
        { label: 'PPh 21', value: formatRupiah(s.totalPph21), color: 'text-red-500' },
        { label: 'Gaji Bersih', value: formatRupiah(s.totalNetSalary), color: 'text-[#ff6b00]' },
      );
    } else if (activeTab === 'overtime') {
      const s = data.summary || {};
      cards.push(
        { label: 'Total Pengajuan', value: s.totalRequests ?? 0, color: 'text-blue-500' },
        { label: 'Jam Approved', value: `${(s.totalApprovedHours ?? 0).toFixed(2)} jam`, color: 'text-emerald-500' },
        { label: 'Biaya Approved', value: formatRupiah(s.totalApprovedCost), color: 'text-[#ff6b00]' },
        { label: 'Pending', value: s.countByStatus?.PENDING ?? 0, color: 'text-amber-500' },
        { label: 'Approved', value: s.countByStatus?.APPROVED ?? 0, color: 'text-emerald-500' },
        { label: 'Rejected', value: s.countByStatus?.REJECTED ?? 0, color: 'text-red-500' },
      );
    } else if (activeTab === 'employee') {
      const s = data.summary || {};
      cards.push({ label: 'Total Karyawan', value: s.totalEmployees ?? 0, color: 'text-blue-500' });
      Object.entries(s.byDepartment || {}).forEach(([dept, count]) => {
        cards.push({ label: dept, value: count, color: 'text-[#ff6b00]' });
      });
    } else if (activeTab === 'annual') {
      const s = data.summary || {};
      cards.push(
        { label: 'Total Pengeluaran', value: formatRupiah(s.totalPayrollExpense), color: 'text-[#ff6b00]' },
        { label: 'Total Lembur', value: formatRupiah(s.totalOvertimeExpense), color: 'text-emerald-500' },
        { label: 'Rata-rata/Bulan', value: formatRupiah(s.averageMonthlyPayroll), color: 'text-blue-500' },
        { label: 'Periode Diproses', value: s.processedPeriods ?? 0, color: 'text-amber-500' },
      );
    }

    return (
      <motion.div
        variants={staggerContainer || { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6"
      >
        {cards.map((c, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
            className={`p-3 sm:p-4 rounded-xl border shadow-sm ${cardBg}`}
          >
            <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">{c.label}</p>
            <p className={`text-sm sm:text-lg font-bold ${c.color} truncate`}>{c.value}</p>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderFilters = () => {
    return (
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className={`p-3 sm:p-4 lg:p-5 rounded-xl border shadow-sm mb-4 sm:mb-6 ${cardBg}`}
      >
        <div className="flex flex-wrap gap-2 sm:gap-3 items-end">
          {(activeTab === 'payroll' || activeTab === 'overtime') && (
            <div className="w-full sm:w-40">
              <label className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 mb-1 block">Periode</label>
              <input
                type="text"
                placeholder="YYYY-MM"
                value={period}
                onChange={e => setPeriod(e.target.value)}
                className={`w-full px-2 sm:px-3 py-2 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 ${inputBg}`}
              />
            </div>
          )}

          {activeTab === 'overtime' && (
            <div className="w-full sm:w-40">
              <label className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 mb-1 block">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className={`w-full px-2 sm:px-3 py-2 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 ${inputBg}`}>
                <option value="ALL">Semua</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          )}

          {activeTab === 'employee' && (
            <>
              <div className="w-full sm:w-48">
                <label className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 mb-1 block">Departemen</label>
                <select value={departmentId} onChange={e => setDepartmentId(e.target.value)} className={`w-full px-2 sm:px-3 py-2 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 ${inputBg}`}>
                  <option value="">Semua</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-40">
                <label className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 mb-1 block">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className={`w-full px-2 sm:px-3 py-2 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 ${inputBg}`}>
                  <option value="ALL">Semua</option>
                  <option value="ACTIVE">Aktif</option>
                  <option value="INACTIVE">Nonaktif</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'annual' && (
            <div className="w-full sm:w-32">
              <label className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 mb-1 block">Tahun</label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(e.target.value)}
                className={`w-full px-2 sm:px-3 py-2 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 ${inputBg}`}
              />
            </div>
          )}

          <motion.button
            onClick={fetchData}
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-3 sm:px-4 py-2 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-medium rounded-lg text-xs sm:text-sm transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />}
            <Search className="w-3 h-3 sm:w-4 sm:h-4" />
            Tampilkan
          </motion.button>
        </div>
      </motion.div>
    );
  };

  const renderTable = () => {
    if (loading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-xl border shadow-sm p-6 sm:p-8 flex items-center justify-center ${cardBg}`}
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff6b00]" />
          </motion.div>
        </motion.div>
      );
    }

    if (!data) return null;

    if (activeTab === 'payroll' && data.details) {
      return (
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className={`rounded-xl border shadow-sm overflow-hidden ${cardBg}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className={`border-b text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'border-[#2d3748] text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">Nama</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">NIK</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">Dept</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">Jabatan</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-right whitespace-nowrap">Gaji Pokok</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-right whitespace-nowrap">Lembur</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-right whitespace-nowrap">Potongan</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-right whitespace-nowrap">Gaji Bersih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/10">
                {data.details.map((row, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className="hover:bg-gray-500/5 transition-colors"
                  >
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 font-medium whitespace-nowrap">{row.name}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-400 whitespace-nowrap">{row.nik}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">{row.department}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">{row.position}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-right whitespace-nowrap">{formatRupiah(row.basicSalary)}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-right text-emerald-600 whitespace-nowrap">{formatRupiah(row.overtimePay)}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-right text-red-500 whitespace-nowrap">{formatRupiah(row.totalDeductions)}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-right font-bold text-[#ff6b00] whitespace-nowrap">{formatRupiah(row.netSalary)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 border-t flex justify-end">
            <PDFDownloadLink
              document={<PayrollReportPDF data={data} />}
              fileName={`laporan-payroll-${data.period}.pdf`}
              className="px-3 sm:px-4 py-2 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-medium rounded-lg text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              {({ loading: pdfLoading }) => (
                <>
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  {pdfLoading ? 'Membuat PDF...' : 'Export PDF'}
                </>
              )}
            </PDFDownloadLink>
          </div>
        </motion.div>
      );
    }

    if (activeTab === 'overtime' && data.details) {
      return (
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className={`rounded-xl border shadow-sm overflow-hidden ${cardBg}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className={`border-b text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'border-[#2d3748] text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">Nama</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">Tanggal</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">Jam</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">Total</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">Jenis</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">Status</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-right whitespace-nowrap">Biaya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/10">
                {data.details.map((row, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className="hover:bg-gray-500/5 transition-colors"
                  >
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 font-medium whitespace-nowrap">{row.name}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">{formatDate(row.date)}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-400 whitespace-nowrap">{row.startTime} - {row.endTime}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">{row.totalHours}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">{row.dayType === 'WEEKDAY' ? 'Hari Kerja' : 'Hari Libur'}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium ${row.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : row.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {row.status === 'APPROVED' ? 'Disetujui' : row.status === 'REJECTED' ? 'Ditolak' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-right font-bold text-[#ff6b00] whitespace-nowrap">{formatRupiah(row.overtimePay)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 border-t flex justify-end">
            <PDFDownloadLink
              document={<OvertimeReportPDF data={data} />}
              fileName={`laporan-lembur-${data.period}.pdf`}
              className="px-3 sm:px-4 py-2 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-medium rounded-lg text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              {({ loading: pdfLoading }) => (
                <>
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  {pdfLoading ? 'Membuat PDF...' : 'Export PDF'}
                </>
              )}
            </PDFDownloadLink>
          </div>
        </motion.div>
      );
    }

    if (activeTab === 'employee' && data.details) {
      return (
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className={`rounded-xl border shadow-sm overflow-hidden ${cardBg}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className={`border-b text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'border-[#2d3748] text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">Nama</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">NIK</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">Departemen</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">Jabatan</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-right whitespace-nowrap">Gaji Pokok</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">Status</th>
                  <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">Bergabung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/10">
                {data.details.map((row, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className="hover:bg-gray-500/5 transition-colors"
                  >
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 font-medium whitespace-nowrap">{row.name}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-400 whitespace-nowrap">{row.nik}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">{row.department}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">{row.position}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-right whitespace-nowrap">{formatRupiah(row.basicSalary)}</td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium ${row.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                        {row.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-400 whitespace-nowrap">{formatDate(row.joinDate)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 border-t flex justify-end">
            <PDFDownloadLink
              document={<EmployeeReportPDF data={data} />}
              fileName="laporan-karyawan.pdf"
              className="px-3 sm:px-4 py-2 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-medium rounded-lg text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              {({ loading: pdfLoading }) => (
                <>
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  {pdfLoading ? 'Membuat PDF...' : 'Export PDF'}
                </>
              )}
            </PDFDownloadLink>
          </div>
        </motion.div>
      );
    }

    if (activeTab === 'annual' && data?.monthlyData) {
      const maxVal = Math.max(...data.monthlyData.map(d => d.totalNetSalary || 0), 1);
      return (
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className={`rounded-xl border shadow-sm p-4 sm:p-6 ${cardBg}`}
        >
          <h3 className="font-bold text-sm sm:text-base mb-4 sm:mb-6">Pengeluaran Gaji per Bulan ({data.year})</h3>
          {/* ✅ FIX: Wrapper scroll horizontal di mobile */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex items-end gap-2 sm:gap-3 h-40 sm:h-64 min-w-130 sm:min-w-0">
              {data.monthlyData.map((m) => {
                const heightPct = maxVal > 0 ? (m.totalNetSalary / maxVal) * 100 : 0;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1 sm:gap-2 h-full justify-end">
                    <div className="w-full flex flex-col items-center gap-1">
                      {/* Nominal disembunyikan di mobile, muncul di sm+ */}
                      <span className="hidden sm:block text-[10px] text-gray-500 font-medium text-center whitespace-nowrap">{formatRupiah(m.totalNetSalary)}</span>
                      <div className="w-full bg-gray-100 rounded-t-md relative overflow-hidden h-20 sm:h-30">
                        <motion.div
                          custom={heightPct}
                          variants={barVariants}
                          initial="hidden"
                          animate="visible"
                          className="absolute bottom-0 w-full bg-[#ff6b00] rounded-t-md"
                        />
                      </div>
                    </div>
                    <span className="text-[8px] sm:text-[10px] text-gray-400 font-medium">{m.monthName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className={`rounded-xl border shadow-sm p-6 sm:p-8 text-center ${cardBg}`}
      >
        <p className="text-xs sm:text-sm text-gray-400">Tidak ada data untuk ditampilkan</p>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="space-y-4 sm:space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">Laporan</h2>
        <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Rekap data penggajian, lembur, dan karyawan
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1"
      >
        {TABS.filter(t => t.key !== 'annual' || isSuperAdmin).map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap ${isActive
                  ? 'bg-[#ff6b00] text-white shadow-sm'
                  : isDark ? 'bg-[#1e293b] text-gray-400 border border-[#2d3748] hover:text-white' : 'bg-white text-gray-600 border border-gray-200 hover:text-[#ff6b00]'
                }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </motion.button>
          );
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {renderFilters()}
          {data && renderSummaryCards()}
          {renderTable()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default LaporanCrud;