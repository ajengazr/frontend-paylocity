import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const config = {
    success: {
        icon: CheckCircle,
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-800',
        iconColor: 'text-emerald-500',
        progress: 'bg-emerald-500',
    },
    error: {
        icon: XCircle,
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        iconColor: 'text-red-500',
        progress: 'bg-red-500',
    },
    warning: {
        icon: AlertTriangle,
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        iconColor: 'text-amber-500',
        progress: 'bg-amber-500',
    },
    info: {
        icon: Info,
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        iconColor: 'text-blue-500',
        progress: 'bg-blue-500',
    },
};

const Toast = ({ id, message, type, duration, onRemove }) => {
    const style = config[type] || config.success;
    const Icon = style.icon;

    useEffect(() => {
        const timer = setTimeout(() => onRemove(id), duration);
        return () => clearTimeout(timer);
    }, [id, duration, onRemove]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className={`pointer-events-auto w-80 sm:w-96 rounded-xl border shadow-lg shadow-black/5 overflow-hidden ${style.bg} ${style.border}`}
        >
            <div className="flex items-start gap-3 p-4">
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${style.iconColor}`} />
                <div className="flex-1">
                    <p className={`text-sm font-medium leading-relaxed ${style.text}`}>{message}</p>
                </div>
                <button
                    onClick={() => onRemove(id)}
                    className={`shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors ${style.text}`}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full bg-black/5">
                <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: duration / 1000, ease: 'linear' }}
                    className={`h-full ${style.progress}`}
                />
            </div>
        </motion.div>
    );
};

export default Toast;