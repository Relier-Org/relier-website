// Fleet categories (PDF cliente 04-jun-2026 §5): 6 categorías en orden — las 4
// actuales + Mini-Bus + Motor Coach (56 pax). Specs visibles directo (pax +
// valijas), no detrás de hover/click.
//
// pax/valijas = números reales del sitio actual (relier.com /fleet). Los buses
// solo listan capacidad de pasajeros en origen → luggage queda undefined.
// TODO (cliente): fotos finales del ángulo del lado por el que sube el pasajero
// (swap de webp; el layout ya las centra).

export interface Vehicle {
  id: string;
  tier: string;
  name: string;
  image: string;
  width: number;
  height: number;
  passengers: number | string;
  luggage?: number;
  orSimilar?: boolean;
  /** Width normalization so sedan/SUV/van/coach read balanced in the stage. */
  scale: number;
}

export const FLEET: Vehicle[] = [
  {
    id: "executive-sedan",
    tier: "Executive Sedan",
    name: "Cadillac Lyriq",
    image: "/images/fleet/lyriq.webp",
    width: 1740,
    height: 1140,
    passengers: 2,
    luggage: 2,
    orSimilar: true,
    scale: 0.9,
  },
  {
    id: "flagship-sedan",
    tier: "Flagship Sedan",
    name: "Mercedes-Benz S-Class",
    image: "/images/fleet/s-class.webp",
    width: 1740,
    height: 1140,
    passengers: 2,
    luggage: 2,
    orSimilar: true,
    scale: 0.9,
  },
  {
    id: "full-size-suv",
    tier: "Full-Size SUV",
    name: "Cadillac Escalade",
    image: "/images/fleet/escalade.webp",
    width: 1740,
    height: 1140,
    passengers: 5,
    luggage: 6,
    orSimilar: true,
    scale: 0.97,
  },
  {
    id: "executive-van",
    tier: "Executive Van",
    name: "Mercedes-Benz Sprinter",
    image: "/images/fleet/sprinter.webp",
    width: 1740,
    height: 1140,
    passengers: 13,
    luggage: 10,
    orSimilar: true,
    scale: 1,
  },
  {
    id: "mini-coach",
    tier: "Mini Coach",
    name: "Executive Mini-Bus",
    image: "/images/fleet/minibus.webp",
    width: 1600,
    height: 1000,
    passengers: "24–40",
    orSimilar: true,
    scale: 1.05,
  },
  {
    id: "motor-coach",
    tier: "Motor Coach",
    name: "56-Passenger Coach",
    image: "/images/fleet/motorcoach.webp",
    width: 1600,
    height: 1000,
    passengers: 56,
    orSimilar: true,
    scale: 1.1,
  },
];
