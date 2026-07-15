import CTA from "../components/CTA";
import FAQ from "../components/FAQ";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Listings from "../components/Listings";
import Navbar from "../components/Navbar";
import PartnerTools from "../components/PartnerTools";
import Pricing from "../components/Pricing";
import Stats from "../components/Stats";
import Templates from "../components/Templates";
import Testimonials from "../components/Testimonials";
import WhyChoose from "../components/WhyChoose";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <PartnerTools />
      <Listings />
      <WhyChoose />
      <Templates />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
