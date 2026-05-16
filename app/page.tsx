import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import BookingWidget from "@/components/sections/BookingWidget";
import TrustBar from "@/components/sections/TrustBar";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Pillars from "@/components/sections/Pillars";
import Fleet from "@/components/sections/Fleet";
import WorldCup from "@/components/sections/WorldCup";
import Testimonials from "@/components/sections/Testimonials";
import CitiesMarquee from "@/components/sections/CitiesMarquee";
import GsapProvider from "@/components/effects/GsapProvider";

export default function HomePage() {
  return (
    <GsapProvider>
      <Nav />
      <main>
        <section className="firstScreen">
          <Hero />
          <BookingWidget />
        </section>
        <TrustBar />
        <About />
        <Services />
        <Pillars />
        <Fleet />
        <WorldCup />
        <Testimonials />
        <CitiesMarquee />
      </main>
      <Footer />
    </GsapProvider>
  );
}
