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
    "Airport Transfers · Relier — JFK, LaGuardia & Newark Private Transportation",
  description:
    "Reliable and comfortable rides to and from JFK, LaGuardia, and Newark.",
};

const BLOCKS: ServiceBlock[] = [
  {
    title: "Prompt And Secure",
    paragraphs: [
      "An airport ground transportation that can deliver a safe and fast service is the solution to the headaches brought about by the waiting time and confusing public transport. Why settle for less when you can get access to a seamless mode of transportation for your NYC travel?",
    ],
    image:
      "/images/services/airport/prompt.webp",
    imageAlt: "Relier airport pickup",
  },
  {
    title: "No Waiting Time",
    paragraphs: [
      "Skip the long lines and get on the road as soon as you step out of the airport. No need to stress about figuring out the public transport or booking a rideshare and even waiting for a cab. With an airport transportation service, no time is wasted and worry lines will fade away.",
    ],
    image: "/images/services/airport/no-waiting.webp",
    imageAlt: "No waiting at the airport",
  },
  {
    title: "Luxury At Its Finest",
    paragraphs: [
      "Aside from the convenience of having a vehicle and driver to drive you to and from the airport, our airport transportation doesn't stop there. Our cars are equipped with state-of-the-art interiors and amenities to ensure a comfortable time on the road. Enjoy a temperature-controlled environment where you can sit back and relax.",
    ],
    image:
      "/images/services/airport/luxury.webp",
    imageAlt: "Luxury vehicle interior",
  },
];

export default function AirportPage() {
  return (
    <GsapProvider>
      <Nav />
      <main>
        <ServiceHero
          eyebrow="Airport Transfers"
          title="Airport Transfers NYC — Luxury Private Transportation"
          subtitle="Reliable and comfortable rides to and from JFK, LaGuardia, and Newark."
          image="/images/services/airport/hero.webp"
        />
        <ServiceBody blocks={BLOCKS} />
        <ServiceCloser
          title="Reserve your airport transfer today."
          body="JFK, LaGuardia, Newark — no waiting, no stress. Book online and we'll be there ten minutes before pickup."
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
