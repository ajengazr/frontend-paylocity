import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '../../animations/variants';

const FiveSection = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login');
    };

    return (
        <section className="py-16 sm:py-20 md:py-24 bg-[#fbf9f8] overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={staggerContainer}
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="relative bg-linear-to-br from-[#ff6b00] to-[#e55e00] rounded-3xl sm:rounded-[2rem] md:rounded-[2.5rem] p-8 sm:p-12 md:p-16 text-white text-center shadow-[0_20px_60px_rgba(255,107,0,0.25)] overflow-hidden"
                >
                    {/* Glow orb top-right */}
                    <motion.div
                        className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Glow orb bottom-left */}
                    <motion.div
                        className="absolute -bottom-24 -left-24 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />

                    <motion.h2
                        variants={fadeInUp}
                        className="text-xl sm:text-2xl md:text-4xl font-bold leading-tight mb-4 sm:mb-6"
                    >
                        Siap Mendigitalisasi Payroll Anda?
                    </motion.h2>

                    <motion.p
                        variants={fadeInUp}
                        className="text-base sm:text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed"
                    >
                        Bergabunglah dengan ribuan perusahaan di Indonesia yang telah beralih ke efisiensi maksimal bersama PAYLOCITY.
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center mt-8 sm:mt-12"
                    >
                        <motion.button
                            type="button"
                            onClick={handleClick}
                            whileHover={{ scale: 1.05, y: -3 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white text-[#ff6b00] font-semibold text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 rounded-2xl hover:shadow-2xl transition-shadow cursor-pointer shadow-lg"
                        >
                            Coba Gratis Sekarang
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default FiveSection;