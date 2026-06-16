import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { accordionIcon } from '../../animations/variants';

const FaqItem = ({ question, answer, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_24px_rgba(255,107,0,0.08)] transition-shadow duration-300 border border-gray-50"
            layout 
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 md:p-7 text-left group"
                aria-expanded={isOpen}
            >
                <span className="text-base md:text-lg font-semibold text-[#1b1c1c] pr-6 group-hover:text-[#ff6b00] transition-colors duration-300">
                    {question}
                </span>

                <motion.div
                    {...accordionIcon(isOpen)}
                    className="shrink-0 w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#fff0e6] flex items-center justify-center transition-colors duration-300"
                >
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#ff6b00] transition-colors duration-300" />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
                            opacity: { duration: 0.25, ease: 'easeInOut' }
                        }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="px-6 md:px-7 pb-6 md:pb-7 pt-0">
                            <div className="h-px bg-gray-100 mb-4" />
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                {answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FaqItem;