import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleQuestion } from 'lucide-react';
import { faqData } from '../../data/faqData';
import FaqItem from './FaqItem';

const FaqSection = ({ searchQuery }) => {
    const filteredFAQs = useMemo(() => {
        if (!searchQuery.trim()) return faqData;

        const lower = searchQuery.toLowerCase();
        return faqData.filter(item =>
            item.question.toLowerCase().includes(lower) ||
            item.answer.toLowerCase().includes(lower)
        );
    }, [searchQuery]);

    return (
        <section className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
            {searchQuery && (
                <p className="text-sm text-gray-500 mb-6">
                    Menampilkan {filteredFAQs.length} hasil untuk "{searchQuery}"
                </p>
            )}

            <AnimatePresence mode="popLayout">
                {filteredFAQs.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-16"
                    >
                        <MessageCircleQuestion className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-lg font-medium">Tidak ada hasil yang cocok</p>
                        <p className="text-gray-400 text-sm mt-1">Coba kata kunci lain</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        className="space-y-3"
                        layout 
                    >
                        {filteredFAQs.map((faq, index) => (
                            <motion.div
                                key={faq.question}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.03 }}
                                layout
                            >
                                <FaqItem 
                                    question={faq.question} 
                                    answer={faq.answer} 
                                    index={index} 
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default FaqSection;