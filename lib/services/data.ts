export interface ServiceItem {
  slug: string;
  href: string;
  title: string;
  tagline: string;
  cover: string;
  coverAlt: string;
}

// Order + imagery match the home `Services` bento for visual consistency.
// Taglines verbatim from relier.com/services/.
export const SERVICES: ServiceItem[] = [
  {
    slug: "corporate",
    href: "/corporate/",
    title: "Corporate Transportation",
    tagline: "Meetings, conventions, business travel.",
    cover: "/images/home/corporate.webp",
    coverAlt: "Corporate transportation",
  },
  {
    slug: "events",
    href: "/events/",
    title: "Events Transportation",
    tagline: "Freedom to go wherever.",
    cover: "/images/home/events.webp",
    coverAlt: "Events transportation",
  },
  {
    slug: "airport",
    href: "/airport/",
    title: "Airport Transfers",
    tagline: "Safe and fast.",
    cover: "/images/home/airport.webp",
    coverAlt: "Airport transfers",
  },
  {
    slug: "transfers",
    href: "/transfers/",
    title: "Luxury Vehicle Transfers",
    tagline: "Travel in style.",
    cover: "/images/home/vehicle.webp",
    coverAlt: "Luxury vehicle transfers",
  },
];

export const WC_FEATURED: ServiceItem = {
  slug: "fifa-world-cup-2026-private-transportation",
  href: "/fifa-world-cup-2026-private-transportation/",
  title: "FIFA World Cup 2026",
  tagline:
    "Private transportation across USA, Mexico and Canada for the most-watched tournament of the decade. Dedicated fleet, bilingual chauffeurs, and round-the-clock concierge across 16 host cities.",
  cover: "/images/services/world-cup/hero.webp",
  coverAlt: "Cadillac Escalade ready for FIFA World Cup 2026 transfers",
};
