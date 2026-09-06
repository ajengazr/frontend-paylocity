import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer } from '../../animations/variants';
import { useNavigate } from 'react-router-dom';

const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
};

const AuthLeftPanel = () => {
    const navigate = useNavigate();
    return (
        <motion.section 
            className="w-full lg:w-1/2 relative flex flex-col justify-center items-center p-4 sm:p-6 lg:h-screen overflow-hidden min-h-50 sm:min-h-70 lg:min-h-0 bg-gradient-to-br from-[#ff7a1a] via-[#E25605] to-[#c2410c]"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
        >
            <motion.div 
                variants={itemVariants}
                className="absolute top-3 left-3 sm:top-6 sm:left-6 z-20"
            >
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex items-center gap-1 sm:gap-2 text-white/90 hover:text-white 
                    bg-white/10 hover:bg-white/20 backdrop-blur-sm 
                    px-2 py-1.5 sm:px-4 sm:py-2.5 
                    rounded-full text-[10px] sm:text-sm font-medium 
                    transition-all border border-white/20 hover:border-white/40 group"
                >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span className="hidden sm:inline">Ke Beranda</span>
                    <span className="sm:hidden">Beranda</span>
                </button>
            </motion.div>

            {/* Decorative Blobs */}
            <motion.div 
                variants={itemVariants}
                className="absolute inset-0 pointer-events-none"
            >
                <motion.div 
                    className="absolute top-[-10%] left-[-10%] w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl animate-blob"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div 
                    className="absolute bottom-[-5%] right-[-5%] w-48 h-48 sm:w-96 sm:h-96 bg-black/10 rounded-full blur-3xl animate-blob"
                    animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Partikel kecil mengambang */}
                <motion.div
                    animate={{ y: [0, -30, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[18%] right-[14%] w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/25 blur-[1px]"
                />
                <motion.div
                    animate={{ y: [0, 26, 0], x: [0, 12, 0] }}
                    transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-[22%] left-[12%] w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/20"
                />
                <motion.div
                    animate={{ y: [0, -18, 0], x: [0, -14, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[40%] left-[10%] w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-white/30"
                />

                {/* Gelembung melayang */}
                <motion.div
                    animate={{ y: [0, -40, 0], opacity: [0.2, 0.7, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[62%] right-[18%] w-6 h-6 sm:w-9 sm:h-9 rounded-full border border-white/25"
                />
                <motion.div
                    animate={{ y: [0, 32, 0], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[28%] right-[30%] w-3 h-3 sm:w-5 sm:h-5 rounded-full border border-white/20"
                />
            </motion.div>

            <div className="relative z-10 w-full max-w-md text-center flex flex-col items-center">
                
                <motion.div 
                    variants={itemVariants}
                    className="mb-3 sm:mb-6 xl:mb-8"
                >
                    <motion.div
                        animate={{ rotate: [0, 2, 0, -2, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 xl:w-56 xl:h-56 bg-white rounded-[30%_70%_70%_30%/30%_30%_70%_70%] overflow-hidden border-2 sm:border-4 border-[#323E48] shadow-[4px_4px_0px_rgba(0,0,0,0.2)] sm:shadow-[8px_8px_0px_rgba(0,0,0,0.2)] glow-orange"
                    >
                        <img
                            alt="Welcome"
                            className="w-full h-full object-cover"
                            src="/src/assets/about.png"
                            loading="lazy"
                        />
                    </motion.div>
                </motion.div>

                <motion.h1 
                    variants={itemVariants}
                    className="text-base sm:text-2xl xl:text-4xl font-bold text-white mb-2 sm:mb-3 leading-tight"
                >
                    Selamat datang di{' '} <br className="hidden sm:block"/>
                    <span className="underline decoration-white/30 decoration-2 sm:decoration-4 underline-offset-4 sm:underline-offset-8">
                        masa depan HR
                    </span>
                </motion.h1>

                {/* Paragraph */}
                <motion.p 
                    variants={itemVariants}
                    className="text-[11px] sm:text-sm xl:text-base text-white/80 max-w-55 sm:max-w-sm"
                >
                    Kelola tenaga kerja Anda dengan lebih efisien, cepat, dan modern bersama Paylocity.
                </motion.p>
            </div>
        </motion.section>
    );
};

export default AuthLeftPanel;