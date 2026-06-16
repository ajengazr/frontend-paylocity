import { useState } from 'react';
import BackToTop from "../components/BackToTop";
import ContactCta from "../components/help/ContactCta";
import Footer from "../components/Footer";
import FaqSection from "../components/help/FAQSection";
import HelpHero from "../components/help/HelpHero";
import Navbar from "../components/Navbar";

const Help = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div>
            <Navbar />
            <HelpHero onSearch={setSearchQuery} />
            <FaqSection searchQuery={searchQuery} />
            <ContactCta />
            <Footer />
            <BackToTop />
        </div>
    );
};

export default Help;