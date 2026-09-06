import { motion } from 'framer-motion';
import { fadeInUp } from '../../animations/variants';

const HeroAbout = () => {
    return (
        <section className="pt-24 pb-20 bg-linear-to-br from-[#addcff] via-white to-[#d6e5f0] min-h-screen flex items-center">
            <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="space-y-8"
                >
                    <p className="text-xl font-bold text-gray-600 max-w-lg">
                        Paylocity adalah ...
                    </p>
                    <h1 className="text-xl md:text-5xl font-bold leading-tight tracking-tighter bg-linear-to-r from-[#ff6b00] via-[#ec4899] to-[#3b82f6] bg-clip-text text-transparent">

                        <span>
                            Platform Penggajian Digital Indonesia
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 max-w-lg">
                        yang menawarkan solusi sistem penggajian terautomasi untuk meningkatkan efisiensi bisnis perusahaan Anda.
                    </p>

                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="relative flex justify-center"
                >
                    <div className="relative w-full max-w-105">
                        <div className="bg-white rounded-3xl overflow-hidden aspect-auto flex items-center justify-center ">
                            <img
                                src="https://media.istockphoto.com/id/1347949900/id/vektor/gaji-gaji-dan-konsep-penggajian-bos-membayar-gaji-kepada-karyawan-payday-kalender-hadiah.jpg?s=612x612&w=0&k=20&c=VfILWWA2MT5C9I5Ebxos4zXtC0KJZOc2UrcOJuK8QJ0="
                                alt="Paylocity Logo"
                                className="w-full h-full object-cover rounded-3xl"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroAbout;