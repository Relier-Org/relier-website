/**
 * Los cuatro segmentos B2B del hub /for-business/ (roadmap SEO sep-2026, R05).
 *
 * Corporate y Events apuntan a /corporate/ y /events/, que ya rankean, en vez
 * de crear /for-business/corporate-accounts/ o /for-business/events-and-
 * productions/: el criterio T16 del roadmap es no abrir URLs paralelas para un
 * intent que una URL existente ya captura. Travel Advisors y Affiliates sí son
 * intents nuevos, y por eso nacen con URL propia.
 *
 * El copy vive en messages/<locale>/services.json bajo `forBusiness.segments`.
 * Acá sólo routing + imagen.
 */
export type B2BSegmentId = "advisors" | "accounts" | "events" | "affiliates";

export interface B2BSegment {
  id: B2BSegmentId;
  href: string;
  image: string;
}

// TODO (imágenes): provisorias reutilizadas de las service pages; pendiente shooting.
export const B2B_SEGMENTS: B2BSegment[] = [
  {
    id: "advisors",
    href: "/travel-advisors",
    image: "/images/services/transfers/hero.webp",
  },
  {
    id: "accounts",
    href: "/corporate-transportation",
    image: "/images/services/corporate/arrive-on-time.webp",
  },
  {
    id: "events",
    href: "/event-transportation",
    image: "/images/events-nyc/guest-arrival.webp",
  },
  {
    id: "affiliates",
    href: "/affiliate-partners",
    image: "/images/events-nyc/chauffeur-press.webp",
  },
];
