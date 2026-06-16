import { motion } from 'framer-motion';

const ContactForm = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-16 md:mt-20 bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-16 shadow-sm"
        >
            <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl md:text-3xl font-semibold mb-3 md:mb-4">Kirim Pesan Langsung</h3>
                <p className="text-gray-600 mb-8 md:mb-10 text-sm md:text-base">
                    Isi formulir di bawah ini dan tim kami akan menghubungi Anda dalam waktu 1x24 jam.
                </p>

                <form className="space-y-4 md:space-y-6">
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                        <input
                            type="text"
                            placeholder="Nama Lengkap"
                            className="w-full px-5 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:border-[#ff6b00] focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/10 transition-all text-sm md:text-base"
                        />
                        <input
                            type="email"
                            placeholder="Email Perusahaan"
                            className="w-full px-5 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:border-[#ff6b00] focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/10 transition-all text-sm md:text-base"
                        />
                    </div>

                    <input
                        type="tel"
                        placeholder="Nomor Telepon"
                        className="w-full px-5 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:border-[#ff6b00] focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/10 transition-all text-sm md:text-base"
                    />

                    <textarea
                        rows={5}
                        placeholder="Tulis pesan Anda di sini..."
                        className="w-full px-5 md:px-6 py-3.5 md:py-4 rounded-2xl md:rounded-3xl border border-gray-200 focus:border-[#ff6b00] focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/10 transition-all resize-none text-sm md:text-base"
                    />

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-[#ff6b00] hover:bg-[#e55e00] text-white font-semibold py-4 md:py-5 rounded-xl md:rounded-2xl text-base md:text-lg transition-colors"
                    >
                        Kirim Pesan
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};

export default ContactForm;