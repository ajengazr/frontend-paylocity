import { useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import HeroSection from '../components/home/HeroSection';
import ThreeSSection from '../components/home/ThreeSection';
import FeaturesSection from '../components/home/FeaturesSection';
import CTASection from '../components/home/FiveSection';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import MarqueeBanner from '../components/home/MarqueeBanner';

const PaylocityHomepage = () => {
    const { scrollY } = useScroll();
    const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);

    return (
        <div className="bg-[#fbf9f8] font-poppins overflow-x-hidden">
            <Navbar headerOpacity={headerOpacity} />
            <HeroSection />
            <MarqueeBanner/>
            <ThreeSSection />
            <FeaturesSection />
            <CTASection />
            <Footer />
            <BackToTop />
        </div>
    );
};

export default PaylocityHomepage;