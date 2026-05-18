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
    "Luxury Vehicle Transfers · Relier — Private Chauffeur Service NYC",
  description:
    "Premium private transportation with high-end vehicles for any occasion. Bi-lingual chauffeurs, fixed pricing, no hidden costs.",
};

const BLOCKS: ServiceBlock[] = [
  {
    title: "Maximize your time",
    paragraphs: [
      "With Relier's luxury transfers, the ease of travel is more comfortable than ever. You'll save time by skipping the airports and train stations, and can instead use the travel time how you'd like — private phone calls, last-minute presentation prep, or even catching up on sleep. Our bi-lingual chauffeurs are bound by discretion and give you the space and privacy you need to deliver your best.",
    ],
    image: "/images/services/transfers/maximize.webp",
    imageAlt: "Relier chauffeur opening the door for a passenger",
  },
  {
    title: "Stress-free solution",
    paragraphs: [
      "Booking our transfer rides as an alternative to trains, or car rentals means avoiding the crowds and staying safe on your journey. Instead of enduring long lines and multiple interactions before you even hit the road, you just enjoy the comfort of a private transfer in a top-of-the-line vehicle.",
    ],
    image:
      "/images/services/transfers/stress-free.webp",
    imageAlt: "Relier vehicle interior",
  },
  {
    title: "Cost certainty and flexibility",
    paragraphs: [
      "Rates are guaranteed in advance, and our fixed pricing between your pickup and dropoff means no hidden costs. Plans change? Change or cancel your ride for free up until 24 hours before pickup. Anticipate a stop or two along the way? Relier has you covered. For small groups, our Business Van or SUV service class means additional workspace without sacrificing comfort or style.",
    ],
    image: "/images/services/transfers/cost-certainty.webp",
    imageAlt: "Relier executive transfer",
  },
];

export default function TransfersPage() {
  return (
    <GsapProvider>
      <Nav />
      <main>
        <ServiceHero
          eyebrow="Luxury Vehicle Transfers"
          title="Luxury Private Vehicle Transfers and Chauffeur Services in New York City"
          subtitle="Premium private transportation with high-end vehicles for any occasion."
          image="/images/services/transfers/hero.webp"
        />
        <ServiceBody blocks={BLOCKS} />
        <ServiceCloser
          title="Reserve your luxury transfer today."
          body="Premium vehicles, bi-lingual chauffeurs, and fixed pricing — book your ride in minutes."
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
