const MarqueeBanner = () => {
    // Daftar logo/perusahaan (ganti dengan gambar asli kamu nanti)
    const logos = [
        { id: 1, name: 'PT Sejahtera', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJrLVOxLilakzdihssivhfHjKWZ-9ipY4a6w&s' },
        { id: 2, name: 'CV Maju Jaya', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyvA3vZ0IfTZxR7YqIMMyBdAzOjz6-GPI8PQ&s' },
        { id: 3, name: 'PT Nusantara', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjWqnVfSuV-Jux_OQuwovsKNoipWpkYoaBcQ&s' },
        { id: 4, name: 'Global Tech', img: 'https://upload.wikimedia.org/wikipedia/id/thumb/f/fa/Bank_Mandiri_logo.svg/1280px-Bank_Mandiri_logo.svg.png' },
        { id: 5, name: 'Startup Indo', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR89eIIwRdfViGJ4n8UiaP_EUBK2X00_KqaEA&s' },
    ];

    const duplicatedLogos = [...logos, ...logos];

    return (
        <>
            {/* CSS Animation inline (tidak perlu ubah index.css) */}
            <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee-scroll 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

            <section className="py-10 bg-[#fdefe6]">
                <div className="max-w-6xl mx-auto px-5">
                    {/* Kotak Oranye dengan sudut tumpul */}
                    <div className="bg-white rounded-4xl p-8 md:p-12">

                        {/* Catatan / Teks Statis */}
                        <div className="text-center mb-8">
                            <h3 className="text-black text-xl md:text-2xl font-bold mb-2">
                                Dipercaya oleh Ratusan Perusahaan di Indonesia
                            </h3>
                            <p className="text-black text-sm md:text-base">
                                Dari startup hingga korporasi, PAYLOCITY menjadi pilihan utama untuk solusi payroll modern.
                            </p>
                        </div>

                        {/* Area Infinite Scroll */}
                        <div className="overflow-hidden relative">
                            {/* Track gambar */}
                            <div className="flex animate-marquee whitespace-nowrap w-max">
                                {duplicatedLogos.map((logo, index) => (
                                    <div
                                        key={`${logo.id}-${index}`}
                                        className="shrink-0 mx-4 md:mx-6"
                                    >
                                        <div className="w-32 h-16 md:w-40 md:h-20 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10 ">
                                            <img
                                                src={logo.img}
                                                alt={logo.name}
                                                className="w-full h-full object-contain p-3 opacity-90 hover:opacity-100 transition-opacity"
                                                draggable={false}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default MarqueeBanner;