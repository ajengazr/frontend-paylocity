import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ProcessPayrollModal = ({ isOpen, onClose, onConfirm, title, desc, btnConfirm, btnCancel, requirePeriod = false }) => {
    const { isDark } = useTheme();
    const [period, setPeriod] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(requirePeriod ? period : undefined);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md p-6 rounded-xl border shadow-xl transition-all ${isDark ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-white border-gray-100 text-[#151c27]'}`}>
                <div className="flex items-center gap-3 text-emerald-500 mb-4">
                    <AlertCircle className="w-6 h-6" />
                    <h3 className="text-lg font-bold">{title}</h3>
                </div>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>

                {requirePeriod && (
                    <div className="mb-6">
                        <label htmlFor="payroll-period" className="block text-xs font-semibold mb-1">Periode (YYYY-MM)</label>
                        <input
                            id="payroll-period"
                            type="text"
                            placeholder="Contoh: 2026-06"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            required
                            pattern="\d{4}-\d{2}"
                            className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 ${isDark ? 'bg-[#151c27] border-[#334155] text-white' : 'bg-[#f9fafb] border-gray-200 text-[#111827]'}`}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Format: Tahun-Bulan (misal 2026-06)</p>
                    </div>
                )}

                <div className="flex justify-end gap-3 text-sm">
                    <button onClick={onClose} className={`px-4 py-2 border rounded-md font-semibold transition-all ${isDark ? 'border-[#334155] text-gray-300 hover:bg-[#2a3547]' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                        {btnCancel}
                    </button>
                    <button onClick={handleConfirm} disabled={requirePeriod && !period} className="px-4 py-2 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-semibold rounded-md shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                        {btnConfirm}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProcessPayrollModal;