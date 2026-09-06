import { motion } from 'framer-motion';
import { Calculator, Building2, Smartphone } from 'lucide-react';
import { fadeInUp, staggerContainer, scrollReveal } from '../../animations/variants';

const FeaturesSection = () => {
    const features = [
        {
            icon: <Calculator className="w-6 h-6 text-[#ff6b00]" />,
            title: 'Perhitungan Pajak Otomatis',
            desc: 'Sesuai dengan regulasi PPh 21 terbaru (TER) dan aturan BPJS. Akurasi tinggi dengan metode penghitungan pajak yang mudah.'
        },
        {
            icon: <Building2 className="w-6 h-6 text-[#ff6b00]" />,
            title: 'Struktur Organisasi Fleksibel',
            desc: 'Kelola data perusahaan dan karyawan dalam satu aplikasi. Akses berbagai metode pengaturan struktur organisasi terintegrasi.'
        },
        {
            icon: <Smartphone className="w-6 h-6 text-[#ff6b00]" />,
            title: 'Self-Service Karyawan',
            desc: 'Fitur self-service untuk pengelolaan data diri, slip gaji, dan kehadiran lewat smartphone dengan antarmuka user-friendly.'
        }
    ];

    return (
        <section className="py-24 bg-[#E9F5FE]">
            <div className="max-w-6xl mx-auto px-5">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="bg-white rounded-3xl overflow-hidden aspect-auto flex items-center justify-center">
                            <img
                                src="https://plus.unsplash.com/premium_photo-1720503242835-b537741c9736?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dx"
                                alt="Paylocity Logo"
                                className="w-full h-85 object-cover rounded-3xl"
                            />
                        </div>
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-8 py-4 shadow-xl flex items-center gap-4"
                        >
                            <div className="text-emerald-500 text-xl font-bold">Efisiensi Meningkat 15x</div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="space-y-10"
                    >
                        <div>
                            <div className="uppercase text-[#ff6b00] font-semibold tracking-widest mb-2">
                                MANAJEMEN PENGGAJIAN
                            </div>
                            <h2 className="text-4xl font-semibold leading-tight">yang Lebih Pintar</h2>
                        </div>

                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    {...scrollReveal(0.1 * index, 0.3)}
                                    className="flex gap-5 p-4 -m-4 rounded-2xl"
                                >
                                    <motion.div
                                        animate={{ y: [0, -6, 0] }}
                                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
                                        className="relative w-12 h-12 bg-gradient-to-br from-white to-orange-50 rounded-2xl shrink-0 flex items-center justify-center shadow"
                                    >
                                        <motion.span
                                            aria-hidden="true"
                                            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
                                            className="absolute inset-0 rounded-2xl bg-[#ff6b00]/20 -z-10"
                                        />
                                        {feature.icon}
                                    </motion.div>
                                    <div className="pt-1">
                                        <h4 className="font-semibold text-xl mb-2">{feature.title}</h4>
                                        <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;