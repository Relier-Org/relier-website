import type { MetadataRoute } from "next";
import { ORIGIN } from "@/lib/i18n/seo";

// Ojo: Cloudflare sirve su propio robots.txt "managed" por delante del origin
// (agrega los Content-Signal y bloquea crawlers de IA). Este archivo es el
// fallback del origin y la fuente del `Sitemap:`; si algún día se apaga el
// managed de Cloudflare, esto es lo que queda.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${ORIGIN}/sitemap.xml`,
    host: ORIGIN,
  };
}
