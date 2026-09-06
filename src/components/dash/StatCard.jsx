import { useTheme } from '../../contexts/ThemeContext';
import { iconMap } from '../../data/IconMap';

const colorMap = {
    blue: {
        chip: 'from-blue-500 to-blue-600 text-white shadow-blue-500/40',
        glow: 'bg-blue-500/20',
        value: 'from-blue-600 to-blue-500',
    },
    purple: {
        chip: 'from-purple-500 to-violet-600 text-white shadow-purple-500/40',
        glow: 'bg-purple-500/20',
        value: 'from-purple-600 to-purple-500',
    },
    amber: {
        chip: 'from-amber-400 to-orange-500 text-white shadow-amber-500/40',
        glow: 'bg-amber-500/20',
        value: 'from-amber-500 to-orange-500',
    },
    emerald: {
        chip: 'from-emerald-400 to-emerald-600 text-white shadow-emerald-500/40',
        glow: 'bg-emerald-500/20',
        value: 'from-emerald-600 to-emerald-500',
    },
};

const StatCard = ({ label, value, suffix, trend, icon, color }) => {
    const { isDark } = useTheme();
    const Icon = iconMap[icon];
    const palette = colorMap[color] || colorMap.blue;

    return (
        <div className={`card-modern card-accent p-4 sm:p-5 lg:p-6`}>
            {/* Glow dekoratif mendekati ikon (selalu menyala, bukan hover) */}
            <div aria-hidden="true" className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-3xl opacity-60 ${palette.glow}`} />

            <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className={`label-overline mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {label}
                    </p>
                    <p className={`text-base sm:text-lg lg:text-xl font-extrabold tracking-tight leading-snug break-words bg-gradient-to-r ${palette.value} bg-clip-text text-transparent`}>
                        {value}{suffix}
                    </p>
                    <p className={`text-[10px] sm:text-xs mt-2 font-medium truncate ${color === 'emerald' ? 'text-emerald-500' :
                            color === 'amber' ? 'text-amber-500' :
                                isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        {trend}
                    </p>
                </div>

                <div className={`icon-chip shrink-0 p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br shadow-lg ${palette.chip}`}>
                    <Icon className="w-5 h-5 sm:w-5 sm:h-5 drop-shadow-sm" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;