import { setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/i18n/seo";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import BookingWidget from "@/components/sections/BookingWidget";
import Services from "@/components/sections/Services";
import TrustBar from "@/components/sections/TrustBar";
import Fleet from "@/components/sections/Fleet";
import Pillars from "@/components/sections/Pillars";
import WorldCup from "@/components/sections/WorldCup";
import CoverageMap from "@/components/sections/CoverageMap";
import Testimonials from "@/components/sections/Testimonials";
import About from "@/components/sections/About";
import GsapProvider from "@/components/effects/GsapProvider";

// Versión B order (Territory brief, 21-may-2026):
//  1 Hero + booking · 2 Services (Disney+) · 3 Virtuoso/NLE credential band
//  4 Fleet · 5 Reasons / Concierge on the Road · 6 Coverage map
//  7 Testimonials (Google reviews) · 8 About, last of all.
type PageProps = { params: Promise<{ locale: string }> };

// Title/description come from the locale layout; this only adds the
// self-referencing canonical + hreflang set, which needs the locale.
export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return { alternates: localeAlternates("/", locale) };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <GsapProvider>
      <Nav />
      <main>
        <section className="firstScreen">
          <Hero />
          <BookingWidget />
        </section>
        <Services />
        <TrustBar />
        <Fleet />
        <Pillars />
        <WorldCup />
        <CoverageMap />
        <Testimonials />
        <About />
      </main>
      <Footer />
    </GsapProvider>
  );
}
