import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/sections/ServiceHero";
import ServiceBody, {
  type ServiceBlock,
} from "@/components/sections/ServiceBody";
import ServiceCloser from "@/components/sections/ServiceCloser";
import GsapProvider from "@/components/effects/GsapProvider";

export const metadata: Metadata = {
  title:
    "Corporate Transportation · Relier — Business Chauffeur Service NYC",
  description:
    "Luxury and professional chauffeur service for business travel and corporate events.",
};

const BLOCKS: ServiceBlock[] = [
  {
    title: "Arrive On Time Every Time",
    paragraphs: [
      "Time is a crucial factor in all corporate schedules. Arriving late to a business event is a big no-no — not only does it leave a poor impression, but it can also mean missing key moments of the occasion. Avoid these setbacks with our corporate transportation services, backed by our dedicated 24/7 Dispatch Team, ensuring seamless coordination and real-time trip monitoring for a stress-free experience.",
    ],
    image:
      "/images/services/corporate/arrive-on-time.webp",
    imageAlt: "Relier on-time corporate transport",
  },
  {
    title: "Make A Lasting Impression",
    paragraphs: [
      "A corporate chauffeur service isn't just about punctuality — it's about making a statement. It reflects professionalism, importance, and the high standards of your business, leaving a lasting impression on clients and partners.",
    ],
    image:
      "/images/services/corporate/lasting-impression.webp",
    imageAlt: "Relier executive transport",
  },
  {
    title: "Work or Relax On The Road",
    paragraphs: [
      "Let the chauffeur handle the driving while you sit back and focus on what matters — whether it's catching up on work, reviewing important documents, or simply unwinding. With onboard WiFi in all our vehicles, you stay connected and productive while enjoying a smooth, stress-free ride.",
    ],
    image:
      "/images/services/corporate/work-relax.webp",
    imageAlt: "Relax during your ride with Relier",
  },
];

export default function CorporatePage() {
  return (
    <GsapProvider>
      <Nav />
      <main>
        <ServiceHero
          eyebrow="Corporate"
          title="Corporate Limo Transportation NYC"
          subtitle="Tailored logistics for professionals and executive teams. We guarantee absolute reliability, privacy, and impeccable execution to keep your business moving smoothly."
          image="/images/services/corporate/hero.webp"
        />
        <ServiceBody blocks={BLOCKS} />
        <ServiceCloser
          title="Reserve your corporate ride today."
          body="24/7 dispatch, onboard WiFi, and chauffeurs trained for business travel — book in minutes and arrive ready."
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
