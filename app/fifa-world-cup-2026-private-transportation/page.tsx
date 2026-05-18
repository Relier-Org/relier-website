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
    "FIFA World Cup 2026 · Relier — Private Transportation across USA, Mexico, Canada",
  description:
    "Seamless travel across USA, Mexico, and Canada. Powered by years of expertise in global events.",
};

const BLOCKS: ServiceBlock[] = [
  {
    title: "Luxury Ground Transportation for FIFA World Cup 2026",
    paragraphs: [
      "Experience world-class travel while attending the FIFA World Cup 2026. Relier offers premium private transportation in the United States, Mexico, and Canada, ensuring you arrive at every stadium, hotel, or event on time, safely, and in total comfort.",
    ],
    image:
      "/images/services/world-cup/ground-transport.webp",
    imageAlt: "Relier executive van at a FIFA World Cup 2026 venue",
  },
  {
    title: "Private Transfers Across Host Cities",
    paragraphs: [
      "From New York to Mexico City, Toronto to Los Angeles, our professional chauffeurs provide door-to-door service tailored to your schedule. Whether you need airport transfers, city-to-stadium rides, or full-day service, Relier guarantees a smooth and stress-free journey.",
      "Our fleet includes luxury sedans, SUVs, and executive vans — perfect for individual travelers, groups, or VIP delegations. Relier has years of experience handling international events, offering reliability and discretion for every passenger.",
    ],
    image: "/images/services/world-cup/host-cities.webp",
    imageAlt: "Relier sedan in front of SoFi Stadium, Los Angeles",
  },
  {
    title: "Why Choose Relier for the FIFA World Cup 2026?",
    paragraphs: [
      "With coverage in all major host cities across USA, Mexico, and Canada, Relier is your trusted partner for ground transportation. We combine punctuality, luxury, and personalized service to make your World Cup experience unforgettable.",
    ],
    image: "/images/services/world-cup/why-choose.webp",
    imageAlt: "Aerial view of MetLife Stadium, New York",
  },
];

export default function WorldCupPage() {
  return (
    <GsapProvider>
      <Nav />
      <main>
        <ServiceHero
          eyebrow="FIFA World Cup 2026"
          title="Private Transportation for FIFA World Cup 2026"
          subtitle="Seamless travel across USA, Mexico, and Canada. Powered by years of expertise in global events."
          image="/images/services/world-cup/hero.webp"
        />
        <ServiceBody blocks={BLOCKS} />
        <ServiceCloser
          title="Reserve your private transportation today."
          body="Guarantee a first-class travel experience during the FIFA World Cup 2026. Book now with Relier and enjoy safe, reliable, and luxury ground transportation across North America."
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
