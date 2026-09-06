import { motion } from 'framer-motion';
import { Search, HelpCircle, X } from 'lucide-react';
import { useState } from 'react';

const HelpHero = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch?.(value);
    };

    const handleClear = () => {
        setQuery('');
        onSearch?.('');
    };

    return (
        <div className="relative pt-24 pb-16 md:pb-24 bg-linear-to-br from-[#eff6ff] via-[#dbeafe] to-[#bfdbfe] overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                    <HelpCircle className="w-8 h-8 md:w-10 md:h-10 text-[#ff6b00]" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1b1c1c] tracking-tight"
                >
                    Pusat Bantuan
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mt-4 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto"
                >
                    Kami siap membantu Anda memahami setiap fitur Paylocity dengan mudah.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mt-8 md:mt-10 max-w-xl mx-auto relative"
                >
                    <div className="relative">
                        <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari pertanyaan..."
                            value={query}
                            onChange={handleChange}
                            className="w-full pl-12 md:pl-14 pr-12 py-4 md:py-5 rounded-2xl md:rounded-3xl bg-white shadow-lg shadow-black/5 border border-gray-100 focus:border-[#ff6b00] focus:outline-none focus:ring-4 focus:ring-[#ff6b00]/10 transition-all text-sm md:text-base placeholder:text-gray-400"
                        />
                        {query && (
                            <button
                                onClick={handleClear}
                                className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 md:h-24 bg-linear-to-t from-[#fbf9f8] to-transparent" />
        </div>
    );
};

export default HelpHero;