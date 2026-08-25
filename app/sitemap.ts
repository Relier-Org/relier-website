import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { ORIGIN, localeUrl } from "@/lib/i18n/seo";
import { getAllPosts } from "@/lib/blog/posts";

// Locale-agnostic pathnames, same strings que se le pasan a `localeAlternates`
// en cada page. Si nace una ruta nueva, va acá también — no hay descubrimiento
// automático: el App Router no expone su propio árbol de rutas en runtime.
const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/services", priority: 0.9 },
  { path: "/transfers", priority: 0.8 },
  { path: "/airport", priority: 0.8 },
  { path: "/concierge", priority: 0.8 },
  { path: "/corporate", priority: 0.8 },
  { path: "/events", priority: 0.8 },
  { path: "/hourly", priority: 0.8 },
  { path: "/signature-events", priority: 0.8 },
  { path: "/fifa-world-cup-2026-private-transportation", priority: 0.7 },
  { path: "/fleet", priority: 0.8 },
  { path: "/for-business", priority: 0.7 },
  { path: "/online-reservation", priority: 0.7 },
  { path: "/about", priority: 0.6 },
  { path: "/testimonials", priority: 0.6 },
  { path: "/contact", priority: 0.6 },
  { path: "/blog", priority: 0.6 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Una entrada por ruta traducida, cada una declarando el cluster hreflang
  // completo — el mismo que emiten los `alternates` de la page.
  const pages: MetadataRoute.Sitemap = ROUTES.flatMap(({ path, priority }) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: {
          ...Object.fromEntries(
            routing.locales.map((l) => [l, localeUrl(l, path)])
          ),
          "x-default": localeUrl(routing.defaultLocale, path),
        },
      },
    }))
  );

  // Los posts son EN-only y quedan fuera del cluster hreflang (ver el comentario
  // en app/[locale]/[slug]/page.tsx): una sola URL sin prefijo, sin alternates.
  const posts = await getAllPosts();
  const articles: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${ORIGIN}/${post.slug}/`,
    lastModified: new Date(post.modified ?? post.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...pages, ...articles];
}
