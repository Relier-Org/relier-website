import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import TestimonialsHero from "@/components/sections/TestimonialsHero";
import TestimonialsIntro from "@/components/sections/TestimonialsIntro";
import Testimonials from "@/components/sections/Testimonials";
import testimonialsStyles from "@/components/sections/Testimonials.module.css";
import GsapProvider from "@/components/effects/GsapProvider";
import { TESTIMONIALS } from "@/lib/testimonials/data";

export const metadata: Metadata = {
  title: "Testimonials · Relier — Verified 5-Star Reviews",
  description:
    "Real travelers, real journeys. Verified 5-star reviews of Relier — chauffeured concierge transport across the Americas, Europe, and the Middle East.",
  alternates: { canonical: "https://relier.com/testimonials/" },
};

export default function TestimonialsPage() {
  return (
    <GsapProvider>
      <Nav />
      <main>
        <TestimonialsHero />
        <TestimonialsIntro />
        <Testimonials
          testimonials={TESTIMONIALS}
          showHeader={false}
          showRatingPill={false}
          reviewPillMode="sticky"
          className={testimonialsStyles.testimonialsFlush}
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
