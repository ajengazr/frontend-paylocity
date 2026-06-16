import { useTheme } from '../../contexts/ThemeContext';
import { iconMap } from '../../data/IconMap';

const colorMap = {
    blue: 'bg-blue-500/10 text-blue-500',
    purple: 'bg-purple-500/10 text-purple-500',
    amber: 'bg-amber-500/10 text-amber-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
};

const StatCard = ({ label, value, suffix, trend, icon, color }) => {
    const { isDark } = useTheme();
    const Icon = iconMap[icon];

    return (
        <div className={`p-4 sm:p-5 lg:p-6 rounded-xl border shadow-sm transition-all overflow-hidden ${isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100'}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className={`text-[10px] sm:text-xs font-semibold tracking-wider uppercase truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {label}
                    </p>
                    <p className="text-lg font-bold mt-1 sm:mt-2 wrap-break-word leading-tight">
                        {value}{suffix}
                    </p>
                    <p className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 font-medium truncate ${color === 'emerald' ? 'text-emerald-500' :
                            color === 'amber' ? 'text-amber-500' :
                                isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        {trend}
                    </p>
                </div>

                <div className={`shrink-0 p-2 sm:p-2.5 lg:p-3 rounded-lg ${colorMap[color] || colorMap.blue}`}>
                    <Icon className="w-5 h-5 sm:w-5 sm:h-5" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;