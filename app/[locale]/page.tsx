import { setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/i18n/seo";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import HeroBooking from "@/components/sections/HeroBooking";
import Services from "@/components/sections/Services";
import TrustBar from "@/components/sections/TrustBar";
import WorkWithRelier from "@/components/sections/WorkWithRelier";
import Fleet from "@/components/sections/Fleet";
import Pillars from "@/components/sections/Pillars";
import Events from "@/components/sections/Events";
import CoverageMap from "@/components/sections/CoverageMap";
import Testimonials from "@/components/sections/Testimonials";
import About from "@/components/sections/About";
import GsapProvider from "@/components/effects/GsapProvider";
import Preloader from "@/components/effects/Preloader";
import PageSchema from "@/components/seo/PageSchema";
import { homeNodes } from "@/lib/seo/pages";

// Home order (client, 05-aug-2026 — supersedes the Versión B brief):
//  1 Hero + booking · 2 Services · 3 "In service of" credential band
//  3b Work with Relier (B2B cards, roadmap SEO sep-2026 R08: after Services,
//     before Events) · 4 Events · 5 Fleet · 6 Reasons / Concierge on the Road · 7 Coverage map
//  8 Testimonials · 9 About, last of all.
// Events sits above Fleet deliberately: show the service before the vehicles.
// It also replaces the standalone World Cup section, which is now the first
// entry inside it (the section component is kept, unused, in case it comes back).
type PageProps = { params: Promise<{ locale: string }> };

// Rebuilt once a day so the Events list moves on to the next upcoming events
// as each one ends (`homeEvents` filters by date at render).
export const revalidate = 86400;

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
      <PageSchema nodes={await homeNodes(locale)} />
      <Preloader />
      <Nav />
      <main>
        <section className="firstScreen">
          <Hero />
          <HeroBooking />
        </section>
        <Services />
        <TrustBar />
        <WorkWithRelier />
        <Events />
        <Fleet />
        <Pillars />
        <CoverageMap />
        <Testimonials />
        <About />
      </main>
      <Footer />
    </GsapProvider>
  );
}
