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

  // Match temático. La página vieja no tiene equivalente 1:1, va a la más cercana.
  { source: "/wedding", destination: "/events/" },
  { source: "/artist-transportation", destination: "/events/" },
  { source: "/concierge", destination: "/services/" },
  { source: "/tours", destination: "/hourly/" },

  // Interino: /relier-europe/ existía en el WP y todavía está pendiente acá.
  // Cuando la página exista, borrar este redirect.
  { source: "/relier-europe", destination: "/about/" },

  // SEO local del WP: 21 páginas /locations/<ciudad>. No hay equivalente en el
  // sitio nuevo, así que esto es un parche para no perder el link equity, no
  // una solución — si el SEO local importa, hay que recrear las páginas.
  { source: "/locations", destination: "/services/" },
  { source: "/locations/:slug*", destination: "/services/" },

  // Archivos de WordPress: 60 /tag/* y 2 /category/* indexados, todos thin.
  { source: "/tag/:slug*", destination: "/blog/" },
  { source: "/category/:slug*", destination: "/blog/" },

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

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // Match relier.com legacy URLs (/about/, /<post-slug>/, etc.) for SEO continuity.
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ["gsap"],
  },
  async redirects() {
    return LEGACY_REDIRECTS.map((r) => ({ ...r, permanent: true }));
  },
};

export default withNextIntl(nextConfig);
