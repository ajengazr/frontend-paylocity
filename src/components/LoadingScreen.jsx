import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

// Definisikan steps di luar komponen agar tidak dibuat ulang setiap render
const LOADING_STEPS = [
    { progress: 15, text: 'Memulai sistem inti...' }, 
    { progress: 89, text: 'Mengoptimalkan tampilan...' },
    { progress: 98, text: 'Menyelesaikan...' },
];

export default function LoadingScreen({ onCancel }) {
    const [progress, setProgress] = useState(LOADING_STEPS[0].progress);
    const [statusText, setStatusText] = useState(LOADING_STEPS[0].text);

    // Memoize steps agar stabil sebagai dependency
    const steps = useMemo(() => LOADING_STEPS, []);

    useEffect(() => {
        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep < steps.length) {
                setProgress(steps[currentStep].progress);
                setStatusText(steps[currentStep].text);
                currentStep++;
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [steps]);

    const handleCancel = useCallback(() => {
        onCancel?.();
    }, [onCancel]);

    return (
        <div className="min-h-screen w-screen relative overflow-hidden bg-[#fcf8f5] text-[#191c1e] flex items-center justify-center p-6 antialiased">
            {/* Aurora background blobs */}
            <div aria-hidden="true" className="absolute -top-24 -left-24 w-96 h-96 bg-[#ff6b00]/15 rounded-full blur-3xl animate-pulse" />
            <div aria-hidden="true" className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] bg-blue-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.4s' }} />
            <div aria-hidden="true" className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />

            {/* Partikel halus */}
            <div aria-hidden="true" className="absolute top-[20%] left-[16%] w-2.5 h-2.5 rounded-full bg-[#ea580c]/40 animate-bounce-soft" />
            <div aria-hidden="true" className="absolute top-[30%] right-[18%] w-2 h-2 rounded-full bg-blue-400/50 animate-bounce-soft" style={{ animationDelay: '0.5s' }} />
            <div aria-hidden="true" className="absolute bottom-[26%] right-[28%] w-3 h-3 rounded-full bg-[#ea580c]/30 animate-bounce-soft" style={{ animationDelay: '1s' }} />

            <div className="relative flex flex-col items-center gap-y-12 max-w-sm">

                {/* Logo & Spinner */}
                <div className="relative flex items-center justify-center h-48 w-48">
                    <div className="absolute inset-0 glass rounded-full shadow-md" />

                    {/* Ring gradien berputar */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full animate-spin-slow"
                        style={{
                            background: 'conic-gradient(from 0deg, transparent 0%, rgba(234,88,12,0.15) 30%, #ea580c 55%, rgba(234,88,12,0.15) 80%, transparent 100%)',
                            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))',
                            mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))',
                        }}
                    />
                    {/* Progress arc sesuai state */}
                    <svg
                        className="absolute inset-0 w-full h-full -rotate-90"
                        viewBox="0 0 100 100"
                    >
                        <circle cx="50" cy="50" fill="none" r="46" stroke="#f1f5f9" strokeWidth="2" />
                        <circle
                            cx="50"
                            cy="50"
                            fill="none"
                            r="46"
                            stroke="#ea580c"
                            strokeDasharray={`${progress / 100 * 283} 283`}
                            strokeLinecap="round"
                            strokeWidth="2"
                            style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(0.25,0.1,0.25,1)' }}
                        />
                    </svg>

                    {/* Brand Mark */}
                    <motion.div
                        animate={{ scale: [1, 1.04, 1] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative z-10 w-27 h-27 flex items-center justify-center"
                    >
                        <img
                            src="/logo.png"
                            alt="Paylocity Logo"
                            className="w-full h-full object-contain drop-shadow-[0_6px_16px_rgba(234,88,12,0.25)]"
                        />
                    </motion.div>
                </div>

                {/* Status */}
                <div className="flex flex-col items-center text-center">
                    <div className="px-4 py-1.5 bg-[#ffedd5] rounded-full glow-orange">
                        <span className="text-[10px] font-bold tracking-widest text-[#ea580c]">
                            MENYIAPKAN SISTEM
                        </span>
                    </div>

                    <div className="mt-4">
                        <h1 className="text-xl font-medium tracking-tight shimmer">PAYLOCITY</h1>
                        <p className="text-sm text-[#45464d] mt-1">
                            Keunggulan & Keamanan Teknis
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-48 mt-8 flex flex-col gap-2">
                        <div className="h-1.5 w-full bg-[#eceef0] rounded-full overflow-hidden relative">
                            <div
                                className="absolute h-full rounded-full bg-gradient-to-r from-[#ea580c] via-[#ff9a5c] to-[#ea580c] transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                            <div
                                className="absolute h-full w-12 bg-white/50 blur-md rounded-full transition-all duration-700 ease-out"
                                style={{ left: `calc(${progress}% - 3rem)` }}
                            />
                        </div>
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] text-gray-500 uppercase">
                                {statusText}
                            </span>
                            <span className="text-[10px] text-[#ea580c] font-bold">
                                {progress}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cancel Button */}
                {onCancel && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-[#ea580c] transition-colors"
                    >
                        Batalkan Permintaan
                    </button>
                )}
            </div>
        </div>
    );
}