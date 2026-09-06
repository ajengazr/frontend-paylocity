import { motion } from 'framer-motion';
import { staggerContainer } from '../../animations/variants';

const SecondAbout = () => {
    const row1 = [
        { name: 'SWA', src: "https://cdn.prod.website-files.com/608288e274cb77550e8d4e73/632434eec2620f7d72fd1894_swasembada.webp" },
        { name: 'Bisnis.com', src: "https://cdn.prod.website-files.com/608288e274cb77550e8d4e73/63243518a93f6074057e6454_bisniscom.webp" },
        { name: 'The Jakarta Post', src: "https://cdn.prod.website-files.com/608288e274cb77550e8d4e73/6324352c076c9a2c432749a4_thejakartapost.webp" },
        { name: 'CNN Indonesia', src: "https://cdn.prod.website-files.com/608288e274cb77550e8d4e73/63243541b1f2162ab8f141b1_cnn.webp" },
        { name: 'kumparanTech', src: "https://cdn.prod.website-files.com/608288e274cb77550e8d4e73/632435515346e4f66475c1b7_kumparan.png" },
        { name: 'Hukum Online', src: "https://cdn.prod.website-files.com/608288e274cb77550e8d4e73/63243566dcbfdd56fc6ff782_hukumonline.svg" },
        { name: 'Marketeeers', src: 'https://cdn.prod.website-files.com/608288e274cb77550e8d4e73/6324357788eeaad40ad0d862_marketeers.png' },
        { name: 'INFOKOMPUTER', src: 'https://cdn.prod.website-files.com/608288e274cb77550e8d4e73/63243582faa2fac9957f7b3f_infokomputer.webp' },
        { name: 'indotelko.com', src: 'https://cdn.prod.website-files.com/608288e274cb77550e8d4e73/63243594a18e6b8f1c5c13d3_indotelko.webp' },
        { name: 'nextren', src: 'https://cdn.prod.website-files.com/608288e274cb77550e8d4e73/63243793fee7c353c4f2b47a_nextren.png' },
        { name: 'SINDOnews.com', src: 'https://cdn.prod.website-files.com/608288e274cb77550e8d4e73/632438858fb1dcce4f97f047_sindonews.webp' },
        { name: 'DailySocial', src: 'https://cdn.prod.website-files.com/608288e274cb77550e8d4e73/63243a2a8fb1dc973b97fe42_dailysocial.png' }
    ];

    const containerVariants = staggerContainer || {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] }
        }
    };

    const fadeInLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] }
        }
    };

    const fadeInRight = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] }
        }
    };

    const LogoItem = ({ src, name }) => (
        <motion.div
            variants={itemVariants}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center p-2 sm:p-4 cursor-default"
        >
            <img
                src={src}
                alt={name}
                className="max-h-8 sm:max-h-10 md:max-h-12 w-auto object-contain transition-all duration-500"
                draggable={false}
                loading="lazy"
            />
        </motion.div>
    );

    return (
        <div className="pt-20 sm:pt-24 pb-12 sm:pb-20 bg-linear-to-br from-[#fdefe6] via-white to-[#E9F5FE] min-h-screen overflow-hidden">
            
            {/* Section 1: Logo + Filosofi */}
            <div className="max-w-6xl mx-auto px-4 sm:px-5 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 sm:gap-12 lg:gap-16 items-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInLeft}
                    className="relative flex justify-center lg:justify-start"
                >
                    <motion.img
                        src="/logo.png"
                        alt="Paylocity Logo"
                        className="w-full max-w-48 sm:max-w-56 lg:max-w-[16rem] h-auto rounded-3xl"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        loading="lazy"
                    />
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    className="space-y-4 sm:space-y-5"
                >
                    <motion.p variants={itemVariants} className="text-base sm:text-xl font-bold text-gray-600">
                        Filosopi Nama
                    </motion.p>

                    <motion.h2 variants={itemVariants} className="text-lg sm:text-xl md:text-3xl font-bold leading-tight tracking-tight sm:tracking-tighter bg-linear-to-r from-[#ff6b00] via-[#ec4899] to-[#3b82f6] bg-clip-text text-transparent">
                        PAYLOCITY berasal dari gabungan kata <i>"Pay"</i> dan <i>"Velocity"</i>
                    </motion.h2>

                    <motion.p variants={itemVariants} className="text-sm sm:text-base text-gray-600 text-justify leading-relaxed">
                        <i>Pay</i> melambangkan proses penggajian yang akurat, transparan, dan tepat waktu. Sedangkan <i>Velocity</i> berarti kecepatan dan percepatan.
                        Kombinasi keduanya mencerminkan komitmen Paylocity untuk membantu perusahaan mengelola payroll dan administrasi SDM secara lebih cepat, efisien, dan modern.
                    </motion.p>

                    <motion.h2 variants={itemVariants} className="text-lg sm:text-xl md:text-3xl font-bold leading-tight tracking-tight sm:tracking-tighter bg-linear-to-r from-[#ff6b00] via-[#ec4899] to-[#3b82f6] bg-clip-text text-transparent">
                        PAYLOCITY memiliki filosofi "Payroll with Velocity"
                    </motion.h2>

                    <motion.p variants={itemVariants} className="text-sm sm:text-base text-gray-600 text-justify leading-relaxed">
                        Paylocity percaya bahwa proses penggajian bukan hanya tentang menghitung gaji, tetapi juga tentang memberikan pengalaman kerja yang lebih baik bagi seluruh karyawan.
                        Dengan menggabungkan teknologi dan efisiensi operasional, Paylocity membantu perusahaan mempercepat proses payroll, mengurangi risiko kesalahan, serta meningkatkan produktivitas tim HR.
                    </motion.p>
                </motion.div>
            </div>

            {/* Section 2: Konten + Gambar */}
            <div className="max-w-6xl mx-auto px-4 sm:px-5 mt-16 sm:mt-20 lg:mt-24 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 sm:gap-12 lg:gap-16 items-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    className="space-y-4 sm:space-y-5 order-2 lg:order-1"
                >
                    <motion.p variants={itemVariants} className="text-base sm:text-xl font-bold text-gray-600">
                        Paylocity percaya
                    </motion.p>

                    <motion.h2 variants={itemVariants} className="text-lg sm:text-xl md:text-3xl font-bold leading-tight tracking-tight sm:tracking-tighter bg-linear-to-r from-[#ff6b00] via-[#ec4899] to-[#3b82f6] bg-clip-text text-transparent">
                        Sistem penggajian otomatis adalah kunci menuju proses yang lebih efisien
                    </motion.h2>

                    <motion.p variants={itemVariants} className="text-sm sm:text-base text-gray-600 text-justify leading-relaxed">
                        Karena dengan sistem penggajian yang terautomasi, perusahaan dapat membebaskan waktu dan sumber daya manusia
                        yang terdedikasi dari beban kerja repetitif seperti penggajian, dan fokus kepada hal yang lebih strategis.
                    </motion.p>

                    <motion.h2 variants={itemVariants} className="text-lg sm:text-xl md:text-3xl font-bold leading-tight tracking-tight sm:tracking-tighter bg-linear-to-r from-[#ff6b00] via-[#ec4899] to-[#3b82f6] bg-clip-text text-transparent">
                        Solusi penggajian Swift, Simple, dan Secure
                    </motion.h2>

                    <motion.p variants={itemVariants} className="text-sm sm:text-base text-gray-600 text-justify leading-relaxed">
                        Adalah kunci bagi sebuah platform penggajian terbaik bagi perusahaan Anda. Karena itu,
                        PAYLOCITY selalu berkomitmen untuk memperhatikan keamanan data penggunanya sekaligus memberikan pengalaman proses penggajian yang cepat dan mudah digunakan bagi perusahaan Anda.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInRight}
                    className="relative flex justify-center order-1 lg:order-2"
                >
                    <motion.div
                        className="relative w-full max-w-56 sm:max-w-[16rem] lg:max-w-[18rem]"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="overflow-hidden rounded-3xl shadow-xl shadow-gray-200/50">
                            <img
                                src="/src/assets/about.png"
                                alt="Tentang Paylocity"
                                className="w-full h-full object-cover rounded-3xl"
                                loading="lazy"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Section 3: Media Coverage */}
            <div className="max-w-6xl mx-auto px-4 sm:px-5 mt-16 sm:mt-20 lg:mt-24">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-base sm:text-xl font-bold text-gray-600 text-center"
                >
                    PAYLOCITY telah diliput oleh berbagai media di Indonesia
                </motion.p>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={containerVariants}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-12 lg:mt-16"
                >
                    {row1.map((logo, i) => (
                        <LogoItem key={i} {...logo} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default SecondAbout;