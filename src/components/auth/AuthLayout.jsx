import AuthLeftPanel from './AuthLeftPanel';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[#f5f3ef] text-[#1b1c1a] font-sans overflow-x-hidden">

            <main className="grow flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden">

                {/* Left Panel — Shared */}
                <AuthLeftPanel />

                {/* Right Panel — Scrollable, children = form apa pun */}
                <section className="w-full lg:w-1/2 bg-white flex flex-col items-center px-3 py-6 sm:px-6 sm:py-8 lg:h-full lg:overflow-y-auto">
                    <div className="m-auto w-full flex justify-center py-2 lg:py-0">
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