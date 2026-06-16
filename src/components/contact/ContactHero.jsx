import { motion } from 'framer-motion';

const ContactHero = () => {
    return (
        <div className="relative h-95 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-[#eff6ff] via-[#dbeafe] to-[#bfdbfe]" />

            <div className="relative z-10 text-center px-6">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-bold text-[#1b1c1c] tracking-tight"
                >
                    Hubungi Kami
                </motion.h1>
                <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
                    Kami siap membantu Anda
                </p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-[#fbf9f8] to-transparent" />
        </div>
    );
};

export default ContactHero;