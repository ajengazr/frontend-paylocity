import { motion } from 'framer-motion';

const ContactHeader = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12 md:mb-16"
        >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#1b1c1c] leading-tight">
                Diskusikan kebutuhan perusahaan Anda dengan tim PAYLOCITY
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Punya pertanyaan tentang PAYLOCITY? Dari pertanyaan terkait aplikasi, saran, hingga pelaporan bug, tim kami siap membantu Anda.
            </p>
        </motion.div>
    );
};

export default ContactHeader;