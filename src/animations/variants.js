export const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }
    }
};

// ============================================
// Kumpulan preset animasi Framer Motion — Paylocity
// ============================================

// ============ FADE ============
export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
};

// ============ SCALE ============
export const scaleUp = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: 'easeOut' }
};

// ============ SLIDE (untuk sidebar) ============
export const slideLeft = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
};

// ============ STAGGER (untuk list/tabel) ============
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

export const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
};

// ============ SCROLL REVEAL ============
// Untuk card/section yang muncul saat di-scroll
// delay: detik jeda sebelum animasi (default 0)
// amount: 0-1, seberapa banyak elemen harus terlihat sebelum animasi trigger (default 0.2)
export const scrollReveal = (delay = 0, amount = 0.2) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount },
    transition: { duration: 0.5, delay, ease: 'easeOut' }
});

// ============ ACCORDION ============
// Rotasi icon chevron — dipanggil sebagai fungsi dengan isOpen
export const accordionIcon = (isOpen) => ({
    animate: { rotate: isOpen ? 180 : 0 },
    transition: { duration: 0.3, ease: 'easeInOut' }
});