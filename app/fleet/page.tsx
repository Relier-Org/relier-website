import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import FleetHero from "@/components/sections/FleetHero";
import FleetGrid, {
  type FleetVehicle,
} from "@/components/sections/FleetGrid";
import GsapProvider from "@/components/effects/GsapProvider";

export const metadata: Metadata = {
  title: "Fleet · Relier — Our Vehicles",
  description:
    "Smaller and larger vehicles available for personal mobility — sedans, SUVs, S-Class, Sprinter vans, minibus and motorcoach.",
};

const SMALLER: FleetVehicle[] = [
  {
    tier: "Sedan",
    label: "Executive Sedan",
    year: "2024",
    name: "Cadillac Lyriq",
    image: "/images/fleet/lyriq.webp",
    passengers: 2,
    bags: 2,
  },
  {
    tier: "SUV",
    label: "Full-Size SUV",
    year: "2023",
    name: "Cadillac Escalade",
    image: "/images/fleet/escalade.webp",
    passengers: 5,
    bags: 6,
  },
  {
    tier: "S Class",
    label: "Flagship Sedan",
    year: "2024",
    name: "Mercedes-Benz S-Class",
    image: "/images/fleet/s-class.webp",
    passengers: 2,
    bags: 2,
  },
  {
    tier: "Van",
    label: "Executive Van",
    year: "2023",
    name: "Mercedes-Benz Sprinter",
    image: "/images/fleet/sprinter.webp",
    passengers: 13,
    bags: 10,
  },
];

// Larger vehicles: only passenger count is listed on the source site.
// Bags / year / brand are intentionally absent.
const LARGER: FleetVehicle[] = [
  {
    tier: "Minibus",
    name: "Minibus",
    image: "/images/fleet/minibus.webp",
    passengers: "24–40",
  },
  {
    tier: "Motorcoach",
    name: "Motorcoach",
    image: "/images/fleet/motorcoach.webp",
    passengers: 56,
  },
];

export default function FleetPage() {
  return (
    <GsapProvider>
      <Nav />
      <main>
        <FleetHero />
        <FleetGrid
          title="Smaller vehicles"
          lead="Late-model sedans, SUVs and executive vans — each immaculately kept, chauffeur-driven, and ready around the clock. Pick by passengers and luggage; every class is offered as the model shown or a like-for-like equivalent."
          vehicles={SMALLER}
          id="smaller"
        />
        <FleetGrid
          title="Larger vehicles"
          lead="For groups, productions and events — mini-buses and a 56-passenger motor coach, with the same standard of service and coordination as our private cars."
          vehicles={LARGER}
          id="larger"
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
