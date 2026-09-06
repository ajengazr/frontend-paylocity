import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronDown } from 'lucide-react';

const PayrollChart = ({ title, subtitle, data = [] }) => {
    const { isDark } = useTheme();
    const [selectedSemester, setSelectedSemester] = useState('all');

    const semesters = useMemo(() => {
        const map = new Map();
        data.forEach(item => {
            const period = item.period || '';
            const [year, month] = period.split('-');
            if (!year || !month) return;
            const sem = parseInt(month) <= 6 ? `${year}-S1` : `${year}-S2`;
            if (!map.has(sem)) map.set(sem, []);
            map.get(sem).push(item);
        });
        return Array.from(map.entries()).sort().reverse();
    }, [data]);

    const filteredData = useMemo(() => {
        if (selectedSemester === 'all') return data;
        const sem = semesters.find(s => s[0] === selectedSemester);
        return sem ? sem[1] : data;
    }, [selectedSemester, semesters, data]);

    const hasData = filteredData.length > 0 && filteredData.some(d => (d.salary || 0) > 0);
    const singleData = filteredData.length === 1 ? filteredData[0] : null;

    const chartPath = useMemo(() => {
        if (!hasData || filteredData.length < 2) return null;

        const width = 500;
        const height = 200;
        const padding = 20;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        const maxSalary = Math.max(...filteredData.map(d => d.salary || 0)) || 1;
        const minSalary = 0;

        const points = filteredData.map((item, index) => {
            const x = padding + (index / (filteredData.length - 1)) * chartWidth;
            const y = padding + chartHeight - ((item.salary - minSalary) / (maxSalary - minSalary)) * chartHeight;
            return { x, y, salary: item.salary, month: item.month };
        });

        let pathD = `M ${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i === 0 ? 0 : i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2] || p2;

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            pathD += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
        }

        const areaD = `${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

        return { points, pathD, areaD };
    }, [filteredData, hasData]);

    const semesterLabel = (sem) => {
        const [year, s] = sem.split('-');
        return `${year} Semester ${s === 'S1' ? '1' : '2'}`;
    };

    return (
        <div className={`card-modern card-accent p-6 rounded-2xl flex flex-col justify-between h-full`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-base font-semibold">{title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
                </div>
                
                <div className="relative">
                    <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className={`appearance-none px-3 py-1.5 pr-8 rounded-full border text-xs font-medium outline-none cursor-pointer ${isDark ? 'bg-[#151c27] border-[#2d3748] text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                    >
                        <option value="all">Semua Periode</option>
                        {semesters.map(([sem]) => (
                            <option key={sem} value={sem}>{semesterLabel(sem)}</option>
                        ))}
                    </select>
                    <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
            </div>

            <div className="relative w-full h-56 mt-4">
                {!hasData ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isDark ? 'bg-[#2a3547]' : 'bg-gray-50'}`}>
                            <svg className={`w-6 h-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 3h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.75m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                            </svg>
                        </div>
                        <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Riwayat Gaji Belum Tersedia
                        </h4>
                        <p className={`text-xs max-w-50 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Data gaji untuk periode ini belum tersedia. Silakan pilih semester lain atau proses payroll terlebih dahulu.
                        </p>
                    </div>
                ) : singleData ? (
                    // TAMPILAN KHUSUS: 1 DATA SAJA
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-[#ff6b00]/10 flex items-center justify-center border-4 border-[#ff6b00]/20">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-[#ff6b00]">{(singleData.salary / 1000000).toFixed(1)}jt</p>
                                </div>
                            </div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#ff6b00] text-white text-[10px] font-bold rounded-full">
                                {singleData.month || '-'}
                            </div>
                        </div>
                        <p className={`text-xs mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Hanya tersedia 1 periode data. Grafik lengkap akan muncul setelah ada 2+ periode.
                        </p>
                    </div>
                ) : (
                    <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ff6b00" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#ff6b00" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <line x1="0" y1="50" x2="500" y2="50" stroke={isDark ? '#2d3748' : '#f3f4f6'} strokeWidth="1" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke={isDark ? '#2d3748' : '#f3f4f6'} strokeWidth="1" />
                        <line x1="0" y1="150" x2="500" y2="150" stroke={isDark ? '#2d3748' : '#f3f4f6'} strokeWidth="1" />

                        <path d={chartPath.areaD} fill="url(#chartGradient)" opacity="0.85" />
                        <motion.path
                            d={chartPath.pathD}
                            fill="none"
                            stroke="#ff6b00"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.4, ease: 'easeInOut' }}
                        />

                        {chartPath.points.map((point, i) => (
                            <motion.g key={i}>
                                <motion.circle
                                    cx={point.x}
                                    cy={point.y}
                                    r="5"
                                    fill="#ff6b00"
                                    stroke={isDark ? '#1e293b' : '#ffffff'}
                                    strokeWidth="2"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.5 + i * 0.12 }}
                                    style={{ transformOrigin: `${point.x}px ${point.y}px` }}
                                />
                                <motion.text
                                    x={point.x}
                                    y={point.y - 10}
                                    textAnchor="middle"
                                    fill={isDark ? '#9ca3af' : '#6b7280'}
                                    fontSize="10"
                                    fontWeight="600"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + i * 0.12 }}
                                >
                                    {(point.salary / 1000000).toFixed(1)}jt
                                </motion.text>
                            </motion.g>
                        ))}
                    </svg>
                )}

                {hasData && filteredData.length >= 2 && (
                    <div className="flex justify-between text-[11px] font-semibold text-gray-400 mt-2 px-1">
                        {filteredData.map((item, i) => (
                            <span key={i}>{item.month || '-'}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayrollChart;