import { motion } from 'framer-motion';
import AuthLeftPanel from './AuthLeftPanel';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[#f5f3ef] text-[#1b1c1a] font-sans overflow-x-hidden">

            <main className="grow flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden">

                {/* Left Panel — Shared */}
                <AuthLeftPanel />

                {/* Right Panel — Scrollable, children = form apa pun */}
                <section className="relative w-full lg:w-1/2 bg-white flex flex-col items-center px-3 py-6 sm:px-6 sm:py-8 lg:h-full lg:overflow-y-auto bg-aurora">
                    {/* Blob dekoratif animasi */}
                    <motion.div
                        aria-hidden="true"
                        animate={{
                            x: [0, 30, 0],
                            y: [0, -24, 0],
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                        className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#ff6b00]/10 blur-3xl"
                    />
                    <motion.div
                        aria-hidden="true"
                        animate={{
                            x: [0, -26, 0],
                            y: [0, 22, 0],
                        }}
                        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                        className="pointer-events-none absolute -bottom-20 -left-16 w-72 h-72 rounded-full bg-blue-400/10 blur-3xl"
                    />
                    <motion.div
                        aria-hidden="true"
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.5, 0.9, 0.5],
                        }}
                        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                        className="pointer-events-none absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-purple-400/10 blur-2xl"
                    />

                    <div className="relative z-10 m-auto w-full flex justify-center py-2 lg:py-0">
                        {children}
                    </div>
                </section>
            </main>

            {/* Footer — Shared */}
            <footer className="shrink-0 bg-[#F6F4F0] py-2 px-3 sm:px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs text-[#54606b] border-t border-[#e4e2de] gap-1">
                <p>© 2024 Paylocity</p>
                <div className="flex gap-3 sm:gap-6">
                    <a href="#privacy" className="hover:text-[#ED5807] transition-colors">Provasi</a>
                    <a href="#terms" className="hover:text-[#ED5807] transition-colors">Syarat</a>
                    <a href="#support" className="hover:text-[#ED5807] transition-colors">Bantuan</a>
                </div>
            </footer>
        </div>
    );
};

export default AuthLayout;