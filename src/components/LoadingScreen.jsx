import { useState, useEffect, useMemo, useCallback } from 'react';

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
        <div className="min-h-screen w-screen bg-[#fcf8f5] text-[#191c1e] flex items-center justify-center p-6 antialiased">
            <div className="relative flex flex-col items-center gap-y-12 max-w-sm">

                {/* Logo & Spinner */}
                <div className="relative flex items-center justify-center h-48 w-48">
                    <div className="absolute inset-0 bg-white rounded-full shadow-md" />

                    {/* Spinner */}
                    <svg
                        className="absolute inset-0 w-full h-full -rotate-90 animate-spin"
                        style={{ animationDuration: '3s' }}
                        viewBox="0 0 100 100"
                    >
                        <circle cx="50" cy="50" fill="none" r="46" stroke="#f1f5f9" strokeWidth="2" />
                        <circle
                            cx="50"
                            cy="50"
                            fill="none"
                            r="46"
                            stroke="#ea580c"
                            strokeDasharray="100 283"
                            strokeLinecap="round"
                            strokeWidth="2"
                        />
                    </svg>

                    {/* Brand Mark */}
                    <div className="relative z-10 w-27 h-27 flex items-center justify-center">
                        <img
                            src="/logo.png"
                            alt="Paylocity Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="flex flex-col items-center text-center">
                    <div className="px-4 py-1.5 bg-[#ffedd5] rounded-full">
                        <span className="text-[10px] font-bold tracking-widest text-[#ea580c]">
                            MENYIAPKAN SISTEM
                        </span>
                    </div>

                    <div className="mt-4">
                        <h1 className="text-xl font-medium tracking-tight">PAYLOCITY</h1>
                        <p className="text-sm text-[#45464d] mt-1">
                            Keunggulan & Keamanan Teknis
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-48 mt-8 flex flex-col gap-2">
                        <div className="h-1 w-full bg-[#eceef0] rounded-full overflow-hidden relative">
                            <div
                                className="absolute h-full bg-[#ea580c] transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
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