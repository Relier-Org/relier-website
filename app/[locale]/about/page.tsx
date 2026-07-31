import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/sections/AboutHero";
import AboutIntro from "@/components/sections/AboutIntro";
import AboutBento from "@/components/sections/AboutBento";
import Testimonials from "@/components/sections/Testimonials";
import GsapProvider from "@/components/effects/GsapProvider";

export const metadata: Metadata = {
  title: "About · Relier — A Personal Mobility Concierge",
  description:
    "Relier is a leading worldwide transportation company. Comfort, convenience, luxury, and so much more in one place — wherever your journey takes you.",
};

export default function AboutPage() {
  return (
    <GsapProvider>
      <Nav />
      <main>
        <AboutHero />
        <AboutIntro />
        <AboutBento />
        <Testimonials />
      </main>
      <Footer />
    </GsapProvider>
  );
}
