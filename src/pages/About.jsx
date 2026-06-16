import BackToTop from "../components/BackToTop";
import FiveSection from "../components/home/FiveSection";
import Footer from "../components/Footer";
import HeroAbout from "../components/about/HeroAbout";
import Navbar from "../components/Navbar";
import SecondAbout from "../components/about/SecondAbout";

const About = () => {
    return(
        <div>
            <Navbar/>
            <HeroAbout/>
            <SecondAbout/>
            <FiveSection/>
            <Footer/>
            <BackToTop/>
        </div>
    );
};

export default About;