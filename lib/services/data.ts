export interface ServiceItem {
  slug: string;
  href: string;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  coverAlt: string;
}

// Canonical 4-service set (cliente 08-jul-2026): Transfers, As directed/Hourly,
// Corporate, Events. Order + imagery match the home `Services` bento.
export const SERVICES: ServiceItem[] = [
  {
    slug: "transfers",
    href: "/transfers/",
    title: "Transfers",
    tagline: "Airport transfers & point to point service.",
    description:
      "From seamless airport arrivals to efficient city transit, experience a flawless journey from A to B with the ultimate standard of comfort, punctuality, and style.",
    cover: "/images/home/vehicle.webp",
    coverAlt: "Airport and point to point transfers",
  },
  {
    slug: "hourly",
    href: "/hourly/",
    title: "As directed/Hourly",
    tagline: "Freedom to go wherever.",
    description:
      "Enjoy total flexibility with a dedicated premium vehicle and professional chauffeur at your disposal for as long as you need. Ideal for dynamic schedules and multi-stop itineraries.",
    cover: "/images/home/airport.webp",
    coverAlt: "As directed and hourly chauffeur service",
  },
  {
    slug: "corporate",
    href: "/corporate/",
    title: "Corporate",
    tagline: "Meetings, conventions, and business travel.",
    description:
      "Tailored logistics for professionals and executive teams. We guarantee absolute reliability, privacy, and impeccable execution to keep your business moving smoothly.",
    cover: "/images/home/corporate.webp",
    coverAlt: "Corporate transportation",
  },
  {
    slug: "events",
    href: "/events/",
    title: "Events",
    tagline: "Galas, VIP groups, and large-scale event logistics.",
    description:
      "From major sports fixtures to grand celebrations, we manage high-profile group transport and complex event logistics with flawless precision. No matter the scale, we ensure your guests and VIPs arrive in absolute comfort and distinction.",
    cover: "/images/home/events.webp",
    coverAlt: "Events transportation",
  },
];

export const WC_FEATURED: ServiceItem = {
  slug: "fifa-world-cup-2026-private-transportation",
  href: "/fifa-world-cup-2026-private-transportation/",
  title: "FIFA World Cup 2026",
  tagline:
    "Private transportation across USA, Mexico and Canada for the most-watched tournament of the decade. Dedicated fleet, bilingual chauffeurs, and round-the-clock concierge across 16 host cities.",
  description:
    "Private transportation across USA, Mexico and Canada for the most-watched tournament of the decade. Dedicated fleet, bilingual chauffeurs, and round-the-clock concierge across 16 host cities.",
  cover: "/images/services/world-cup/hero.webp",
  coverAlt: "Cadillac Escalade ready for FIFA World Cup 2026 transfers",
};
