import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
    Loader2, Mail, Phone, MapPin, Building2, Briefcase,
    BadgeDollarSign, Calendar, Shield, User, Pencil,
    X, Eye, EyeOff, Check
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import employeeApi from '../../config/employeeApi';
import dashboardApi from '../../config/dashboardApi';
import payslipApi from '../../config/payslipApi';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../animations/variants';

const Profile = () => {
    const { isDark } = useTheme();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [summary, setSummary] = useState({
        masaKerja: null,
        totalOvertimeHours: null,
        latestNetSalary: null
    });

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        phone: '',
        address: '',
        taxStatus: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const cardBg = isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100';
    const textPrimary = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-400';
    const textMuted = isDark ? 'text-gray-500' : 'text-gray-500';
    const textBody = isDark ? 'text-gray-200' : 'text-gray-700';
    const inputBg = isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900';

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const [meRes, dashRes, payslipRes] = await Promise.all([
                employeeApi.getMe(),
                dashboardApi.getEmployeeDashboard().catch(() => null),
                payslipApi.getMyPayslips().catch(() => null)
            ]);

            const data = meRes.data?.data;
            if (!data) throw new Error('No data');

            const phone = data.phone || data.user?.phone || null;
            const address = data.address || data.user?.address || null;

            const profileData = {
                username: data.user?.username || '-',
                email: data.user?.email || '-',
                role: data.user?.role || 'EMPLOYEE',
                nik: data.nik || '-',
                department: data.department?.name || '-',
                position: data.position?.name || '-',
                basicSalary: data.basicSalary || 0,
                taxStatus: data.taxStatus || '-',
                joinDate: data.joinDate || '-',
                status: data.status || 'ACTIVE',
                phone: phone,
                address: address,
                avatar: null
            };

            setProfile(profileData);

            const dashStats = dashRes?.data?.data?.stats || {};
            const payslips = payslipRes?.data?.data || [];
            const latestPayslip = payslips[0];

            setSummary({
                // eslint-disable-next-line react-hooks/immutability
                masaKerja: data.joinDate ? calculateMasaKerja(data.joinDate) : null,
                totalOvertimeHours: dashStats.totalOvertimeHours !== undefined ? dashStats.totalOvertimeHours : null,
                latestNetSalary: latestPayslip?.netSalary !== undefined ? latestPayslip.netSalary : null
            });

            setEditForm(prev => ({
                ...prev,
                phone: phone || '',
                address: address || '',
                taxStatus: data.taxStatus || ''
            }));
        } catch (err) {
            addToast(err.response?.data?.errors || 'Gagal memuat profil', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const calculateMasaKerja = (joinDate) => {
        const start = new Date(joinDate);
        const now = new Date();
        let years = now.getFullYear() - start.getFullYear();
        let months = now.getMonth() - start.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        if (years === 0 && months === 0) return 'Baru bergabung';
        if (years === 0) return `${months} Bulan`;
        if (months === 0) return `${years} Tahun`;
        return `${years} Tahun ${months} Bulan`;
    };

    const handleEditChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const isChangingPassword = editForm.newPassword || editForm.currentPassword;

        if (isChangingPassword) {
            if (!editForm.currentPassword) {
                addToast('Password saat ini wajib diisi', 'error');
                return;
            }
            if (editForm.newPassword.length < 6) {
                addToast('Password baru minimal 6 karakter', 'error');
                return;
            }
            if (editForm.newPassword !== editForm.confirmPassword) {
                addToast('Konfirmasi password tidak cocok', 'error');
                return;
            }
        }

        try {
            setSaving(true);

            const updateData = {
                phone: editForm.phone || null,
                address: editForm.address || null,
                taxStatus: editForm.taxStatus || null
            };

            if (editForm.newPassword) {
                updateData.currentPassword = editForm.currentPassword;
                updateData.newPassword = editForm.newPassword;
            }

            await employeeApi.updateMe(updateData);
            addToast('Profil berhasil diperbarui', 'success');
            setIsEditOpen(false);
            await fetchProfile();

            setEditForm(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (err) {
            const errorMsg = err.response?.data?.errors || err.response?.data?.errors || 'Gagal menyimpan perubahan';
            addToast(errorMsg, 'error');
        } finally {
            setSaving(false);
        }
    };

    const openEdit = () => {
        if (!profile) return;
        setEditForm(prev => ({
            ...prev,
            phone: profile.phone || '',
            address: profile.address || '',
            taxStatus: profile.taxStatus || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }));
        setIsEditOpen(true);
    };

    const formatRupiah = (val) => {
        if (!val && val !== 0) return '-';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.85,
            y: 30,
            filter: "blur(4px)"
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                stiffness: 350,
                damping: 13,
                mass: 0.8
            }
        },
        exit: {
            opacity: 0,
            scale: 0.92,
            y: 15,
            filter: "blur(2px)",
            transition: {
                duration: 0.2,
                ease: [0.32, 0.72, 0, 1]
            }
        }
    };

    const formatDate = (val) => {
        if (!val) return '-';
        return new Date(val).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const getRoleLabel = (role) => {
        if (role === 'SUPER_ADMIN') return 'Super Admin';
        if (role === 'HR_ADMIN') return 'HR Admin';
        return 'Karyawan';
    };

    const getRoleColor = (role) => {
        if (role === 'SUPER_ADMIN') return isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700';
        if (role === 'HR_ADMIN') return isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700';
        return isDark ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700';
    };

    const displayValue = (val) => {
        if (val === null || val === undefined || val === '') return 'Belum diisi';
        return val;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-[#ff6b00]" />
                <p className={`text-sm mt-3 ${textSecondary}`}>Memuat profil...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p className={textSecondary}>Profil tidak ditemukan</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Header Card */}
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className={`relative overflow-hidden rounded-2xl border shadow-sm ${cardBg}`}
            >
                <div className="h-28 sm:h-32 bg-[#ff6b00] relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
                </div>

                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="relative -mt-12 sm:-mt-16 mb-4 flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4">
                        <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 shadow-lg flex items-center justify-center text-[#ff6b00] font-bold text-3xl sm:text-4xl relative overflow-hidden ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-white'}`}>
                            {profile.avatar ? (
                                <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <User className={`w-10 h-10 sm:w-16 sm:h-16 ${isDark ? 'text-gray-400' : ''}`} />
                            )}
                        </div>
                        <div className="flex-1 mb-1">
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                <h1 className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>{profile.username}</h1>
                                <span className={`inline-flex px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getRoleColor(profile.role)}`}>
                                    {getRoleLabel(profile.role)}
                                </span>
                            </div>
                            <p className={`text-xs sm:text-sm mt-1 ${textSecondary}`}>{profile.email}</p>
                        </div>

                        <motion.button
                            onClick={openEdit}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#ff6b00] hover:bg-[#e05e00] text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-sm"
                        >
                            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            Edit Profil
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Info Pribadi */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className={`rounded-xl border shadow-sm p-4 sm:p-5 ${cardBg}`}
                    >
                        <h3 className={`text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2 ${textPrimary}`}>
                            <Shield className="w-4 h-4 text-[#ff6b00]" />
                            Informasi Pribadi
                        </h3>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                        >
                            {[
                                { icon: Mail, color: 'blue', label: 'Email', value: profile.email },
                                { icon: Phone, color: 'emerald', label: 'No. Telepon', value: displayValue(profile.phone) },
                                { icon: Calendar, color: 'purple', label: 'Tanggal Bergabung', value: formatDate(profile.joinDate) },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeInUp}
                                    className="flex items-start gap-3"
                                >
                                    <div className={`p-2 rounded-lg ${isDark ? `bg-${item.color}-900/30 text-${item.color}-400` : `bg-${item.color}-50 text-${item.color}-600`}`}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className={`text-[10px] sm:text-xs ${textMuted}`}>{item.label}</p>
                                        <p className={`text-xs sm:text-sm font-semibold ${textBody}`}>{item.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                            <motion.div variants={fadeInUp} className="flex items-start gap-3 sm:col-span-2">
                                <div className={`p-2 rounded-lg ${isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className={`text-[10px] sm:text-xs ${textMuted}`}>Alamat</p>
                                    <p className={`text-xs sm:text-sm font-semibold whitespace-pre-wrap ${profile.address ? textBody : 'text-gray-400 italic'}`}>
                                        {displayValue(profile.address)}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Info Kepegawaian */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className={`rounded-xl border shadow-sm p-4 sm:p-5 ${cardBg}`}
                    >
                        <h3 className={`text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2 ${textPrimary}`}>
                            <Briefcase className="w-4 h-4 text-[#ff6b00]" />
                            Informasi Kepegawaian
                        </h3>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                        >
                            {[
                                { icon: Shield, color: 'gray', label: 'NIK', value: profile.nik },
                                { icon: Building2, color: 'blue', label: 'Departemen', value: profile.department },
                                { icon: Briefcase, color: 'amber', label: 'Jabatan', value: profile.position },
                                { icon: BadgeDollarSign, color: 'emerald', label: 'Gaji Pokok', value: formatRupiah(profile.basicSalary), isCurrency: true },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeInUp}
                                    className="flex items-start gap-3"
                                >
                                    <div className={`p-2 rounded-lg ${isDark ? `bg-${item.color}-900/30 text-${item.color}-400` : `bg-${item.color}-50 text-${item.color}-600`}`}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className={`text-[10px] sm:text-xs ${textMuted}`}>{item.label}</p>
                                        <p className={`text-xs sm:text-sm font-semibold ${item.isCurrency ? 'text-emerald-600 dark:text-emerald-400' : textBody}`}>{item.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Status */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className={`rounded-xl border shadow-sm p-4 sm:p-5 ${cardBg}`}
                    >
                        <h3 className={`text-xs sm:text-sm font-bold mb-3 ${textPrimary}`}>Status</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                                <span className={textMuted}>Status Karyawan</span>
                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium ${profile.status === 'ACTIVE'
                                    ? (isDark ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700')
                                    : (isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700')}`}>
                                    {profile.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                                <span className={textMuted}>Status Pajak</span>
                                <span className={`font-semibold ${profile.taxStatus ? textBody : 'text-gray-400 italic'}`}>
                                    {displayValue(profile.taxStatus)}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Ringkasan */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className={`rounded-xl border shadow-sm p-4 sm:p-5 ${cardBg}`}
                    >
                        <h3 className={`text-xs sm:text-sm font-bold mb-3 ${textPrimary}`}>Ringkasan</h3>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="space-y-3"
                        >
                            {[
                                { label: 'Masa Kerja', value: summary.masaKerja, color: 'text-[#ff6b00]', bg: isDark ? 'bg-[#ff6b00]/20' : 'bg-[#ff6b00]/10' },
                                { label: 'Total Lembur (Bulan Ini)', value: summary.totalOvertimeHours !== null ? `${summary.totalOvertimeHours} Jam` : null, color: 'text-blue-600 dark:text-blue-400', bg: isDark ? 'bg-blue-900/30' : 'bg-blue-50' },
                                { label: 'Gaji Bersih Terakhir', value: summary.latestNetSalary !== null ? formatRupiah(summary.latestNetSalary) : null, color: 'text-emerald-600 dark:text-emerald-400', bg: isDark ? 'bg-emerald-900/30' : 'bg-emerald-50' },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeInUp}
                                    className={`p-3 rounded-lg ${item.bg}`}
                                >
                                    <p className={`text-[10px] sm:text-xs ${textMuted}`}>{item.label}</p>
                                    <p className={`font-bold text-sm sm:text-base ${item.color}`}>
                                        {item.value !== null ? item.value : 'Belum tersedia'}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Modal Edit */}
            <AnimatePresence>
                {isEditOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            className={`w-full max-w-[calc(100%-1rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border shadow-xl p-4 sm:p-6 ${isDark ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-gray-100'}`}
                        >
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h2 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${textPrimary}`}>
                                    <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff6b00]" />
                                    Edit Profil
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsEditOpen(false)}
                                    className="p-1.5 rounded-md hover:bg-black/5 transition-colors"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
                                <div className="space-y-3 sm:space-y-4">
                                    <h3 className={`text-xs sm:text-sm font-semibold uppercase tracking-wider ${textMuted}`}>Informasi Pribadi</h3>

                                    <div>
                                        <label className={`block text-xs sm:text-sm font-medium mb-1 ${textBody}`}>No. Telepon</label>
                                        <input
                                            type="tel"
                                            value={editForm.phone}
                                            onChange={(e) => handleEditChange('phone', e.target.value)}
                                            className={`w-full px-3 py-2 sm:py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ff6b00] text-xs sm:text-sm ${inputBg}`}
                                            placeholder="0812xxxxxxx"
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-xs sm:text-sm font-medium mb-1 ${textBody}`}>Alamat</label>
                                        <textarea
                                            value={editForm.address}
                                            onChange={(e) => handleEditChange('address', e.target.value)}
                                            rows={3}
                                            className={`w-full px-3 py-2 sm:py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ff6b00] text-xs sm:text-sm resize-none ${inputBg}`}
                                            placeholder="Jl. Mawar No. 1..."
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-xs sm:text-sm font-medium mb-1 ${textBody}`}>Status Pajak</label>
                                        <select
                                            value={editForm.taxStatus}
                                            onChange={(e) => handleEditChange('taxStatus', e.target.value)}
                                            className={`w-full px-3 py-2 sm:py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ff6b00] text-xs sm:text-sm ${inputBg}`}
                                        >
                                            <option value="">Pilih Status Pajak</option>
                                            <option value="tk0">TK/0</option>
                                            <option value="tk1">TK/1</option>
                                            <option value="tk2">TK/2</option>
                                            <option value="tk3">TK/3</option>
                                            <option value="k0">K/0</option>
                                            <option value="k1">K/1</option>
                                            <option value="k2">K/2</option>
                                            <option value="k3">K/3</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />

                                <div className="space-y-3 sm:space-y-4">
                                    <h3 className={`text-xs sm:text-sm font-semibold uppercase tracking-wider ${textMuted}`}>Ubah Password</h3>
                                    <p className={`text-[10px] sm:text-xs ${textMuted}`}>Kosongkan jika tidak ingin mengubah password</p>

                                    <div>
                                        <label className={`block text-xs sm:text-sm font-medium mb-1 ${textBody}`}>Password Saat Ini</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.current ? 'text' : 'password'}
                                                value={editForm.currentPassword}
                                                onChange={(e) => handleEditChange('currentPassword', e.target.value)}
                                                className={`w-full px-3 py-2 sm:py-2.5 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ff6b00] text-xs sm:text-sm ${inputBg}`}
                                                placeholder="••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                                {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <label className={`block text-xs sm:text-sm font-medium mb-1 ${textBody}`}>Password Baru</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword.new ? 'text' : 'password'}
                                                    value={editForm.newPassword}
                                                    onChange={(e) => handleEditChange('newPassword', e.target.value)}
                                                    className={`w-full px-3 py-2 sm:py-2.5 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ff6b00] text-xs sm:text-sm ${inputBg}`}
                                                    placeholder="Minimal 6 karakter"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className={`block text-xs sm:text-sm font-medium mb-1 ${textBody}`}>Konfirmasi Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword.confirm ? 'text' : 'password'}
                                                    value={editForm.confirmPassword}
                                                    onChange={(e) => handleEditChange('confirmPassword', e.target.value)}
                                                    className={`w-full px-3 py-2 sm:py-2.5 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ff6b00] text-xs sm:text-sm ${inputBg}`}
                                                    placeholder="Ulangi password baru"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 sm:gap-3 pt-2">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsEditOpen(false)}
                                        className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium border transition-colors ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        Batal
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        disabled={saving}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ff6b00] hover:bg-[#e05e00] text-white rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {saving ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                        Simpan Perubahan
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;