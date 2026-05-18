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
    "Events Transportation · Relier — Private Chauffeur Service for Events NYC",
  description:
    "Reliable and comfortable transportation for sports events, entertainment, and conferences.",
};

const BLOCKS: ServiceBlock[] = [
  {
    title: "Entertainment Events",
    paragraphs: [
      "Whatever the event you want to attend, Relier offers affordable prices on all NYC luxury car service for events. We have packages for all special occasions including anniversary, bachelor/bachelorette parties, birthdays, concerts, prom night, sightseeing, sports event, shopping, or any family event — Relier has the perfect transport solution for all your needs. Charter our services for your night out, or take a class on an educational field trip. We make sure to give you service that leaves you feeling safe and comfortable — and stylish at the same time.",
    ],
    image: "/images/services/events/entertainment.webp",
    imageAlt: "Relier entertainment events",
  },
  {
    title: "Corporate Events",
    paragraphs: [
      "Ensure seamless transportation for your corporate events with our private chauffeured service. Whether it's executive meetings, conferences, or corporate retreats, we provide punctual, professional, and luxurious transfers tailored to your needs. With a diverse fleet and 24/7 dispatch support, we guarantee a smooth and stress-free experience for you and your team. Arrive in style, ready for success.",
    ],
    image:
      "/images/services/events/corporate.webp",
    imageAlt: "Relier corporate events",
  },
  {
    title: "Sports Events",
    paragraphs: [
      "Whether it's transporting a visiting team before the big game or a top prospect to meet with a franchise executive, we've got your transportation needs covered. As the go-to charter service for major sporting events, we're trusted by athletes, agents, production crews, and professional sports franchises. Plus, we secure VIP packages for exclusive events and handle group transportation for large-scale gatherings, like the Copa América.",
    ],
    image:
      "/images/services/events/sports.webp",
    imageAlt: "Relier sports events",
  },
  {
    title: "Conferences",
    paragraphs: [
      "Transport all your attendees in style or make a grand entry with our specialized logistics for organizational events and conferences. Whether you want an entire sales team transported to a location or you have to arrive with a limo, we have got you covered.",
    ],
    image:
      "/images/services/events/conferences.webp",
    imageAlt: "Relier conferences",
  },
];

export default function EventsPage() {
  return (
    <GsapProvider>
      <Nav />
      <main>
        <ServiceHero
          eyebrow="Events Transportation"
          title="Private Luxury Events Transportation NYC"
          subtitle="Reliable and comfortable transportation for sports events, entertainment, and conferences."
          image="/images/services/events/hero.webp"
        />
        <ServiceBody blocks={BLOCKS} />
        <ServiceCloser
          title="Book your event transportation today."
          body="Seamless, reliable, and luxurious transportation for any event. From VIP arrivals to large group transfers, our team ensures a flawless experience. Secure your ride online now and let us handle the rest."
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
