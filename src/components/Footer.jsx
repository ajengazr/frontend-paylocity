import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/variants";

const Footer = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = fadeInUp || {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.32, 0.72, 0, 1]
            }
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-[#fdefe6] text-gray-800 overflow-hidden">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerVariants}
                className="max-w-6xl mx-auto px-4 sm:px-5 py-12 sm:py-16 md:py-20"
            >
                {/* Grid: 1 col (320px+) → 2 col (sm) → 4 col (lg) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
                    
                    {/* Brand Column */}
                    <motion.div variants={itemVariants}>
                        <motion.div 
                            className="flex items-center gap-3"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img
                                src="/logo.png"
                                alt="Paylocity Logo"
                                className="w-20 h-10 sm:w-24 sm:h-12 object-contain"
                                loading="lazy"
                            />
                        </motion.div>
                        <p className="text-sm leading-relaxed mt-4 text-gray-700 text-justify">
                            PAYLOCITY menyediakan solusi manajemen penggajian yang mudah dan terintegrasi untuk pemilik usaha, staff HR, dan karyawan dengan harga terjangkau.
                        </p>
                    </motion.div>

                    {/* Produk — TANPA hover */}
                    <motion.div variants={itemVariants}>
                        <h3 className="font-semibold mb-4 sm:mb-5 text-[#1b1c1c] text-sm uppercase tracking-wider">
                            Produk
                        </h3>
                        <ul className="space-y-2 sm:space-y-3">
                            {[
                                { label: 'Fitur Penggajian', path: '/about' },
                                { label: 'Pajak PPh 21', path: '/about' },
                                { label: 'Manajemen Absensi', path: '/about' },
                            ].map((link, index) => (
                                <motion.li
                                    key={index}
                                    whileHover={{ x: 4 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleNavigate(link.path)}
                                        className="group relative text-sm text-gray-700 hover:text-[#ff6b00] transition-colors duration-300 cursor-pointer text-left w-full py-1"
                                    >
                                        <span className="relative">
                                            {link.label}
                                            <span className="absolute left-0 -bottom-0.5 w-0 h-[1.5px] bg-[#ff6b00] transition-all duration-300 group-hover:w-full" />
                                        </span>
                                    </button>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Perusahaan — DENGAN hover */}
                    <motion.div variants={itemVariants}>
                        <h3 className="font-semibold mb-4 sm:mb-5 text-[#1b1c1c] text-sm uppercase tracking-wider">
                            Perusahaan
                        </h3>
                        <ul className="space-y-2 sm:space-y-3">
                            {[
                                { label: "Tentang Kami", path: "/about" },
                                { label: "Bantuan", path: "/help" },
                                { label: "Kontak Kami", path: "/contact" },
                            ].map((link, index) => (
                                <motion.li 
                                    key={index}
                                    whileHover={{ x: 4 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleNavigate(link.path)}
                                        className="group relative text-sm text-gray-700 hover:text-[#ff6b00] transition-colors duration-300 cursor-pointer text-left w-full py-1"
                                    >
                                        <span className="relative">
                                            {link.label}
                                            <span className="absolute left-0 -bottom-0.5 w-0 h-[1.5px] bg-[#ff6b00] transition-all duration-300 group-hover:w-full" />
                                        </span>
                                    </button>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Bantuan & Lokasi — DENGAN hover */}
                    <motion.div variants={itemVariants}>
                        <h3 className="font-semibold mb-4 sm:mb-5 text-[#1b1c1c] text-sm uppercase tracking-wider">
                            Bantuan & Lokasi
                        </h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <motion.li 
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                            >
                                <button
                                    type="button"
                                    onClick={() => handleNavigate('/help')}
                                    className="group relative text-sm text-gray-700 hover:text-[#ff6b00] transition-colors duration-300 cursor-pointer text-left w-full py-1"
                                >
                                    <span className="relative">
                                        Pusat Bantuan
                                        <span className="absolute left-0 -bottom-0.5 w-0 h-[1.5px] bg-[#ff6b00] transition-all duration-300 group-hover:w-full" />
                                    </span>
                                </button>
                            </motion.li>
                            <li className="pt-2 text-xs sm:text-sm leading-relaxed text-gray-700">
                                <div className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ff6b00] shrink-0" />
                                    <span>
                                        The East Tower, Lt 37, Jakarta Selatan<br />
                                        12950 - Indonesia
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Copyright — tanpa hover */}
                <motion.div 
                    variants={itemVariants}
                    className="border-t border-orange-200/60 mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8"
                >
                    <p className="text-xs text-center text-gray-500">
                        © 2024 PAYLOCITY. Semua Hak Dilindungi.
                    </p>
                </motion.div>
            </motion.div>
        </footer>
    );
};

export default Footer;