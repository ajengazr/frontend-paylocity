import { motion } from 'framer-motion';

const AuthFormCard = ({ children, title, subtitle }) => {
  return (
    <div className="relative w-full max-w-75 sm:max-w-85">

      {/* Glow dekoratif di belakang kartu */}
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#ff6b00]/30 via-[#ff9a5c]/20 to-[#60a5fa]/30 blur-xl -z-10"
      />

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="glass-strong p-3 sm:p-5 rounded-2xl border border-[#323E48]/15 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden"
      >
        {/* Pita gradien tipis di atas */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff6b00] via-[#ff9a5c] to-[#60a5fa]" />

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-3 pt-1"
        >
          <img
            src="/logo.png"
            alt="Paylocity Logo"
            className="w-25 h-13 object-contain drop-shadow-sm"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-3"
        >
          <h2 className="text-lg sm:text-xl font-bold text-[#323E48] mb-0.5">{title}</h2>
          <p className="text-xs text-[#54606b]">{subtitle}</p>
        </motion.div>

        {children}
      </motion.div>
    </div>
  );
};

export default AuthFormCard;