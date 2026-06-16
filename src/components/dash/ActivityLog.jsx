import { useTheme } from '../../contexts/ThemeContext';
import { iconMap } from '../../data/IconMap';

const ActivityLog = ({ title, data }) => {
    const { isDark } = useTheme();

    return (
        <div className={`p-6 rounded-xl border shadow-sm transition-all ${isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100'}`}>
            <h3 className="text-base font-semibold mb-6">{title}</h3>
            <div className="space-y-6 relative border-l-2 border-gray-100/20 pl-4 ml-3">
                {data.map((item, i) => {
                    const Icon = iconMap[item.icon];
                    return (
                        <div key={i} className="relative">
                            <span className={`absolute -left-6.75 p-1 text-white rounded-full ${item.color}`}>
                                <Icon className="w-3.5 h-3.5" />
                            </span>
                            <div>
                                <h4 className="text-xs font-bold leading-tight">{item.title}</h4>
                                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                                <span className="text-[10px] text-gray-400 block mt-1">{item.time}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActivityLog;