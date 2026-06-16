import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeInUp } from '../../animations/variants';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const words = [
        "Bekerja Keras",
        "Cerdas",
        "Efisien",
        "Cepat",
        "Akurat",
        "Otomatis",
        "Terintegrasi"
    ];

    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [words.length]);

    // Fallback container variants untuk stagger
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.15
            }
        }
    };

    // Fallback jika fadeInUp tidak tersedia
    const itemVariants = fadeInUp || {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] }
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="pt-20 sm:pt-24 pb-12 sm:pb-20 bg-linear-to-br from-[#fbf9f8] via-white to-[#E9F5FE] min-h-screen flex items-center overflow-hidden">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-6xl mx-auto px-4 sm:px-5 w-full"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-12 items-center">
                    
                    {/* Text Content */}
                    <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                        
                        {/* Badge */}
                        <motion.div variants={itemVariants}>
                            <motion.div 
                                className="inline-flex items-center gap-2 bg-white rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm border shadow-sm"
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.span 
                                    className="w-2 h-2 rounded-full bg-emerald-500"
                                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span>Aplikasi Payroll Tercepat di Indonesia</span>
                            </motion.div>
                        </motion.div>

                        {/* Heading */}
                        <motion.div variants={itemVariants} className="space-y-1">
                            <h1 className="text-[1.65rem] sm:text-4xl md:text-5xl font-bold leading-[1.2] sm:leading-tight text-[#1b1c1c] tracking-tight sm:tracking-tighter">
                                <span className="block sm:inline">Proses Payroll & HR yang{' '}</span>
                                
                                {/* Rotating Words */}
                                <span
                                    className="relative inline-block overflow-hidden h-[1.3em] sm:h-[1.25em] align-bottom text-[#ff6b00] w-[9ch] sm:w-auto"
                                    style={{ perspective: '600px' }}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={index}
                                            initial={{ y: 40, opacity: 0, rotateX: -30 }}
                                            animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                            exit={{ y: -40, opacity: 0, rotateX: 30 }}
                                            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                                            className="inline-block whitespace-nowrap"
                                        >
                                            {words[index]}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                                
                                <span className="block mt-1">Seperti Anda.</span>
                            </h1>
                        </motion.div>

                        {/* Description */}
                        <motion.p 
                            variants={itemVariants}
                            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed"
                        >
                            Tingkatkan efisiensi operasional Anda dengan sistem manajemen SDM yang cerdas, otomatis, dan terintegrasi penuh untuk masa depan bisnis Anda.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div 
                            variants={itemVariants}
                            className="flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4"
                        >
                            <motion.button
                                type="button"
                                onClick={() => handleNavigate('/contact')}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="group bg-[#ff6b00] hover:bg-[#e55e00] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-semibold flex items-center gap-2 sm:gap-3 transition-colors shadow-xl shadow-[#ff6b00]/20 text-sm sm:text-base"
                            >
                                Hubungi Kami
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </motion.button>

                            <motion.button
                                type="button"
                                onClick={() => handleNavigate('/about')}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="border-2 border-[#ff6b00] text-[#ff6b00] px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-semibold hover:bg-[#ff6b00]/5 transition-colors text-sm sm:text-base"
                            >
                                Pelajari Lebih Lanjut
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Image Side */}
                    <motion.div
                        variants={itemVariants}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
                        className="relative flex justify-center order-1 lg:order-2"
                    >
                        <div className="relative w-full max-w-[16rem] sm:max-w-[20rem] md:max-w-[24rem] lg:max-w-[26.25rem] mx-auto">
                            <motion.div 
                                className="bg-white rounded-3xl overflow-hidden aspect-square flex items-center justify-center shadow-2xl shadow-gray-200/50"
                                whileHover={{ scale: 1.02, rotate: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <img
                                    src="https://plus.unsplash.com/premium_photo-1779747617945-e9a831cfad95?q=80&w=1135&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="Ilustrasi Payroll Modern"
                                    className="w-full h-full object-cover rounded-3xl"
                                    loading="eager"
                                />
                            </motion.div>

                            {/* Floating Card */}
                            <motion.div
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-2 sm:-bottom-4 right-3 sm:right-8 bg-white rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 shadow-xl flex items-center gap-2 sm:gap-3"
                            >
                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
                                <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">Hanya 1 Menit*</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;