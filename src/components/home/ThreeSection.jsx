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
          <div className="inline text-[#ff6b00] font-semibold tracking-widest">3S PAYROLL PLATFORM</div>
          <h2 className="text-4xl font-semibold mt-3">
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
          className="grid md:grid-cols-3 gap-8"
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group bg-[#fdefe6] border border-gray-100 rounded-3xl p-10 shadow-[0_4px_20px_rgba(255,107,0,0.08)] "
            >
              <div className="w-16 h-16 bg-[#ff6b00] rounded-2xl flex items-center justify-center mb-8 group-">
                {card.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{card.title}</h3>
              <p className="text-gray-600">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ThreeSection;