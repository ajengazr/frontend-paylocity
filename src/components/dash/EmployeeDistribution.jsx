import { useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const formatValue = (val) => {
    if (!val && val !== 0) return '-';
    if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)}M`;
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}jt`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}rb`;
    return String(val);
};

const EmployeeDistribution = ({ title, data, centerLabel }) => {
    const { isDark } = useTheme();
    const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
    const hasData = total > 0;

    const radius = 52;
    const strokeWidth = 14;
    const center = 70;
    const circumference = 2 * Math.PI * radius;

    const segments = useMemo(() => {
        if (!hasData) return [];
        let cumulative = 0;
        return data.map((item) => {
            const value = item.value || 0;
            const segmentLength = (value / total) * circumference;
            const rotation = (cumulative / total) * 360;
            cumulative += value;
            return { ...item, segmentLength, rotation, value };
        });
    }, [data, total, hasData, circumference]);

    return (
        <div className={`p-5 rounded-xl border shadow-sm transition-all flex flex-col ${isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100'}`}>
            <h3 className="text-base font-semibold mb-1">{title}</h3>
            <p className={`text-xs mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Periode aktif</p>

            <div className="relative flex justify-center items-center my-2">
                <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 140 140">
                    <circle
                        cx={center} cy={center} r={radius}
                        fill="transparent"
                        stroke={isDark ? '#1e293b' : '#f3f4f6'}
                        strokeWidth={strokeWidth}
                    />

                    {hasData ? (
                        segments.map((seg, i) => (
                            <circle
                                key={i}
                                cx={center} cy={center} r={radius}
                                fill="transparent"
                                stroke={seg.color || '#ff6b00'}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${seg.segmentLength} ${circumference - seg.segmentLength}`}
                                strokeDashoffset={0}
                                strokeLinecap="round"
                                style={{
                                    transform: `rotate(${seg.rotation}deg)`,
                                    transformOrigin: `${center}px ${center}px`,
                                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                    opacity: seg.value > 0 ? 1 : 0.25,
                                }}
                            />
                        ))
                    ) : (
                        <circle
                            cx={center} cy={center} r={radius}
                            fill="transparent"
                            stroke={isDark ? '#334155' : '#e5e7eb'}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                        />
                    )}

                    <circle
                        cx={center} cy={center}
                        r={radius - strokeWidth - 5}
                        fill={isDark ? '#151c27' : '#ffffff'}
                        stroke={isDark ? '#2d3748' : '#f3f4f6'}
                        strokeWidth="1"
                        className="transition-colors"
                    />
                </svg>

                {/* Center text */}
                <div className="absolute text-center flex flex-col items-center">
                    {centerLabel && (
                        <span className={`text-[9px] uppercase tracking-widest font-bold mb-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {centerLabel}
                        </span>
                    )}
                    <span className={`block text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#151c27]'}`}>
                        {formatValue(total)}
                    </span>
                    <span className={`text-[9px] mt-0.5 font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {hasData 
                            ? `${data.filter(d => d.value > 0).length} ${centerLabel ? 'departemen' : 'komponen'}` 
                            : 'Belum ada data'
                        }
                    </span>
                </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
                {data.map((item, i) => {
                    const percentage = total > 0 ? Math.round(((item.value || 0) / total) * 100) : 0;
                    return (
                        <div 
                            key={i} 
                            className={`flex items-center gap-2 p-2 rounded-lg transition-colors cursor-default ${isDark ? 'hover:bg-[#2a3547]' : 'hover:bg-gray-50'}`}
                        >
                            <span 
                                className="w-3 h-3 rounded-full shrink-0 shadow-sm ring-2 ring-offset-1" 
                                style={{ 
                                    backgroundColor: item.color || '#ff6b00',
                                    '--tw-ring-color': item.color || '#ff6b00'
                                }} 
                            />
                            <div className="flex flex-col min-w-0">
                                <span className={`text-[11px] font-semibold truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {item.label || item.name || '-'}
                                </span>
                                <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {percentage > 0 ? `${percentage}% • ` : ''}{formatValue(item.value || 0)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EmployeeDistribution;