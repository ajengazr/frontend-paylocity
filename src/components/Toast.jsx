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
            initial={{ opacity: 0, x: 120, scale: 0.85, filter: 'blur(3px)' }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 100, scale: 0.9, filter: 'blur(2px)' }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className={`pointer-events-auto w-80 sm:w-96 rounded-xl border shadow-lg shadow-black/10 overflow-hidden relative ${style.bg} ${style.border}`}
        >
            {/* Pita akromat atas */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${style.iconColor}`} />
            <div className="flex items-start gap-3 p-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 16, delay: 0.05 }}
                >
                    <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${style.iconColor}`} />
                </motion.div>
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