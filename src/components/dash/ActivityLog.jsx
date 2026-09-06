import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { iconMap } from '../../data/IconMap';

const ActivityLog = ({ title, data }) => {
    const { isDark } = useTheme();

    return (
        <div className={`card-modern card-accent p-6 rounded-2xl flex flex-col h-full`}>
            <h3 className="text-base font-semibold mb-6">{title}</h3>
            <div className={`relative space-y-6 overflow-y-auto overscroll-contain max-h-[340px] sm:max-h-[440px] pl-8 pr-1`}>
                {/* Rel timeline gradien */}
                <div aria-hidden="true" className={`absolute left-2 top-1 bottom-1 w-0.5 rounded-full bg-gradient-to-b ${isDark ? 'from-[#ff6b00]/60 via-[#ff9a2a]/40 to-transparent' : 'from-[#ff6b00]/50 via-[#ff9a2a]/30 to-transparent'}`} />
                {data.map((item, i) => {
                    const Icon = iconMap[item.icon];
                    return (
                        <motion.div
                            key={i}
                            className="relative"
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                        >
                            <motion.span
                                animate={{ scale: [1, 1.18, 1] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
                                className={`absolute -left-8 p-1.5 rounded-full text-white shadow-lg ${item.color}`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                            </motion.span>
                            <div className="pt-0.5">
                                <h4 className="text-xs font-bold leading-tight">{item.title}</h4>
                                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                                <span className="text-[10px] text-gray-400 block mt-1">{item.time}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActivityLog;