import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { X, Loader2, Plus, Clock, AlertTriangle, CheckCircle, XCircle, Ban, Eye } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import overtimeApi from '../../config/overtimeApi';
import { staggerContainer, staggerItem, scaleUp, fadeIn } from '../../animations/variants';

const MyOvertime = () => {
    const { isDark } = useTheme();
    const { addToast } = useToast();
    const [overtimes, setOvertimes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        date: '',
        startTime: '',
        endTime: '',
        dayType: 'WEEKDAY',
        reason: ''
    });

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedOvertime, setSelectedOvertime] = useState(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const cardBg = isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100';
    const inputBg = isDark ? 'bg-[#151c27] border-[#334155] text-white' : 'bg-[#f9fafb] border-gray-200 text-[#111827]';

    const fetchOvertimes = async () => {
        try {
            setLoading(true);
            const res = await overtimeApi.getMyOvertime();
            const data = res.data?.data || [];
            setOvertimes(data);
        } catch (err) {
            addToast(err.response?.data?.errors || 'Gagal memuat riwayat lembur', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOvertimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await overtimeApi.create(form);
            addToast('Pengajuan lembur berhasil dikirim!', 'success');
            setIsCreateOpen(false);
            setForm({ date: '', startTime: '', endTime: '', dayType: 'WEEKDAY', reason: '' });
            fetchOvertimes();
        } catch (err) {
            addToast(err.response?.data?.errors || 'Gagal mengajukan lembur', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const openDelete = (id) => {
        setDeleteTargetId(id);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTargetId) return;
        try {
            setDeleteLoading(true);
            await overtimeApi.delete(deleteTargetId);
            addToast('Pengajuan lembur berhasil dibatalkan!', 'success');
            fetchOvertimes();
            setIsDeleteOpen(false);
            setDeleteTargetId(null);
        } catch (err) {
            addToast(err.response?.data?.errors || 'Gagal membatalkan pengajuan', 'error');
        } finally {
            setDeleteLoading(false);
        }
    };

    const openDetail = (ot) => {
        setSelectedOvertime(ot);
        setIsDetailOpen(true);
    };

    const formatDate = (val) => {
        if (!val) return '-';
        const d = new Date(val);
        if (isNaN(d.getTime())) return val;
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatRupiah = (val) => {
        if (!val) return '-';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
    };

    const getStatusBadge = (status) => {
        const s = String(status || '').toUpperCase();
        if (s === 'PENDING') {
            return <span className="inline-flex px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-amber-100 text-amber-700">Menunggu</span>;
        }
        if (s === 'APPROVED') {
            return <span className="inline-flex px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-emerald-100 text-emerald-700">Disetujui</span>;
        }
        return <span className="inline-flex px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-red-100 text-red-700">Ditolak</span>;
    };

    const getStatusIcon = (status) => {
        const s = String(status || '').toUpperCase();
        if (s === 'PENDING') return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />;
        if (s === 'APPROVED') return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />;
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
    };

    if (loading) {
        return (
            <motion.div {...fadeIn} className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-[#ff6b00]" />
                <p className="text-xs sm:text-sm text-gray-400 mt-3">Memuat riwayat lembur...</p>
            </motion.div>
        );
    }

    return (
        <motion.div className="space-y-4 sm:space-y-6" {...fadeIn}>
            {/* Header */}
            <motion.div {...staggerItem} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">Riwayat Lembur</h2>
                    <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Kelola pengajuan lembur Anda
                    </p>
                </div>
                <motion.button
                    onClick={() => setIsCreateOpen(true)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-medium rounded-lg shadow-sm flex items-center gap-2 transition-all text-xs sm:text-sm"
                >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Ajukan Lembur</span>
                    <span className="sm:hidden">Ajukan</span>
                </motion.button>
            </motion.div>

            {/* Overtime List */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
                <AnimatePresence>
                    {overtimes.length > 0 ? (
                        overtimes.map((ot) => (
                            <motion.div
                                key={ot.id}
                                variants={staggerItem}
                                className={`rounded-xl border shadow-sm p-3 sm:p-4 lg:p-5 ${cardBg}`}
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                            {getStatusIcon(ot.status)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-xs sm:text-sm">{formatDate(ot.date)}</h3>
                                                {getStatusBadge(ot.status)}
                                            </div>
                                            <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                                                {ot.startTime} - {ot.endTime} • {ot.totalHours} jam • {ot.dayType === 'WEEKDAY' ? 'Hari Kerja' : 'Hari Libur'}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 line-clamp-1">{ot.reason}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {ot.status === 'PENDING' && (
                                            <motion.button
                                                onClick={() => openDelete(ot.id)}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-1 sm:p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                                                title="Batalkan"
                                            >
                                                <Ban className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            </motion.button>
                                        )}
                                        <motion.button
                                            onClick={() => openDetail(ot)}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-1 sm:p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-400 hover:text-[#ff6b00]"
                                            title="Detail"
                                        >
                                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </motion.button>
                                    </div>
                                </div>

                                {ot.status === 'APPROVED' && ot.overtimePay && (
                                    <div className={`mt-3 pt-3 border-t ${isDark ? 'border-[#2d3748]' : 'border-gray-100'}`}>
                                        <div className="flex justify-between items-center text-xs sm:text-sm">
                                            <span className="text-gray-500">Estimasi Bayaran Lembur</span>
                                            <span className="font-bold text-emerald-600">{formatRupiah(ot.overtimePay)}</span>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    ) : (
                        <motion.div {...staggerItem} className={`p-6 sm:p-8 rounded-xl border shadow-sm text-center ${cardBg}`}>
                            <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                            <p className="text-xs sm:text-sm text-gray-400">Belum ada pengajuan lembur</p>
                            <p className="text-[10px] text-gray-400 mt-1">Klik tombol "Ajukan Lembur" untuk mengajukan</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Modal Ajukan Lembur */}
            <AnimatePresence>
                {isCreateOpen && (
                    <motion.div
                        className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCreateOpen(false)}
                    >
                        <motion.div
                            {...scaleUp}
                            className={`w-full max-w-[95%] sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border shadow-xl p-4 sm:p-6 ${isDark ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-white border-gray-100 text-[#151c27]'}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className="text-base sm:text-lg font-bold">Ajukan Lembur</h3>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsCreateOpen(false)}
                                    className="p-1.5 rounded-md hover:bg-black/5 transition-colors"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>
                            </div>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="text-[10px] sm:text-xs font-semibold mb-1 block">Tanggal</label>
                                    <input 
                                        name="date" 
                                        type="date" 
                                        value={form.date} 
                                        onChange={handleChange} 
                                        required
                                        className={`w-full px-2 sm:px-3 py-2 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 ${inputBg}`} 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] sm:text-xs font-semibold mb-1 block">Tipe Hari</label>
                                    <select 
                                        name="dayType" 
                                        value={form.dayType} 
                                        onChange={handleChange} 
                                        required
                                        className={`w-full px-2 sm:px-3 py-2 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 ${inputBg}`}
                                    >
                                        <option value="WEEKDAY">Hari Kerja</option>
                                        <option value="WEEKEND">Hari Libur</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] sm:text-xs font-semibold mb-1 block">Jam Mulai</label>
                                    <input 
                                        name="startTime" 
                                        type="time" 
                                        value={form.startTime} 
                                        onChange={handleChange} 
                                        required
                                        className={`w-full px-2 sm:px-3 py-2 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 ${inputBg}`} 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] sm:text-xs font-semibold mb-1 block">Jam Selesai</label>
                                    <input 
                                        name="endTime" 
                                        type="time" 
                                        value={form.endTime} 
                                        onChange={handleChange} 
                                        required
                                        className={`w-full px-2 sm:px-3 py-2 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 ${inputBg}`} 
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] sm:text-xs font-semibold mb-1 block">Alasan Lembur</label>
                                    <textarea 
                                        name="reason" 
                                        value={form.reason} 
                                        onChange={handleChange} 
                                        required 
                                        rows={3}
                                        className={`w-full px-2 sm:px-3 py-2 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 ${inputBg}`}
                                        placeholder="Jelaskan alasan lembur..."
                                    />
                                </div>
                                <div className="col-span-2 flex justify-end gap-2 sm:gap-3 pt-2">
                                    <motion.button
                                        type="button"
                                        onClick={() => setIsCreateOpen(false)}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${isDark ? 'border-[#334155] text-gray-300 hover:bg-[#2a3547]' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        Batal
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        disabled={submitting}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-semibold rounded-lg text-xs sm:text-sm transition-all disabled:opacity-60 flex items-center gap-2"
                                    >
                                        {submitting && <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />}
                                        {submitting ? 'Mengirim...' : 'Ajukan'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal Detail */}
            <AnimatePresence>
                {isDetailOpen && selectedOvertime && (
                    <motion.div
                        className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { setIsDetailOpen(false); setSelectedOvertime(null); }}
                    >
                        <motion.div
                            {...scaleUp}
                            className={`w-full max-w-[95%] sm:max-w-sm rounded-2xl border shadow-xl p-4 sm:p-6 ${isDark ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-white border-gray-100 text-[#151c27]'}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className="text-base sm:text-lg font-bold">Detail Lembur</h3>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => { setIsDetailOpen(false); setSelectedOvertime(null); }}
                                    className="p-1.5 rounded-md hover:bg-black/5 transition-colors"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center gap-3 pb-3 border-b border-gray-200/30">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                        {getStatusIcon(selectedOvertime.status)}
                                    </div>
                                    <div>
                                        {getStatusBadge(selectedOvertime.status)}
                                        <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                                            Diajukan {formatDate(selectedOvertime.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Tanggal</p>
                                        <p className="font-semibold">{formatDate(selectedOvertime.date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Tipe Hari</p>
                                        <p className="font-semibold">{selectedOvertime.dayType === 'WEEKDAY' ? 'Hari Kerja' : 'Hari Libur'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Jam Mulai</p>
                                        <p className="font-semibold">{selectedOvertime.startTime}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Jam Selesai</p>
                                        <p className="font-semibold">{selectedOvertime.endTime}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Total Jam</p>
                                        <p className="font-semibold">{selectedOvertime.totalHours} jam</p>
                                    </div>
                                    {selectedOvertime.overtimePay && (
                                        <div>
                                            <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Estimasi Bayaran</p>
                                            <p className="font-semibold text-emerald-600">{formatRupiah(selectedOvertime.overtimePay)}</p>
                                        </div>
                                    )}
                                </div>

                                <div className={`p-2 sm:p-3 rounded-lg ${isDark ? 'bg-[#151c27]' : 'bg-gray-50'}`}>
                                    <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Alasan</p>
                                    <p className="text-xs sm:text-sm">{selectedOvertime.reason}</p>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <motion.button
                                        onClick={() => { setIsDetailOpen(false); setSelectedOvertime(null); }}
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

            {/* Modal Batalkan */}
            <AnimatePresence>
                {isDeleteOpen && (
                    <motion.div
                        className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { setIsDeleteOpen(false); setDeleteTargetId(null); }}
                    >
                        <motion.div
                            {...scaleUp}
                            className={`w-full max-w-[95%] sm:max-w-sm rounded-2xl border shadow-xl p-4 sm:p-6 ${isDark ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-white border-gray-100 text-[#151c27]'}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold mb-1">Batalkan Pengajuan?</h3>
                                    <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pengajuan yang dibatalkan tidak bisa dikembalikan.</p>
                                </div>
                                <div className="flex w-full gap-2 sm:gap-3 pt-2">
                                    <motion.button
                                        onClick={() => { setIsDeleteOpen(false); setDeleteTargetId(null); }}
                                        disabled={deleteLoading}
                                        whileTap={{ scale: 0.95 }}
                                        className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${isDark ? 'border-[#334155] text-gray-300 hover:bg-[#2a3547]' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        Batal
                                    </motion.button>
                                    <motion.button
                                        onClick={handleDeleteConfirm}
                                        disabled={deleteLoading}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-xs sm:text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                    >
                                        {deleteLoading && <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />}
                                        {deleteLoading ? 'Membatalkan...' : 'Ya, Batalkan'}
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

export default MyOvertime;