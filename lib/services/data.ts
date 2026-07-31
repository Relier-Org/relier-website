// Display copy (title/tagline/description/coverAlt) lives in
// messages/<locale>/services.json under `items.<slug>` — and in `wc.featured`
// for the World Cup card. Only routing + imagery stay here.
export interface ServiceItem {
  slug: string;
  href: string;
  cover: string;
}

// Canonical 4-service set (cliente 08-jul-2026): Transfers, As directed/Hourly,
// Corporate, Events. Order matches the home `Services` bento; `cover` uses
// dedicated 16:10 crops (/images/services/cards) — the home keeps its own
// vertical /images/home crops.
export const SERVICES: ServiceItem[] = [
  {
    slug: "transfers",
    href: "/transfers/",
    cover: "/images/services/cards/transfers.webp",
  },
  {
    slug: "hourly",
    href: "/hourly/",
    cover: "/images/services/cards/hourly.webp",
  },
  {
    slug: "corporate",
    href: "/corporate/",
    cover: "/images/services/cards/corporate.webp",
  },
  {
    slug: "events",
    href: "/events/",
    cover: "/images/services/cards/events.webp",
  },
];

export const WC_FEATURED: ServiceItem = {
  slug: "fifa-world-cup-2026-private-transportation",
  href: "/fifa-world-cup-2026-private-transportation/",
  cover: "/images/services/world-cup/hero.webp",
};
