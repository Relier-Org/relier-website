// Fleet categories (PDF cliente 04-jun-2026 §5): 6 categorías en orden — las 4
// actuales + Mini-Bus + Motor Coach (56 pax). Specs visibles directo (pax +
// valijas), no detrás de hover/click.
//
// pax/valijas = números reales del sitio actual (relier.com /fleet). Los buses
// solo listan capacidad de pasajeros en origen → luggage queda undefined.
// TODO (cliente): fotos finales del ángulo del lado por el que sube el pasajero
// (swap de webp; el layout ya las centra).

export interface Vehicle {
  /** Translation key: `tiers.<id>` in messages/<locale>/fleet.json. */
  id: string;
  name: string;
  image: string;
  width: number;
  height: number;
  passengers: number | string;
  luggage?: number;
  orSimilar?: boolean;
  /** Giant backdrop word behind the car in the showcase stage. */
  word: string;
  /**
   * Car height in the desktop stage, px (×0.52 on mobile, via CSS). Encodes the
   * real-volume hierarchy: sedan < SUV < van < coach. Width derives from the
   * canvas ratio (width/height) since every webp is a normalized canvas.
   */
  stageHeight: number;
}

export const FLEET: Vehicle[] = [
  {
    id: "executive-sedan",
    name: "Cadillac Lyriq",
    image: "/images/fleet/lyriq.webp",
    width: 1740,
    height: 1140,
    passengers: 2,
    luggage: 2,
    orSimilar: true,
    word: "LYRIQ",
    stageHeight: 345,
  },
  {
    id: "flagship-sedan",
    name: "Mercedes-Benz S-Class",
    image: "/images/fleet/s-class.webp",
    width: 1740,
    height: 1140,
    passengers: 2,
    luggage: 2,
    orSimilar: true,
    word: "S-CLASS",
    stageHeight: 330,
  },
  {
    id: "full-size-suv",
    name: "Cadillac Escalade",
    image: "/images/fleet/escalade.webp",
    width: 1740,
    height: 1140,
    passengers: 5,
    luggage: 6,
    orSimilar: true,
    word: "ESCALADE",
    stageHeight: 355,
  },
  {
    id: "executive-van",
    name: "Mercedes-Benz Sprinter",
    image: "/images/fleet/sprinter.webp",
    width: 1740,
    height: 1140,
    passengers: 13,
    luggage: 10,
    orSimilar: true,
    word: "SPRINTER",
    stageHeight: 375,
  },
  {
    id: "mini-coach",
    name: "Executive Mini-Bus",
    image: "/images/fleet/minibus.webp",
    width: 1600,
    height: 1000,
    passengers: "24–40",
    orSimilar: true,
    word: "MINI COACH",
    stageHeight: 390,
  },
  {
    id: "motor-coach",
    name: "56-Passenger Coach",
    image: "/images/fleet/motorcoach.webp",
    width: 1600,
    height: 1000,
    passengers: 56,
    orSimilar: true,
    word: "COACH",
    stageHeight: 400,
  },
];
