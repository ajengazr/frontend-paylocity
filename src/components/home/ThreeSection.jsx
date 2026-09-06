import { motion } from 'framer-motion';
import { Zap, Link as LinkIcon, ShieldCheck } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../animations/variants';

const ThreeSection = () => {
  const cards = [
    {
      icon: <Zap className="w-9 h-9 text-white" />,
      title: 'Swift',
      desc: 'Bebaskan waktu berharga Anda dengan proses penggajian super cepat, selesai dalam 1 menit*.'
    },
    {
      icon: <LinkIcon className="w-9 h-9 text-white" />,
      title: 'Simple',
      desc: 'Pengalaman langsung repetitif. Kelola data karyawan dan hitung pajak hanya dengan 1 klik.'
    },
    {
      icon: <ShieldCheck className="w-9 h-9 text-white" />,
      title: 'Secure',
      desc: 'Keamanan data selalu menjadi prioritas kami dengan sistem keamanan berstandar militer.'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <div className="inline text-[#ff6b00] font-semibold tracking-widest uppercase">3S Payroll Platform</div>
          <h2 className="text-4xl font-semibold mt-3 leading-tight">
            Hemat waktu dan energi berharga dengan proses penggajian otomatis.
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Hitung gaji, BPJS, dan PPh 21 hanya dalam{' '}
            <span className="font-semibold text-emerald-600">1 menit</span>.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-3"
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="relative bg-[#fdefe6] border border-[#ff6b00]/10 rounded-3xl p-10 overflow-hidden shadow-[0_4px_20px_rgba(255,107,0,0.08)]"
            >
              {/* Aksen sudut halus */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#ff6b00]/5 blur-2xl" />

              {/* Icon */}
              <div className="relative w-16 h-16 bg-[#ff6b00] rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-[#ff6b00]/25">
                {card.icon}
              </div>

              <h3 className="text-2xl font-semibold mb-3">
                {card.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ThreeSection;