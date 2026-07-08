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
  title: "As directed/Hourly · Relier — Hourly Chauffeur Service",
  description:
    "Hourly, as-directed chauffeur service — your car and driver on hold for as long as you need, wherever the day takes you.",
};

// Página nueva para la categoría "By the Hour" (PDF cliente 04-jun §3). El
// booking widget ya ofrece el modo Hourly; esto le da destino propio a la card
// de servicios (antes compartía /corporate).
// TODO (copy en HOLD por Tupac/SEO): draft — revisar antes de publicar.
// TODO (imágenes): provisorias reutilizadas; pendiente shooting.
const BLOCKS: ServiceBlock[] = [
  {
    title: "Your Car, On Your Schedule",
    paragraphs: [
      "Book a chauffeur by the hour and keep the car with you for the whole day. No re-booking between stops, no waiting for the next pickup — your driver stays on hold, ready when you are, for as long as you need.",
    ],
    image: "/images/services/transfers/maximize.webp",
    imageAlt: "Hourly chauffeur on hold with Relier",
  },
  {
    title: "Freedom To Go Wherever",
    paragraphs: [
      "Meetings across town, a day of shopping, a tour of the city, or a packed itinerary that keeps changing — with as-directed service you set the route as the day unfolds. One booking covers it all.",
    ],
    image: "/images/services/corporate/work-relax.webp",
    imageAlt: "As-directed travel with Relier",
  },
];

export default function HourlyPage() {
  return (
    <GsapProvider>
      <Nav />
      <main>
        <ServiceHero
          eyebrow="As directed/Hourly"
          title="Hourly Chauffeur Service"
          subtitle="Enjoy total flexibility with a dedicated premium vehicle and professional chauffeur at your disposal for as long as you need. Ideal for dynamic schedules and multi-stop itineraries."
          image="/images/services/corporate/hero.webp"
        />
        <ServiceBody blocks={BLOCKS} />
        <ServiceCloser
          title="Book your day, by the hour."
          body="Tell us when to start and we'll keep the car with you — billed by the hour, with the same chauffeured standard across every stop."
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
