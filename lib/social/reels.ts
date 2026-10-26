// Reels de la sección social del home (Nico, 22-oct-2026): los 3 más vistos
// publicados por @relier entre los 12 que Instagram muestra sin sesión. Se
// dejaron afuera las colabs de @paovillalobosoficial (129k y 24k) porque el
// video es de ella. Plays al 22-oct: details 113k, landing 14,6k, new-york 4k.
//
// Clips bajados del reel, sin audio, cortados antes del cierre con el logo y
// re-encodeados a H.264 (receta de Rreal Tacos: -an, maxrate 1100k,
// +faststart). Poster = primer frame. La copy vive en `home.social.reels.<id>`.
//
// Para cambiar un reel: reemplazar `public/videos/socials/<id>.mp4` y su poster
// en `public/images/socials/<id>.webp`, y el `href`.

export interface Reel {
  /** Copy key: `home.social.reels.<id>`. */
  id: string;
  href: string;
  video: string;
  poster: string;
  /** Qué parte del 9:16 se ve en la card (más baja que el reel). `bottom` sube
   *  el texto quemado del reel para que no choque con el pie de perfil. */
  focus?: "center" | "bottom";
}

// Carrusel selector (Nico, 26-oct-2026): cinco reels, el del medio arranca
// activo. Se suman US Open y Fashion Week (reels de Relier en Nueva York),
// recortados antes del logo de cierre.
export const REELS: Reel[] = [
  {
    id: "us-open",
    href: "https://www.instagram.com/reel/DdH8NFdRk8z/",
    video: "/videos/socials/us-open.mp4",
    poster: "/images/socials/us-open.webp",
  },
  {
    id: "landing",
    href: "https://www.instagram.com/reel/DdtryFVxuX1/",
    video: "/videos/socials/landing.mp4",
    poster: "/images/socials/landing.webp",
    focus: "bottom",
  },
  {
    // El más visto va al medio, que es la card grande.
    id: "details",
    href: "https://www.instagram.com/reel/DdFVnM3B1ch/",
    video: "/videos/socials/details.mp4",
    poster: "/images/socials/details.webp",
  },
  {
    id: "new-york",
    href: "https://www.instagram.com/reel/DcMoZoAR9-_/",
    video: "/videos/socials/new-york.mp4",
    poster: "/images/socials/new-york.webp",
  },
  {
    id: "fashion-week",
    href: "https://www.instagram.com/reel/DccVVOBRclE/",
    video: "/videos/socials/fashion-week.mp4",
    poster: "/images/socials/fashion-week.webp",
  },
];

/** Índice del reel que arranca activo (el más visto, al medio). */
export const INITIAL_REEL = 2;
