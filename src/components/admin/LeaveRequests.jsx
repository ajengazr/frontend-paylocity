import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Filter, 
  X, 
  Calendar, 
  Briefcase, 
  Clock, 
  MessageSquare, 
  ChevronDown, 
  Search,
  RefreshCw,
  FileText,
  AlertCircle,
  Timer,
  CheckCheck,
  Ban,
  CalendarDays,
  CheckCircle2,
} from 'lucide-react';
import { leaveApi } from '../../config/leaveApi';
import { formatShortDate, getLeaveStatusBadge, getLeaveTypeLabel } from '../../utils/leaveUtils';
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

const filterVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: 'auto',
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
};

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, leaveId: null });
  const [rejectNote, setRejectNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [approveModal, setApproveModal] = useState({ isOpen: false, leaveId: null });
  
  const { addToast } = useToast();
  const { isDark } = useTheme();

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const response = await leaveApi.getAll();
      setLeaves(response.data.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeaves();
  }, [fetchLeaves]);

  useEffect(() => {
    let filtered = [...leaves];
    
    if (statusFilter) {
      filtered = filtered.filter(leave => leave.status === statusFilter);
    }
    
    if (typeFilter) {
      filtered = filtered.filter(leave => leave.type === typeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(leave => 
        leave.employee?.user?.username?.toLowerCase().includes(query) ||
        leave.reason?.toLowerCase().includes(query) ||
        getLeaveTypeLabel(leave.type)?.toLowerCase().includes(query)
      );
    }
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredLeaves(filtered);
  }, [statusFilter, typeFilter, searchQuery, leaves]);

  const openApproveModal = (leaveId) => {
    setApproveModal({ isOpen: true, leaveId });
  };

  const closeApproveModal = () => {
    setApproveModal({ isOpen: false, leaveId: null });
  };

  const executeApprove = async () => {
    if (!approveModal.leaveId) return;
    
    setSubmitting(true);
    try {
      await leaveApi.updateStatus(approveModal.leaveId, { status: 'APPROVED' });
      addToast('Pengajuan cuti berhasil disetujui', 'success');
      fetchLeaves();
    } catch (error) {
      addToast(error.response?.data?.errors || 'Gagal menyetujui cuti', 'error');
    } finally {
      setSubmitting(false);
      closeApproveModal();
    }
  };

  const handleReject = async () => {
    if (!rejectNote.trim() || rejectNote.trim().length < 5) {
      addToast('Alasan penolakan wajib diisi minimal 5 karakter', 'error');
      return;
    }
    
    setSubmitting(true);
    try {
      await leaveApi.updateStatus(rejectModal.leaveId, {
        status: 'REJECTED',
        rejectedNote: rejectNote
      });
      addToast('Pengajuan cuti berhasil ditolak', 'success');
      setRejectModal({ isOpen: false, leaveId: null });
      setRejectNote('');
      fetchLeaves();
    } catch (error) {
      addToast(error.response?.data?.errors || 'Gagal menolak cuti', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const clearFilters = () => {
    setStatusFilter('');
    setTypeFilter('');
    setSearchQuery('');
  };

  const activeFiltersCount = [statusFilter, typeFilter].filter(Boolean).length + (searchQuery ? 1 : 0);

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
        <motion.div variants={itemVariants} className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight ${isDark ? 'text-[#ebf1ff]' : 'text-gray-800'}`}>
                Manajemen Cuti
              </h1>
              <p className={`mt-1 text-sm sm:text-base flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Calendar size={16} className="text-blue-500" />
                Kelola pengajuan cuti semua karyawan
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchLeaves}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all shadow-sm self-start sm:self-auto ${isDark ? 'bg-[#1e293b] border-[#2d3748] text-gray-300 hover:bg-[#2d3748] hover:border-gray-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </motion.button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, alasan, atau jenis cuti..."
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-sm ${isDark ? 'bg-[#1e293b] border-[#2d3748] text-[#ebf1ff]' : 'bg-white border-gray-200'}`}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-blue-600 text-white shadow-blue-200'
                  : (isDark ? 'bg-[#1e293b] border-[#2d3748] text-gray-300 border hover:bg-[#2d3748]' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')
              }`}
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Filter</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
              <motion.div
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={16} className="sm:hidden" />
              </motion.div>
            </motion.button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                variants={filterVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="overflow-hidden"
              >
                <div className={`rounded-xl p-4 border shadow-sm ${isDark ? 'bg-[#1e293b]/80 border-[#2d3748] backdrop-blur-sm' : 'bg-white/80 border-gray-200 backdrop-blur-sm'}`}>
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-35">
                      <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${isDark ? 'bg-[#1e293b] border-[#2d3748] text-[#ebf1ff]' : 'bg-white border-gray-200'}`}
                      >
                        <option value="">Semua Status</option>
                        <option value="PENDING">Menunggu</option>
                        <option value="APPROVED">Disetujui</option>
                        <option value="REJECTED">Ditolak</option>
                      </select>
                    </div>

                    <div className="flex-1 min-w-35">
                      <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Jenis Cuti</label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${isDark ? 'bg-[#1e293b] border-[#2d3748] text-[#ebf1ff]' : 'bg-white border-gray-200'}`}
                      >
                        <option value="">Semua Jenis</option>
                        <option value="TAHUNAN">Cuti Tahunan</option>
                        <option value="SAKIT">Cuti Sakit</option>
                        <option value="MELAHIRKAN">Cuti Melahirkan</option>
                        <option value="PENTING">Cuti Penting</option>
                      </select>
                    </div>

                    {activeFiltersCount > 0 && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                      >
                        <X size={14} />
                        Reset
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

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

        {filteredLeaves.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className={`rounded-2xl p-8 sm:p-12 text-center shadow-sm border ${isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100'}`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-[#2d3748]' : 'bg-gray-100'}`}
            >
              <AlertCircle size={32} className="text-gray-400" />
            </motion.div>
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-[#ebf1ff]' : 'text-gray-700'}`}>Tidak ada data</h3>
            <p className={`text-sm max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {activeFiltersCount > 0 
                ? 'Tidak ada pengajuan cuti yang sesuai dengan filter yang dipilih.'
                : 'Belum ada pengajuan cuti dari karyawan.'}
            </p>
            {activeFiltersCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Hapus Filter
              </motion.button>
            )}
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:hidden">
              <AnimatePresence mode="popLayout">
                {filteredLeaves.map((leave) => {
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
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm">
                            {leave.employee?.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <h3 className={`font-semibold text-sm sm:text-base ${isDark ? 'text-[#ebf1ff]' : 'text-gray-800'}`}>
                              {leave.employee?.user?.username || 'Unknown'}
                            </h3>
                            <p className={`text-xs flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              <Briefcase size={12} />
                              {leave.employee?.department?.name || '-'} • {leave.employee?.position?.name || '-'}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <CalendarDays size={14} className="text-blue-500 shrink-0" />
                          <span className="font-medium">{getLeaveTypeLabel(leave.type)}</span>
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          <Clock size={14} className="text-gray-400 shrink-0" />
                          <span>{formatShortDate(leave.startDate)} → {formatShortDate(leave.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${isDark ? 'text-gray-300 bg-[#2d3748]' : 'text-gray-600 bg-gray-100'}`}>
                            {leave.totalDays} hari
                          </span>
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
                            <div className={`pt-3 border-t mb-3 ${isDark ? 'border-[#2d3748]' : 'border-gray-100'}`}>
                              <p className={`text-sm flex items-start gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                <MessageSquare size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                <span>{leave.reason || '-'}</span>
                              </p>
                              {leave.status === 'REJECTED' && leave.rejectedNote && (
                                <div className={`mt-2 p-2 rounded-lg text-xs ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
                                  <strong>Alasan penolakan:</strong> {leave.rejectedNote}
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
                              openApproveModal(leave.id);
                            }}
                            disabled={submitting}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${isDark ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                          >
                            <CheckCircle size={16} />
                            Setujui
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setRejectModal({ isOpen: true, leaveId: leave.id });
                            }}
                            disabled={submitting}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
                          >
                            <XCircle size={16} />
                            Tolak
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <motion.div 
              variants={itemVariants}
              className={`hidden lg:block rounded-2xl shadow-sm border overflow-hidden ${isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100'}`}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDark ? 'bg-[#1e293b]/80 border-[#2d3748]' : 'bg-gray-50/80 border-gray-100'}`}>
                      <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Karyawan</th>
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
                      {filteredLeaves.map((leave) => {
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
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs">
                                  {leave.employee?.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                  <div className={`text-sm font-semibold ${isDark ? 'text-[#ebf1ff]' : 'text-gray-900'}`}>
                                    {leave.employee?.user?.username || '-'}
                                  </div>
                                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {leave.employee?.department?.name || '-'} • {leave.employee?.position?.name || '-'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
                                <div className={`text-xs mt-1.5 max-w-50 truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`} title={leave.rejectedNote}>
                                  <span className="inline-flex items-center gap-1">
                                    <MessageSquare size={10} />
                                    {leave.rejectedNote}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {leave.status === 'PENDING' && (
                                <div className="flex items-center justify-end gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => openApproveModal(leave.id)}
                                    disabled={submitting}
                                    className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${isDark ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                    title="Setujui"
                                  >
                                    <CheckCircle size={20} />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setRejectModal({ isOpen: true, leaveId: leave.id })}
                                    disabled={submitting}
                                    className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
                                    title="Tolak"
                                  >
                                    <XCircle size={20} />
                                  </motion.button>
                                </div>
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

      {/* Modal Konfirmasi Setujui */}
      <AnimatePresence>
        {approveModal.isOpen && (
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeApproveModal}
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
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-100'}`}>
                  <CheckCircle2 size={28} className="text-emerald-600" />
                </div>
                <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-[#ebf1ff]' : 'text-gray-800'}`}>
                  Setujui Pengajuan
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Apakah Anda yakin ingin menyetujui pengajuan cuti ini? Tindakan ini akan mengubah status menjadi disetujui.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeApproveModal}
                  className={`flex-1 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${isDark ? 'border-[#2d3748] text-gray-300 hover:bg-[#2d3748]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Batal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={executeApprove}
                  disabled={submitting}
                  className="flex-1 bg-emerald-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Ya, Setujui
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Tolak */}
      <AnimatePresence>
        {rejectModal.isOpen && (
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setRejectModal({ isOpen: false, leaveId: null })}
          >
            <motion.div
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`rounded-2xl p-6 w-full max-w-md shadow-2xl ${isDark ? 'bg-[#1e293b]' : 'bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-red-500/10' : 'bg-red-100'}`}>
                    <XCircle size={20} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${isDark ? 'text-[#ebf1ff]' : 'text-gray-800'}`}>Tolak Pengajuan</h2>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Berikan alasan penolakan</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRejectModal({ isOpen: false, leaveId: null })}
                  className={`p-1 rounded-lg transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-[#2d3748]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                >
                  <X size={20} />
                </motion.button>
              </div>
              
              <div className="mb-5">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Alasan Penolakan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  rows="4"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all resize-none ${isDark ? 'bg-[#1e293b] border-[#2d3748] text-[#ebf1ff]' : 'bg-white border-gray-200'}`}
                  placeholder="Masukkan alasan mengapa pengajuan ini ditolak..."
                  autoFocus
                />
                <div className="flex justify-between mt-1.5">
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Minimal 5 karakter</p>
                  <p className={`text-xs ${rejectNote.length >= 5 ? 'text-emerald-500' : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
                    {rejectNote.length} karakter
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setRejectModal({ isOpen: false, leaveId: null });
                    setRejectNote('');
                  }}
                  className={`flex-1 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${isDark ? 'border-[#2d3748] text-gray-300 hover:bg-[#2d3748]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Batal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReject}
                  disabled={submitting || rejectNote.trim().length < 5}
                  className="flex-1 bg-red-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw size={16} className="animate-spin" />
                      Memproses...
                    </span>
                  ) : (
                    'Tolak Pengajuan'
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

export default LeaveRequests;