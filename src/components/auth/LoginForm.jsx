import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuthFormCard from './AuthFormCard';
import api from '../../config/api';
import { useLoading } from "../../contexts/LoadingContext";
import { useAuth } from '../../contexts/AuthContext';

const GoogleIcon = () => (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.85 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.86-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg className="w-4 h-4 shrink-0 fill-[#323E48]" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
);

// Variants untuk staggered animation
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
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' }
    }
};

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { showLoading, hideLoading } = useLoading();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        hideLoading();
    }, [hideLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        showLoading();

        try {
            const response = await api.post('/api/users/login', { email, password });
            const apiData = response.data?.data || response.data;

            if (!apiData || !apiData.token) {
                throw new Error('Data login tidak valid');
            }

            const userData = {
                name: apiData.username || apiData.name || 'User',
                email: apiData.email,
                role: apiData.role,
                token: apiData.token,
            };

            login(userData);
            await new Promise(resolve => setTimeout(resolve, 2500));
            hideLoading();

            navigate('/dashboard', {
                state: { fromLogin: 'Login berhasil!' }
            });

        } catch (err) {
            const message = err.response?.data?.errors ?? 'Tidak dapat terhubung ke server. Coba lagi.';
            setError(message);
            hideLoading();
        } finally {
            hideLoading();
        }
    };

    return (
        <AuthFormCard title="Masuk" subtitle="Senang bertemu denganmu lagi!">
            
            <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-2 sm:space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >

                {/* Error message */}
                {error && (
                    <motion.div variants={itemVariants}>
                        <div className="px-3 py-2 rounded-md bg-red-50 border border-red-200 text-[11px] text-red-600 font-medium">
                            {error}
                        </div>
                    </motion.div>
                )}

                {/* Email */}
                <motion.div variants={itemVariants} className="space-y-0.5">
                    <label className="text-[11px] font-semibold text-[#54606b]" htmlFor="email">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#54606b] pointer-events-none" />
                        <input
                            id="email" type="email" required placeholder="name@paylocity.com"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-md border border-[#e4e2de] bg-[#F6F4F0] text-xs 
                            focus:ring-2 focus:ring-[#ED5807]/20 focus:border-[#ED5807] outline-none transition-all
                            disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    </div>
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants} className="space-y-0.5">
                    <label className="text-[11px] font-semibold text-[#54606b]" htmlFor="password">Kata Sandi</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#54606b] pointer-events-none" />
                        <input
                            id="password" type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-9 pr-9 py-2 rounded-md border border-[#e4e2de] bg-[#F6F4F0] text-xs focus:ring-2 
                            focus:ring-[#ED5807]/20 focus:border-[#ED5807] outline-none transition-all
                            disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute 
                        right-3 top-1/2 -translate-y-1/2 text-[#54606b] hover:text-[#323E48] transition-colors">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </motion.div>

                {/* Remember & Forgot */}
                <motion.div variants={itemVariants} className="flex items-center justify-between gap-2 pt-0.5">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                            type="checkbox" checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-[#e4e2de] text-[#ED5807] focus:ring-[#ED5807] cursor-pointer shrink-0"
                        />
                        <span className="text-[11px] text-[#54606b]">Ingatkan saya</span>
                    </label>
                    <a onClick={() => navigate('#forget')} className="text-[11px] text-[#ED5807] hover:text-[#a33900] font-semibold transition-colors shrink-0">Lupa?</a>
                </motion.div>

                {/* Submit */}
                <motion.div variants={itemVariants}>
                    <button
                        type="submit"
                        className="w-full bg-[#ED5807] hover:bg-[#d64f06] text-white font-semibold py-2.5 rounded-md text-xs 
                        border-2 border-[#323E48] shadow-[2px_2px_0px_#323E48] active:shadow-none active:translate-x-0.5 
                        active:translate-y-0.5 transition-all flex items-center justify-center gap-2 group
                        disabled:opacity-60 disabled:cursor-not-allowed disabled:active:shadow-[2px_2px_0px_#323E48]
                        disabled:active:translate-x-0 disabled:active:translate-y-0"
                    >
                        Masuk
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>

            </motion.form>

            {/* Divider */}
            <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mt-4 mb-4 relative flex items-center"
            >
                <div className="grow border-t border-[#e4e2de]" />
                <span className="mx-2 text-[10px] text-[#54606b] uppercase tracking-widest font-semibold">Atau</span>
                <div className="grow border-t border-[#e4e2de]" />
            </motion.div>

            {/* Social */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-2"
            >
                <motion.button variants={itemVariants} className="flex items-center justify-center gap-1.5 py-2 px-1 border-2 border-[#323E48] rounded-md 
                bg-white hover:bg-[#F6F4F0] transition-all font-semibold text-[#323E48] shadow-[2px_2px_0px_#323E48] 
                active:shadow-none active:translate-x-px active:translate-y-px text-[11px]">
                    <GoogleIcon /><span className="truncate">Google</span>
                </motion.button>
                <motion.button variants={itemVariants} className="flex items-center justify-center gap-1.5 py-2 px-1 border-2 border-[#323E48] rounded-md 
                bg-white hover:bg-[#F6F4F0] transition-all font-semibold text-[#323E48] shadow-[2px_2px_0px_#323E48] 
                active:shadow-none active:translate-x-px active:translate-y-px text-[11px]">
                    <LinkedInIcon /><span className="truncate">LinkedIn</span>
                </motion.button>
            </motion.div>

            <motion.p 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mt-4 text-center text-[11px] text-[#54606b]"
            >
                Belum punya akun?{' '}
                <span className="text-[#ED5807] font-bold">
                    Hubungi admin
                </span>
            </motion.p>
        </AuthFormCard>
    );
};

export default LoginForm;