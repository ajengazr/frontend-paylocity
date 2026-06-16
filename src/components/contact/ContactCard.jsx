import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ContactCard = ({ item, index }) => {
    const getHref = () => {
        if (item.action.includes('@')) return `mailto:${item.action}`;
        if (item.action.includes('150')) return 'tel:150150';
        return '#';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100"
        >
            <div className={`w-12 h-12 md:w-16 md:h-16 ${item.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6 text-white`}>
                <item.icon className="w-7 h-7 md:w-9 md:h-9" />
            </div>

            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-[#1b1c1c]">{item.title}</h3>

            <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                {item.desc}
            </p>

            {item.schedule && (
                <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
                    {item.schedule}
                </p>
            )}

            <motion.a
                href={getHref()}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 text-[#ff6b00] font-semibold text-sm md:text-base "
            >
                {item.action}
                <ArrowRight className="w-4 h-4 transition-transform " />
            </motion.a>
        </motion.div>
    );
};

export default ContactCard;