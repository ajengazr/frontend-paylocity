export const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }
    }
};

// ============================================
// src/utils/animations.js
// Kumpulan preset animasi Framer Motion
// ============================================

// ============ PAGE TRANSITION ============
export const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeInOut' }
};

// ============ FADE VARIANTS ============
export const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' }
};

export const fadeDown = {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' }
};

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
};

export const fadeLeft = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: 'easeOut' }
};

export const fadeRight = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: 'easeOut' }
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

// ============ ACCORDION / DROPDOWN ============
// Accordion content — dipanggil sebagai object (bukan fungsi)
// Taruh di dalam AnimatePresence, jadi tidak butuh isOpen
export const accordionContent = {
    initial: { height: 0, opacity: 0 },
    animate: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: {
        height: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 0.25, ease: 'easeInOut' }
    },
    style: { overflow: 'hidden' }
};

// Rotasi icon chevron — dipanggil sebagai fungsi dengan isOpen
export const accordionIcon = (isOpen) => ({
    animate: { rotate: isOpen ? 180 : 0 },
    transition: { duration: 0.3, ease: 'easeInOut' }
});

export const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.85,
        y: 30,
        filter: "blur(4px)"
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            stiffness: 350,
            damping: 13,
            mass: 0.8
        }
    },
    exit: {
        opacity: 0,
        scale: 0.92,
        y: 15,
        filter: "blur(2px)",
        transition: {
            duration: 0.2,
            ease: [0.32, 0.72, 0, 1]
        }
    }
};
