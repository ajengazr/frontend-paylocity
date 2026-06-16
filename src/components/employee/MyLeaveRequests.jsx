import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarPlus, 
  X, 
  Trash2, 
  Info, 
  Calendar, 
  Clock, 
  Timer,
  CheckCheck,
  Ban,
  FileText,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  CalendarDays,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  calculateWorkingDays,  
  formatShortDate, 
  getLeaveTypeLabel, 
  getLeaveStatusBadge 
} from '../../utils/leaveUtils';
import { leaveApi } from '../../config/leaveApi';
import { useToast } from '../../contexts/ToastContext';
import { useTheme } from '../../contexts/ThemeContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.08,
      delayChildren: 0.1 
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: 0.2 } 
  }
};

const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 50,
    transition: { duration: 0.2 }
  }
};

const MyLeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [lastAction, setLastAction] = useState(null);
  const { addToast } = useToast();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    type: 'TAHUNAN',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [calculatedDays, setCalculatedDays] = useState(0);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    leaveId: null,
    title: '',
    message: '',
    actionType: ''
  });

  const fetchMyLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const response = await leaveApi.getMy();
      setLeaves(response.data.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMyLeaves();
  }, [fetchMyLeaves]);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end >= start) {
        const days = calculateWorkingDays(start, end);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCalculatedDays(days);
      } else {
        setCalculatedDays(0);
      }
    } else {
      setCalculatedDays(0);
    }
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      addToast('Semua field harus diisi', 'error');
      return;
    }

    if (calculatedDays === 0) {
      addToast('Tanggal selesai harus setelah tanggal mulai dan mencakup hari kerja', 'error');
      return;
    }

    if (formData.reason.length < 5) {
      addToast('Alasan minimal 5 karakter', 'error');
      return;
    }

    setSubmitting(true);
    
    try {
      await leaveApi.create({
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason
      });
      
      setShowModal(false);
      setFormData({ type: 'TAHUNAN', startDate: '', endDate: '', reason: '' });
      setCalculatedDays(0);
      
      addToast('Pengajuan cuti berhasil dikirim', 'success');
      
      await fetchMyLeaves();
      
    } catch (error) {
      console.error('Submit error:', error);
      
      const errorMsg = error.response?.data?.errors 
        || error.response?.data?.message 
        || error.message 
        || 'Gagal mengajukan cuti';
      
      addToast(errorMsg, 'error');
      setLastAction({ type: 'error', message: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const openCancelModal = (leaveId) => {
    setConfirmModal({
      isOpen: true,
      leaveId,
      title: 'Batalkan Pengajuan',
      message: 'Apakah Anda yakin ingin membatalkan pengajuan cuti ini? Tindakan ini tidak dapat diurungkan.',
      actionType: 'cancel'
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      leaveId: null,
      title: '',
      message: '',
      actionType: ''
    });
  };

  const executeCancel = async () => {
    if (!confirmModal.leaveId) return;
    
    setSubmitting(true);
    try {
      await leaveApi.delete(confirmModal.leaveId);
      
      addToast('Pengajuan cuti berhasil dibatalkan', 'success');
      
      await fetchMyLeaves();
    } catch (error) {
      console.error('Cancel error:', error);
      
      const errorMsg = error.response?.data?.errors 
        || error.response?.data?.message 
        || 'Gagal membatalkan cuti';
      
      addToast(errorMsg, 'error');
      setLastAction({ type: 'error', message: errorMsg });
    } finally {
      setSubmitting(false);
      closeConfirmModal();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ type: 'TAHUNAN', startDate: '', endDate: '', reason: '' });
    setCalculatedDays(0);
  };

  if (loading) {
    return (
      <div className={`min-h-screen p-4 sm:p-6 ${isDark ? 'bg-[#151c27]' : 'bg-linear-to-br from-gray-50 to-blue-50/30'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 space-y-2">
            <div className={`h-8 rounded-lg animate-pulse w-64 ${isDark ? 'bg-[#2d3748]' : 'bg-gray-200'}`} />
            <div className={`h-4 rounded animate-pulse w-48 ${isDark ? 'bg-[#2d3748]' : 'bg-gray-200'}`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`rounded-2xl p-5 shadow-sm border ${isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full animate-pulse ${isDark ? 'bg-[#2d3748]' : 'bg-gray-200'}`} />
                  <div className="flex-1 space-y-2">
                    <div className={`h-4 rounded animate-pulse w-3/4 ${isDark ? 'bg-[#2d3748]' : 'bg-gray-200'}`} />
                    <div className={`h-3 rounded animate-pulse w-1/2 ${isDark ? 'bg-[#2d3748]' : 'bg-gray-200'}`} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className={`h-3 rounded animate-pulse w-full ${isDark ? 'bg-[#2d3748]' : 'bg-gray-200'}`} />
                  <div className={`h-3 rounded animate-pulse w-5/6 ${isDark ? 'bg-[#2d3748]' : 'bg-gray-200'}`} />
                  <div className="flex justify-between mt-4">
                    <div className={`h-8 rounded animate-pulse w-20 ${isDark ? 'bg-[#2d3748]' : 'bg-gray-200'}`} />
                    <div className={`h-8 rounded animate-pulse w-20 ${isDark ? 'bg-[#2d3748]' : 'bg-gray-200'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen p-3 sm:p-4 md:p-6 ${isDark ? 'bg-[#151c27]' : 'bg-linear-to-br from-gray-50 to-blue-50/30'}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Notifikasi Fallback */}
        <AnimatePresence>
          {lastAction && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className={`mb-4 p-4 rounded-xl flex items-center gap-3 shadow-sm border ${
                lastAction.type === 'success' 
                  ? (isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800')
                  : (isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-800')
              }`}
            >
              {lastAction.type === 'success' ? (
                <CheckCircle2 size={20} className="shrink-0" />
              ) : (
                <AlertCircle size={20} className="shrink-0" />
              )}
              <span className="text-sm font-medium">{lastAction.message}</span>
              <button 
                onClick={() => setLastAction(null)}
                className={`ml-auto ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight ${isDark ? 'text-[#ebf1ff]' : 'text-gray-800'}`}>
                Pengajuan Cuti Saya
              </h1>
              <p className={`mt-1 text-sm sm:text-base flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Calendar size={16} className="text-blue-500" />
                Kelola pengajuan cuti Anda
              </p>
            </div>
            <div className="flex gap-2 self-start sm:self-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchMyLeaves}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all shadow-sm ${isDark ? 'bg-[#1e293b] border-[#2d3748] text-gray-300 hover:bg-[#2d3748] hover:border-gray-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                <CalendarPlus size={18} />
                <span className="hidden sm:inline">Ajukan Cuti</span>
                <span className="sm:hidden">Ajukan</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total', value: leaves.length, color: 'bg-blue-500', icon: FileText },
            { label: 'Menunggu', value: leaves.filter(l => l.status === 'PENDING').length, color: 'bg-amber-500', icon: Timer },
            { label: 'Disetujui', value: leaves.filter(l => l.status === 'APPROVED').length, color: 'bg-emerald-500', icon: CheckCheck },
            { label: 'Ditolak', value: leaves.filter(l => l.status === 'REJECTED').length, color: 'bg-red-500', icon: Ban },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className={`rounded-xl p-3 sm:p-4 shadow-sm border flex items-center gap-3 cursor-default ${isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100'}`}
            >
              <div className={`${stat.color} p-2 rounded-lg text-white shadow-lg shadow-opacity-20`}>
                <stat.icon size={18} />
              </div>
              <div>
                <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                <p className={`text-lg sm:text-xl font-bold ${isDark ? 'text-[#ebf1ff]' : 'text-gray-800'}`}>{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Content */}
        {leaves.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className={`rounded-2xl p-8 sm:p-12 text-center shadow-sm border ${isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100'}`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}
            >
              <CalendarPlus size={32} className="text-blue-400" />
            </motion.div>
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-[#ebf1ff]' : 'text-gray-700'}`}>Belum ada pengajuan</h3>
            <p className={`text-sm max-w-md mx-auto mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Anda belum mengajukan cuti. Ajukan cuti pertama Anda sekarang.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Ajukan Cuti Sekarang
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Mobile & Tablet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:hidden">
              <AnimatePresence mode="popLayout">
                {leaves.map((leave) => {
                  const statusBadge = getLeaveStatusBadge(leave.status);
                  const isExpanded = expandedCard === leave.id;
                  
                  return (
                    <motion.div
                      key={leave.id}
                      layout
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className={`rounded-2xl p-4 sm:p-5 shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100'}`}
                      onClick={() => setExpandedCard(isExpanded ? null : leave.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${statusBadge.className.replace('text-', 'bg-').replace('100', '500').replace('800', '100').split(' ')[0]}`}>
                            {getLeaveTypeLabel(leave.type).charAt(0)}
                          </div>
                          <div>
                            <h3 className={`font-semibold text-sm sm:text-base ${isDark ? 'text-[#ebf1ff]' : 'text-gray-800'}`}>
                              {getLeaveTypeLabel(leave.type)}
                            </h3>
                            <p className={`text-xs flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              <CalendarDays size={12} />
                              {leave.totalDays} hari kerja
                            </p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          <Clock size={14} className="text-gray-400 shrink-0" />
                          <span>{formatShortDate(leave.startDate)} → {formatShortDate(leave.endDate)}</span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className={`pt-3 border-t mb-3 space-y-2 ${isDark ? 'border-[#2d3748]' : 'border-gray-100'}`}>
                              <p className={`text-sm flex items-start gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                <MessageSquare size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                <span>{leave.reason || '-'}</span>
                              </p>
                              {leave.status === 'REJECTED' && leave.rejectedNote && (
                                <div className={`p-2 rounded-lg text-xs flex items-start gap-1.5 ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
                                  <Info size={12} className="mt-0.5 shrink-0" />
                                  <span><strong>Alasan penolakan:</strong> {leave.rejectedNote}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {leave.status === 'PENDING' && (
                        <div className={`flex gap-2 pt-3 border-t ${isDark ? 'border-[#2d3748]' : 'border-gray-100'}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openCancelModal(leave.id);
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
                          >
                            <Trash2 size={16} />
                            Batalkan
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Desktop Table */}
            <motion.div 
              variants={itemVariants}
              className={`hidden lg:block rounded-2xl shadow-sm border overflow-hidden ${isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100'}`}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDark ? 'bg-[#1e293b]/80 border-[#2d3748]' : 'bg-gray-50/80 border-gray-100'}`}>
                      <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Jenis Cuti</th>
                      <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Periode</th>
                      <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total</th>
                      <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Alasan</th>
                      <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                      <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-[#2d3748]' : 'divide-gray-100'}`}>
                    <AnimatePresence>
                      {leaves.map((leave) => {
                        const statusBadge = getLeaveStatusBadge(leave.status);
                        return (
                          <motion.tr
                            key={leave.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            whileHover={{ backgroundColor: isDark ? 'rgba(45, 55, 72, 1)' : 'rgba(249, 250, 251, 1)' }}
                            className="group transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-semibold ${isDark ? 'text-[#ebf1ff]' : 'text-gray-900'}`}>
                                {getLeaveTypeLabel(leave.type)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {formatShortDate(leave.startDate)}
                              </div>
                              <div className={`text-xs flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                → {formatShortDate(leave.endDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-medium px-2.5 py-1 rounded-lg ${isDark ? 'text-gray-300 bg-[#2d3748]' : 'text-gray-700 bg-gray-100'}`}>
                                {leave.totalDays} hari
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`text-sm max-w-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`} title={leave.reason}>
                                {leave.reason || '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-full ${statusBadge.className}`}>
                                {statusBadge.label}
                              </span>
                              {leave.status === 'REJECTED' && leave.rejectedNote && (
                                <div className={`flex items-center gap-1 mt-1.5 text-xs max-w-50 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} title={leave.rejectedNote}>
                                  <Info size={12} />
                                  <span className="truncate">{leave.rejectedNote}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {leave.status === 'PENDING' && (
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => openCancelModal(leave.id)}
                                  className={`p-2 rounded-lg transition-colors ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
                                  title="Batalkan"
                                >
                                  <Trash2 size={18} />
                                </motion.button>
                              )}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Modal Ajukan Cuti */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-[#1e293b]' : 'bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <CalendarPlus size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${isDark ? 'text-[#ebf1ff]' : 'text-gray-800'}`}>Ajukan Cuti</h2>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Isi formulir pengajuan cuti Anda</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className={`p-1 rounded-lg transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-[#2d3748]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Jenis Cuti <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${isDark ? 'bg-[#1e293b] border-[#2d3748] text-[#ebf1ff]' : 'bg-white border-gray-200'}`}
                    required
                  >
                    <option value="TAHUNAN">Cuti Tahunan</option>
                    <option value="SAKIT">Cuti Sakit</option>
                    <option value="MELAHIRKAN">Cuti Melahirkan</option>
                    <option value="PENTING">Cuti Penting</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Tanggal Mulai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${isDark ? 'bg-[#1e293b] border-[#2d3748] text-[#ebf1ff]' : 'bg-white border-gray-200'}`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Tanggal Selesai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${isDark ? 'bg-[#1e293b] border-[#2d3748] text-[#ebf1ff]' : 'bg-white border-gray-200'}`}
                      required
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {calculatedDays > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className={`p-4 rounded-xl border ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <CalendarDays size={16} className="text-blue-500" />
                          <p className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>
                            Total hari kerja: {calculatedDays} hari
                          </p>
                        </div>
                        <p className={`text-xs ml-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                          Hanya menghitung hari Senin-Jumat (Sabtu-Minggu tidak dihitung)
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Alasan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows="3"
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none ${isDark ? 'bg-[#1e293b] border-[#2d3748] text-[#ebf1ff]' : 'bg-white border-gray-200'}`}
                    placeholder="Masukkan alasan pengajuan cuti..."
                    required
                  />
                  <div className="flex justify-between mt-1.5">
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Minimal 5 karakter</p>
                    <p className={`text-xs ${formData.reason.length >= 5 ? 'text-emerald-500' : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
                      {formData.reason.length} karakter
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={closeModal}
                    className={`flex-1 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${isDark ? 'border-[#2d3748] text-gray-300 hover:bg-[#2d3748]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCw size={16} className="animate-spin" />
                        Mengirim...
                      </span>
                    ) : (
                      'Ajukan Cuti'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmModal.isOpen && (
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeConfirmModal}
          >
            <motion.div
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`rounded-2xl p-6 w-full max-w-md shadow-2xl ${isDark ? 'bg-[#1e293b]' : 'bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${isDark ? 'bg-red-500/10' : 'bg-red-100'}`}>
                  <AlertTriangle size={28} className="text-red-600" />
                </div>
                <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-[#ebf1ff]' : 'text-gray-800'}`}>
                  {confirmModal.title}
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {confirmModal.message}
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeConfirmModal}
                  className={`flex-1 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${isDark ? 'border-[#2d3748] text-gray-300 hover:bg-[#2d3748]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Tutup
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={executeCancel}
                  disabled={submitting}
                  className="flex-1 bg-red-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Ya, Batalkan
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyLeaveRequests;