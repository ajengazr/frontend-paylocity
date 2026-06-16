import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../animations/variants';
import { Calculator } from 'lucide-react';
import { Building2 } from 'lucide-react';
import { Smartphone } from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        {
            icon: <Calculator className="w-7 h-7 text-[#ff6b00]" />,
            title: 'Perhitungan Pajak Otomatis',
            desc: 'Sesuai dengan regulasi PPh 21 terbaru (TER) dan aturan BPJS. Akurasi tinggi dengan metode penghitungan pajak yang mudah.'
        },
        {
            icon: <Building2 className="w-7 h-7 text-[#ff6b00]" />,
            title: 'Struktur Organisasi Fleksibel',
            desc: 'Kelola data perusahaan dan karyawan dalam satu aplikasi. Akses berbagai metode pengaturan struktur organisasi terintegrasi.'
        },
        {
            icon: <Smartphone className="w-7 h-7 text-[#ff6b00]" />,
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
                        <div className="bg-white rounded-3xl overflow-hidden aspect-auto flex items-center justify-center ">
                            
                            <img
                                src="https://plus.unsplash.com/premium_photo-1720503242835-b537741c9736?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dx"
                                alt="Paylocity Logo"
                                className="w-full h-85 object-cover rounded-3xl"
                            />
                        </div>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-8 py-4 shadow-xl flex items-center gap-4">
                            <div className="text-emerald-500 text-xl font-bold">Efisiensi Meningkat 15x</div>
                        </div>
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

                        <div className="space-y-8">
                            {features.map((feature, index) => (
                                <motion.div key={index} variants={fadeInUp} className="flex gap-6">
                                    <div className="w-12 h-12 bg-white rounded-2xl shrink-0 flex items-center justify-center text-3xl shadow">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-xl mb-2">{feature.title}</h4>
                                        <p className="text-gray-600">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <button className="mt-8 flex items-center gap-3 text-[#ff6b00] font-semibold hover:gap-4 transition-all group">
                            Pelajari Fitur Selengkapnya
                            <ArrowRight className="group-hover:translate-x-1 transition" />
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;