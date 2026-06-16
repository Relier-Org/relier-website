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
  title: "For Business · Relier — Travel Agencies, Corporate & Events",
  description:
    "Partner with Relier for chauffeured ground transportation worldwide — for travel advisors, corporate accounts, and events teams.",
};

// Página nueva (PDF cliente 04-jun-2026 §1, "For Business" estilo Blacklane).
// Apunta a travel agencies / corporativos / eventos. Arranca como contenido
// informativo (ayuda al posicionamiento).
// TODO (copy en HOLD por Tupac/SEO): texto de abajo es DRAFT — revisar con SEO
// antes de publicar. Subsecciones a confirmar con el cliente.
// TODO (imágenes): provisorias reutilizadas de service pages; pendiente shooting.
const BLOCKS: ServiceBlock[] = [
  {
    title: "Travel Advisors & Agencies",
    paragraphs: [
      "As a Virtuoso Preferred Partner, Relier is built to make advisors look good. Book on behalf of your clients with confidence: a single point of contact, consistent service in more than 500 cities, and the discretion your clientele expects — from a private airport transfer to a multi-day itinerary.",
      "We handle the logistics so you can focus on the experience. Real-time trip monitoring, proactive updates, and a 24/7 dispatch team that treats your clients as our own.",
    ],
    image: "/images/services/transfers/hero.webp",
    imageAlt: "Relier chauffeured transfer for travel advisors",
  },
  {
    title: "Corporate Accounts",
    paragraphs: [
      "Give your team and guests a ground transportation program they can rely on. Centralized billing, duty-of-care reporting, and chauffeurs trained for business travel — across roadshows, client visits, conferences and daily executive travel.",
      "One account, one standard, every city you operate in.",
    ],
    image: "/images/services/corporate/arrive-on-time.webp",
    imageAlt: "Relier corporate ground transportation",
  },
  {
    title: "Events & Productions",
    paragraphs: [
      "From galas and conventions to film and music productions, we coordinate fleets at scale without losing the boutique touch. Dedicated on-site leads, sedans through 56-passenger motor coaches, and the planning support to keep complex schedules on time.",
    ],
    image: "/images/services/events/conferences.webp",
    imageAlt: "Relier events and production transportation",
  },
];

export default function ForBusinessPage() {
  return (
    <GsapProvider>
      <Nav />
      <main>
        <ServiceHero
          eyebrow="For Business"
          title="Relier for Business"
          subtitle="Chauffeured ground transportation worldwide — for travel advisors, corporate accounts, and the teams behind every event."
          image="/images/services/corporate/hero.webp"
        />
        <ServiceBody blocks={BLOCKS} />
        <ServiceCloser
          title="Let's build your account."
          body="Tell us how your business moves and we'll tailor a program around it — with one point of contact and the same standard in every city."
          ctaLabel="Talk to our team"
          ctaHref="/contact"
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
