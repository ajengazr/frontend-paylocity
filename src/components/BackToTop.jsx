import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
                opacity: showBackToTop ? 1 : 0,
                scale: showBackToTop ? 1 : 0.6,
                y: showBackToTop ? 0 : 20
            }}
            className="fixed bottom-8 right-15 w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-[#ff6b00] border border-gray-100 z-50 hover:bg-[#ff6b00] hover:text-white transition-all active:scale-90"
        >
            <ArrowUp className="w-6 h-6" />
        </motion.button>
    );
};

export default BackToTop;