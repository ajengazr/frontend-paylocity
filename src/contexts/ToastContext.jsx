import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} {...toast} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

// ─── Toast Item Component ───
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

const config = {
    success: { icon: CheckCircle, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', iconColor: 'text-emerald-500', progress: 'bg-emerald-500' },
    error: { icon: XCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', iconColor: 'text-red-500', progress: 'bg-red-500' },
};

const ToastItem = ({ id, message, type, duration, onRemove }) => {
    const style = config[type] || config.success;
    const Icon = style.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className={`pointer-events-auto w-80 rounded-xl border shadow-lg overflow-hidden ${style.bg} ${style.border}`}
        >
            <div className="flex items-start gap-3 p-4">
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${style.iconColor}`} />
                <p className={`text-sm font-medium flex-1 ${style.text}`}>{message}</p>
                <button onClick={() => onRemove(id)} className={`p-1 rounded hover:bg-black/5 ${style.text}`}>
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="h-1 w-full bg-black/5">
                <motion.div initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: duration / 1000, ease: 'linear' }} className={`h-full ${style.progress}`} />
            </div>
        </motion.div>
    );
};