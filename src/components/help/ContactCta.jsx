import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactCta = () => {
    const navigate = useNavigate();
    return (
        <section className="py-16 md:py-20 bg-[#fbf9f8]">
            <div className="max-w-4xl mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className="bg-linear-to-br from-[#ff6b00] to-[#e55e00] rounded-4xl md:rounded-[2.5rem] p-8 md:p-12 lg:p-16 text-white text-center shadow-[0_20px_60px_rgba(255,107,0,0.25)]"
                >
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                        <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>

                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                        Masih punya pertanyaan?
                    </h3>
                    <p className="text-white/90 text-base md:text-lg max-w-xl mx-auto mb-8 md:mb-10">
                        Tim support kami siap membantu Anda secara langsung melalui chat, email, atau telepon.
                    </p>

                    <a onClick={() => navigate('/contact')}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white text-[#ff6b00] font-semibold px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-3xl inline-flex items-center gap-3 hover:shadow-xl transition-all text-base md:text-lg"
                        >
                            Hubungi Kami
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactCta;