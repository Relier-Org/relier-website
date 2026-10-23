import path from "node:path";
import { fileURLToPath } from "node:url";
import createNextIntlPlugin from "next-intl/plugin";

// Plain JS on purpose, no .ts. `next start` carga este archivo en runtime y un
// next.config.ts necesita el paquete `typescript`, que es devDependency: con un
// `npm ci --omit=dev` en el server (Hostinger) el arranque muere con
// MODULE_NOT_FOUND. En .mjs no hay nada que transpilar.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * URLs que el WordPress tenía indexadas y que este sitio no reproduce.
 * Relevadas contra Wayback (snapshots 2024-2026) el 20-ago-2026, después del
 * corte a Hostinger: de 158 URLs con tráfico, 107 caían a 404 seco.
 *
 * Se dejan morir a propósito: /demo-*, /example-i, /sample-page, /test-addon-2
 * — páginas de demo del theme que nunca debieron indexarse.
 */
const LEGACY_REDIRECTS = [
  // Match exacto: la página nueva cumple la misma función.
  { source: "/reservations", destination: "/online-reservation/" },
  { source: "/reservations-2", destination: "/online-reservation/" },
  {
    source: "/airport/newark-liberty-international-airport-transfer-services",
    destination: "/airport/",
  },

  // For Business = landings de SEO (Nico, 18-oct-2026): las versiones
  // anteriores de travel advisors y affiliates pasan a su landing, en los 3
  // idiomas. /events y /corporate no: siguen siendo las páginas de Services.
  { source: "/for-business/travel-advisors", destination: "/travel-advisors/" },
  {
    source: "/:locale(es|pt)/for-business/travel-advisors",
    destination: "/:locale/travel-advisors/",
  },
  { source: "/affiliates", destination: "/affiliate-partners/" },
  {
    source: "/:locale(es|pt)/affiliates",
    destination: "/:locale/affiliate-partners/",
  },

  // /concierge no está acá: se recuperó como landing 200 (app/[locale]/concierge),
  // que es lo que pedía el audit en lugar de mandarla a /services/.

  // Match temático. La página vieja no tiene equivalente 1:1, va a la más cercana.
  { source: "/wedding", destination: "/events/" },
  { source: "/artist-transportation", destination: "/events/" },
  { source: "/tours", destination: "/hourly/" },

  // Interino: /relier-europe/ existía en el WP y todavía está pendiente acá.
  // Cuando la página exista, borrar este redirect.
  { source: "/relier-europe", destination: "/about/" },

  // SEO local del WP: 21 páginas /locations/<ciudad> + el hub, 27.157
  // impresiones GSC entre todas. Sigue siendo un parche y no una solución: el
  // audit (P0) pide recrear las landings, no redirigirlas. Lo que sí se
  // corrigió es el catch-all a /services/, que el audit marcó como "pérdida de
  // intención" y Google puede leer como soft-404.
  //
  // El destino de cada una sale del title que tenía en el WP (relevado de
  // Wayback, ver docs/seo-legacy-wordpress.md): las que vendían "limo and car
  // service" van a /transfers/, que es la landing de punto a punto; las que
  // vendían "sightseeing/private tours" van a /hourly/, el mismo destino que
  // /tours/ porque el servicio as-directed es el que cubre esa intención.
  { source: "/locations", destination: "/services/" },

  // Intención "limo & car service" → transfers punto a punto.
  { source: "/locations/newark-nj-limo-and-car-service", destination: "/transfers/" },
  { source: "/locations/jersey-city-nj-limo-and-car-service", destination: "/transfers/" },
  { source: "/locations/new-york-city-nyc-limo-and-car-service", destination: "/transfers/" },
  { source: "/locations/caldwell-nj-limo-and-car-service", destination: "/transfers/" },
  { source: "/locations/hicksville-ny-limo-and-car-service", destination: "/transfers/" },
  { source: "/locations/fort-lee-nj-limo-and-car-service", destination: "/transfers/" },
  { source: "/locations/new-rochelle-ny-limo-and-car-service", destination: "/transfers/" },
  { source: "/locations/montauk-ny-limousine-and-luxury-car-services", destination: "/transfers/" },

  // Intención "sightseeing / private tours" → as-directed por horas.
  { source: "/locations/staten-island-nyc-private-tours", destination: "/hourly/" },
  { source: "/locations/yonkers-ny-sightseeing-and-event-transportation", destination: "/hourly/" },
  { source: "/locations/port-washington-ny-sightseeing-tours-and-transport-services", destination: "/hourly/" },
  { source: "/locations/brooklyn-sightseeing-tours", destination: "/hourly/" },
  { source: "/locations/queens-ny-sightseeing-tours", destination: "/hourly/" },
  { source: "/locations/bronx-ny-sightseeing-tours-private-car-services", destination: "/hourly/" },
  { source: "/locations/tour-manhattan-private-limo-car-bus-service", destination: "/hourly/" },
  { source: "/locations/long-island-ny-private-tours-transit", destination: "/hourly/" },
  { source: "/locations/secaucus-nj-private-tours-event-transportation", destination: "/hourly/" },
  { source: "/locations/elizabeth-nj-private-tours-event-transportation", destination: "/hourly/" },
  { source: "/locations/union-city-nj-private-tours-car-services", destination: "/hourly/" },
  { source: "/locations/babylon-ny-premier-tours-transport-services", destination: "/hourly/" },

  // Fallback para las /locations/* que no quedaron relevadas: el patrón del WP
  // era mayoritariamente car service, así que transfers es el destino más
  // cercano. Sigue siendo mejor que el índice de servicios.
  { source: "/locations/:slug*", destination: "/transfers/" },

  // /tag/* y /category/* NO van acá: el audit de SEO pidió 410 en lugar de un
  // 301 masivo a /blog/. Se sirven desde middleware.ts (redirects() corre antes
  // del middleware, así que dejarlos acá lo anularía).

  // Paginación del WordPress (/blog/page/2/, /page/2/): el listado nuevo no
  // pagina por URL. Van al hub del blog (roadmap SEO sep-2026, T11).
  { source: "/blog/page/:page", destination: "/blog/" },
  { source: "/page/:page", destination: "/blog/" },

  // Posts que no se portaron a content/news. Si algún día se escriben, borrar.
  {
    source: "/relier-vs-other-luxury-transportation-providers",
    destination: "/blog/",
  },
  {
    source: "/the-best-luxury-transportation-services-for-events-an-in-depth-guide",
    destination: "/blog/",
  },
  {
    source: "/which-companies-offer-luxury-vehicle-transfers-for-airport-travel",
    destination: "/blog/",
  },
];

// Headers de seguridad (auditoría oct-2026): producción no mandaba ninguno salvo
// el `upgrade-insecure-requests` que agrega Cloudflare. Sin CSP de scripts a
// propósito: GTM inyecta lo que el equipo de performance configure en el
// container y una allowlist rota en silencio los tags. `frame-ancestors` sí,
// porque evita que los formularios se embeban en otro sitio (clickjacking).
// geolocation/payment no se restringen: el iframe de Limo Anywhere puede usarlos.
const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), usb=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  poweredByHeader: false,
  // Match relier.com legacy URLs (/about/, /<post-slug>/, etc.) for SEO continuity.
  trailingSlash: true,
  // AVIF primero, WebP de respaldo (perf oct-2026): mismo aspecto, menos bytes.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["gsap"],
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  async redirects() {
    return LEGACY_REDIRECTS.map((r) => ({ ...r, permanent: true }));
  },
};

export default withNextIntl(nextConfig);
