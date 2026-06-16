import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import adminApi from '../../config/adminApi';
import { useToast } from '../../contexts/ToastContext';

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

const modalContentVariants = {
    hidden: { scale: 0.9, y: 30, opacity: 0 },
    visible: { 
        scale: 1, 
        y: 0, 
        opacity: 1,
        transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }
    },
    exit: { 
        scale: 0.95, 
        y: 20, 
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

const RegisterForm = ({
    isModal = false,
    onClose,
    onSuccess,
}) => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const { addToast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (form.password !== form.confirmPassword) {
            setError('Kata sandi dan konfirmasi tidak cocok.');
            return;
        }

        setSubmitting(true);

        try {
            await adminApi.create({
                username: form.username,
                email: form.email,
                password: form.password,
                role: 'HR_ADMIN',
            }); 

            setSuccess('Admin berhasil ditambahkan!');
            addToast('Admin berhasil ditambahkan!', 'success');
            setForm({ username: '', email: '', password: '', confirmPassword: '' });

            setTimeout(() => {
                onSuccess?.();
            }, 800);

        } catch (err) {
            const message = err.response?.data?.errors ?? 'Gagal menambahkan admin.';
            setError(message);
            addToast(message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const cardContent = (
        <div className="w-full max-w-sm mx-auto">
            <div className="bg-white rounded-2xl border-2 border-[#323E48] shadow-[4px_4px_0px_#323E48] p-6 sm:p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-[#151c27]">Tambah Admin</h2>
                    <p className="text-sm text-gray-500 mt-1">Buat akun admin baru</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Error */}
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }} 
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                                    {error}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Success */}
                    {success && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-600"
                        >
                            {success}
                        </motion.div>
                    )}

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-[#151c27]">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                name="username"
                                type="text"
                                required
                                placeholder="Masukkan username"
                                value={form.username}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-[#f5f5f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/30 focus:border-[#ff6b00] transition-all"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-[#151c27]">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="admin@company.com"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-[#f5f5f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/30 focus:border-[#ff6b00] transition-all"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-[#151c27]">Kata Sandi</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="Min. 6 karakter"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-[#f5f5f0] text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/30 focus:border-[#ff6b00] transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-[#151c27]">Konfirmasi Kata Sandi</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                placeholder="Konfirmasi password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/30 focus:border-[#ff6b00] transition-all bg-[#f5f5f0] ${
                                    form.confirmPassword && form.password !== form.confirmPassword 
                                        ? 'border-red-400' 
                                        : 'border-gray-200'
                                }`}
                            />
                        </div>
                        {form.confirmPassword && form.password !== form.confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">Kata sandi tidak cocok</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#ff6b00] hover:bg-[#e05e00] text-white font-semibold py-3 rounded-xl text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
                    >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {submitting ? 'Memproses...' : 'Buat Akun'}
                    </button>
                </form>
            </div>
        </div>
    );

    // ========== MODAL MODE ==========
    if (isModal) {
        return (
            <motion.div 
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <motion.div 
                    className="relative w-full max-w-md"
                    variants={modalContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Close Button */}
                    <motion.button
                        onClick={onClose}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white border-2 border-[#323E48] shadow-[2px_2px_0px_#323E48] flex items-center justify-center text-[#323E48] hover:text-[#ff6b00] transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </motion.button>
                    
                    {cardContent}
                </motion.div>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#f9f9ff]">
            {cardContent}
        </div>
    );
};

export default RegisterForm;