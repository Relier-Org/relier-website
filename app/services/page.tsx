import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/sections/ServiceHero";
import ServicesIntro from "@/components/sections/ServicesIntro";
import ServicesFeatured from "@/components/sections/ServicesFeatured";
import ServicesGrid from "@/components/sections/ServicesGrid";
import GsapProvider from "@/components/effects/GsapProvider";

export const metadata: Metadata = {
  title: "Our Services · Relier — Worldwide Chauffeured Transportation",
  description:
    "Concierge-grade ground transportation tailored to every journey: luxury transfers, events, airport, corporate travel, and dedicated FIFA World Cup 2026 service across the Americas, Europe, and the Middle East.",
  alternates: { canonical: "https://relier.com/services/" },
};

export default function ServicesPage() {
  return (
    <GsapProvider>
      <Nav />
      <main>
        <ServiceHero
          eyebrow="Services"
          title="Our Services"
          subtitle="Tailored, concierge-grade transportation — adapted to each traveler, each occasion, each city."
          image="/images/services-listing/hero.webp"
          imageAlt="Relier chauffeur opening the door of a luxury vehicle"
        />
        <ServicesIntro />
        <ServicesFeatured />
        <ServicesGrid />
      </main>
      <Footer />
    </GsapProvider>
  );
}
