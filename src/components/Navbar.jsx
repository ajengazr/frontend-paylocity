import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { staggerContainer } from '../animations/variants';

const navItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
};

const mobileMenuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
        height: 'auto', 
        opacity: 1,
        transition: { duration: 0.35, ease: 'easeInOut' }
    },
    exit: { height: 0, opacity: 0, transition: { duration: 0.25, ease: 'easeInOut' } }
};

const Navbar = ({ headerOpacity }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleNavigate = (path) => {
        setIsMobileMenuOpen(false);
        navigate(path);
    };

    const navLinks = [
        { label: 'Beranda', path: '/' },
        { label: 'Tentang Kami', path: '/about' },
        { label: 'Bantuan', path: '/help' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <motion.nav
            style={{ opacity: headerOpacity }}
            className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/60"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
            <div className="max-w-6xl mx-auto px-3 sm:px-5 py-3 sm:py-4 flex items-center justify-between">
                
                {/* Logo */}
                <motion.div 
                    className="flex items-center gap-2 sm:gap-3"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                >
                    <img
                        src="/logo.png"
                        alt="Paylocity Logo"
                        className="w-20 h-10 sm:w-24 sm:h-12 md:w-28 md:h-14 object-contain"
                    />
                </motion.div>

                {/* Desktop Menu */}
                <motion.div 
                    className="hidden md:flex items-center gap-6 lg:gap-10 text-[#1b1c1c]"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {navLinks.map((link) => {
                        const active = isActive(link.path);
                        return (
                            <motion.button
                                key={link.path}
                                variants={navItemVariants}
                                onClick={() => handleNavigate(link.path)}
                                className={`relative font-medium text-sm lg:text-base py-1 transition-colors ${active ? 'text-[#ff6b00]' : 'text-[#1b1c1c] hover:text-[#ff6b00]'}`}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {link.label}
                                <motion.span
                                    layoutId="nav-underline"
                                    className="absolute -bottom-0.5 left-0 h-0.5 bg-[#ff6b00]"
                                    initial={false}
                                    animate={{ width: active ? '100%' : '0%' }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                />
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* Desktop CTA + Mobile Hamburger */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <motion.button
                        onClick={() => handleNavigate('/login')}
                        className="shine hidden md:block text-xs lg:text-sm px-5 lg:px-6 py-2 lg:py-2.5 bg-[#ff6b00] text-white rounded-full hover:bg-[#e55e00] transition-all font-medium shadow-lg shadow-[#ff6b00]/25"
                        whileHover={{ scale: 1.06, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Masuk
                    </motion.button>

                    {/* Mobile Menu Toggle */}
                    <motion.button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
                        whileTap={{ scale: 0.9 }}
                        aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
                        aria-expanded={isMobileMenuOpen}
                    >
                        <AnimatePresence mode="wait">
                            {isMobileMenuOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X className="w-5 h-5 text-[#1b1c1c]" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu className="w-5 h-5 text-[#1b1c1c]" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md border-b border-gray-100"
                    >
                        <motion.div 
                            className="px-3 py-4 space-y-1"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {navLinks.map((link, index) => {
                                const active = isActive(link.path);
                                return (
                                    <motion.button
                                        key={link.path}
                                        variants={navItemVariants}
                                        custom={index}
                                        onClick={() => handleNavigate(link.path)}
                                        className={`block w-full text-left text-xs sm:text-sm font-medium transition-colors py-2.5 px-3 rounded-lg ${active
                                            ? 'bg-[#ff6b00]/10 text-[#ff6b00]'
                                            : 'text-[#1b1c1c] hover:bg-[#ff6b00]/5 hover:text-[#ff6b00]'
                                        }`}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {link.label}
                                    </motion.button>
                                );
                            })}
                            <motion.button
                                variants={navItemVariants}
                                onClick={() => handleNavigate('/login')}
                                className="w-full text-xs sm:text-sm py-2.5 mt-2 border border-[#ff6b00] text-[#ff6b00] rounded-full hover:bg-[#ff6b00]/5 transition-all font-medium"
                                whileTap={{ scale: 0.98 }}
                            >
                                Masuk
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;