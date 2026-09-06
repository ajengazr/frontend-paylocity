import { useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const formatDate = (val) => {
    if (!val || val === '-') return '-';
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const OvertimeTable = ({ title, columns, data, searchQuery, role, isLoading = false }) => {
    const { isDark } = useTheme();
    const isAdmin = role === 'SUPER_ADMIN' || role === 'HR_ADMIN';
    const isEmployee = role === 'EMPLOYEE';

    const safeQuery = (searchQuery || '').toLowerCase();

    // ========== FILTER ==========
    const filtered = useMemo(() => {
        if (!Array.isArray(data)) return [];
        if (!safeQuery) return data;

        return data.filter((item) => {
            if (!item || typeof item !== 'object') return false;
            const values = Object.values(item).map(v => String(v ?? '').toLowerCase());
            return values.some(v => v.includes(safeQuery));
        });
    }, [data, safeQuery]);

    const getStatusStyle = (status) => {
        const s = String(status || '').toLowerCase();
        if (s === 'pending' || s === 'diajukan' || s === 'menunggu')
            return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
        if (s === 'approved' || s === 'disetujui')
            return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
        if (s === 'rejected' || s === 'ditolak')
            return 'bg-red-500/10 text-red-600 border border-red-500/20';
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    };

    const formatStatusLabel = (status) => {
        const s = String(status || '').toLowerCase();
        if (s === 'pending' || s === 'diajukan') return 'Pending';
        if (s === 'approved' || s === 'disetujui') return 'Disetujui';
        if (s === 'rejected' || s === 'ditolak') return 'Ditolak';
        return status || '-';
    };

    // ========== RENDER CELL ==========
    const renderCell = (col, row) => {
        if (!row || typeof row !== 'object') {
            return <td key={col} className="px-2 sm:px-5 py-2.5 sm:py-3.5 text-xs sm:text-sm">-</td>;
        }

        const colLower = col.toLowerCase();
        const cellBase = 'px-2 sm:px-5 py-2.5 sm:py-3.5';

        // --- Nama / Karyawan ---
        if (colLower.includes('nama') || colLower.includes('karyawan') || colLower.includes('employee')) {
            const name = row.nama || row.employeeName || row.name || row.username || '-';
            const initials = row.initials || (name !== '-' ? String(name)[0].toUpperCase() : '?');
            const color = row.color || (isDark ? 'bg-[#2a3547] text-gray-300' : 'bg-gray-200 text-gray-600');

            return (
                <td key={col} className={cellBase}>
                    <div className="flex items-center gap-2 sm:gap-3">
                        {isAdmin && (
                            <span className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 ${color}`}>
                                {initials}
                            </span>
                        )}
                        <span className="font-semibold text-xs sm:text-sm">{name}</span>
                    </div>
                </td>
            );
        }

        // --- Tanggal ---
        if (colLower.includes('tanggal') || colLower.includes('date')) {
            const val = row.tanggal || row.date || row.tgl || '-';
            return (
                <td key={col} className={`${cellBase} text-xs sm:text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formatDate(val)}
                </td>
            );
        }

        // --- Jam / Durasi ---
        if (colLower.includes('jam') || colLower.includes('lembur') || colLower.includes('durasi') || colLower.includes('hours')) {
            const hours = row.totalHours ?? row.hours ?? row.duration ?? row.jam ?? row.total_hours ?? null;

            if (hours === null || hours === undefined || hours === '-') {
                return <td key={col} className={`${cellBase} text-xs sm:text-sm font-semibold`}>-</td>;
            }

            if (typeof hours === 'string' && hours.toLowerCase().includes('jam')) {
                return <td key={col} className={`${cellBase} text-xs sm:text-sm font-semibold`}>{hours}</td>;
            }

            return <td key={col} className={`${cellBase} text-xs sm:text-sm font-semibold`}>{hours} jam</td>;
        }

        // --- Status ---
        if (colLower.includes('status')) {
            return (
                <td key={col} className={cellBase}>
                    <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold capitalize ${getStatusStyle(row.status)}`}>
                        {formatStatusLabel(row.status)}
                    </span>
                </td>
            );
        }

        // --- Keterangan / Alasan / Tipe ---
        if (colLower.includes('keterangan') || colLower.includes('alasan') || colLower.includes('reason') || colLower.includes('tipe') || colLower.includes('day')) {
            const val = row.keterangan || row.reason || row.dayType || row.type || '-';
            return (
                <td key={col} className={`${cellBase} text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {val === 'WEEKDAY' ? 'Hari Kerja' : val === 'WEEKEND' ? 'Hari Libur' : val}
                </td>
            );
        }

        // --- Honor / Bayaran ---
        if (colLower.includes('honor') || colLower.includes('bayaran') || colLower.includes('biaya') || colLower.includes('pay')) {
            const pay = row.honor || row.overtimePay || row.pay || null;

            if (pay === null || pay === undefined || pay === '-') {
                return <td key={col} className={`${cellBase} text-xs sm:text-sm font-medium text-[#ff6b00]`}>-</td>;
            }

            if (typeof pay === 'string' && pay.toLowerCase().includes('rp')) {
                return <td key={col} className={`${cellBase} text-xs sm:text-sm font-medium text-[#ff6b00]`}>{pay}</td>;
            }

            return <td key={col} className={`${cellBase} text-xs sm:text-sm font-medium text-[#ff6b00]`}>Rp {Number(pay).toLocaleString('id-ID')}</td>;
        }

        // --- Jam Mulai / Selesai ---
        if (colLower.includes('mulai') || colLower.includes('start')) {
            return <td key={col} className={`${cellBase} text-xs sm:text-sm`}>{row.startTime || '-'}</td>;
        }
        if (colLower.includes('selesai') || colLower.includes('end')) {
            return <td key={col} className={`${cellBase} text-xs sm:text-sm`}>{row.endTime || '-'}</td>;
        }

        // --- Fallback ---
        const directVal = row[colLower] ?? row[col] ?? '-';
        return <td key={col} className={`${cellBase} text-xs sm:text-sm`}>{directVal}</td>;
    };

    // ========== EMPTY STATE ==========
    const renderEmptyState = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 text-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-gray-300 border-t-[#ff6b00] rounded-full animate-spin mb-3"></div>
                    <h4 className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Memuat Data...</h4>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 text-center">
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3 ${isDark ? 'bg-[#2a3547]' : 'bg-gray-50'}`}>
                    <svg className={`w-5 h-5 sm:w-7 sm:h-7 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h4 className={`text-xs sm:text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Data Lembur Belum Ada
                </h4>
                <p className={`text-[10px] sm:text-xs max-w-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {isEmployee
                        ? 'Anda belum mengajukan lembur bulan ini. Ajukan lembur untuk melihat riwayatnya di sini.'
                        : 'Belum ada pengajuan lembur dari karyawan untuk periode ini.'}
                </p>
            </div>
        );
    };

    return (
        <div className={`card-modern card-accent rounded-2xl overflow-hidden`}>
            <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100/60 dark:border-gray-700/40 flex justify-between items-center">
                <div>
                    <h3 className="text-sm sm:text-base font-semibold">{title}</h3>
                    <p className={`text-[10px] sm:text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {isEmployee ? 'Riwayat pengajuan lembur Anda' : 'Daftar pengajuan lembur karyawan'}
                    </p>
                </div>
                {safeQuery && (
                    <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full ${isDark ? 'bg-[#2a3547] text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        {filtered.length} hasil
                    </span>
                )}
            </div>

            <div className="overflow-auto overscroll-contain max-h-[340px] sm:max-h-[440px]">
                {filtered.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`sticky top-0 z-10 border-b text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase ${isDark ? 'border-[#2d3748] text-gray-500 bg-[#1a2332]' : 'border-gray-100 text-gray-400 bg-white'}`}>
                                {columns?.map((col) => (
                                    <th key={col} className="px-2 sm:px-5 py-2.5 sm:py-3">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={`text-xs sm:text-sm divide-y ${isDark ? 'divide-[#2d3748]' : 'divide-gray-100'}`}>
                            {filtered.map((row, idx) => (
                                <tr key={String(row?.id ?? idx)} className={`transition-colors ${isDark ? 'hover:bg-[#1e293b]/50' : 'hover:bg-gray-50'}`}>
                                    {columns?.map((col) => renderCell(col, row))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default OvertimeTable;