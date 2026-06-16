import ContactHero from '../components/contact/ContactHero';
import ContactHeader from '../components/contact/ContactHeader';
import ContactCard from '../components/contact/ContactCard';
import { contactOptions } from '../data/contactOptions';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const ContactPage = () => {
    return (
        <div className="bg-[#fbf9f8] min-h-screen font-nunito overflow-x-hidden">
            <Navbar />
            <ContactHero />

            <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-8 md:-mt-12 relative z-20 pb-16 md:pb-20">
                <ContactHeader />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {contactOptions.map((item, index) => (
                        <ContactCard key={item.title} item={item} index={index} />
                    ))}
                </div>

            </div>
            <Footer />
            <BackToTop/>
        </div>
    );
};

export default ContactPage;