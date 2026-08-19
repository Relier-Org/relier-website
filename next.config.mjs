import path from "node:path";
import { fileURLToPath } from "node:url";
import createNextIntlPlugin from "next-intl/plugin";

// Plain JS on purpose, no .ts. `next start` carga este archivo en runtime y un
// next.config.ts necesita el paquete `typescript`, que es devDependency: con un
// `npm ci --omit=dev` en el server (Hostinger) el arranque muere con
// MODULE_NOT_FOUND. En .mjs no hay nada que transpilar.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // Match relier.com legacy URLs (/about/, /<post-slug>/, etc.) for SEO continuity.
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ["gsap"],
  },
};

export default withNextIntl(nextConfig);
