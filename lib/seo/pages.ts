import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ORIGIN } from "@/lib/i18n/seo";
import { SERVICES } from "@/lib/services/data";
import { FLEET } from "@/lib/fleet/data";
import type { Post } from "@/lib/blog/posts";
import {
  blogSchema,
  collectionSchema,
  entityPageSchema,
  postSchema,
  serviceSchema,
  webPageSchema,
  type Crumb,
  type SchemaNode,
} from "./schema";

/**
 * Un helper por página para armar su grafo JSON-LD. Vive acá y no en cada
 * `page.tsx` para que los breadcrumbs sean consistentes y las páginas queden
 * con una sola línea: `<PageSchema nodes={await transfersNodes(locale)} />`.
 *
 * Los labels de breadcrumb NO son strings nuevos: se reusan los que ya están
 * traducidos en `nav.links.*` y `common.*`, así los tres locales salen bien sin
 * agregar claves que después haya que mantener sincronizadas.
 */

async function crumbLabels(locale: string) {
  const nav = await getTranslations({ locale, namespace: "nav.links" });
  const c = await getTranslations({ locale, namespace: "common" });
  return {
    home: nav("home"),
    services: nav("services"),
    fleet: nav("fleet"),
    forBusiness: nav("forBusiness"),
    about: nav("about"),
    contact: nav("contact"),
    transfers: c("transfers"),
    hourly: c("asDirectedHourly"),
    corporate: c("corporate"),
    events: c("events"),
    signatureEvents: c("signatureEvents"),
    airport: c("airportTransfers"),
    fifa: c("fifaWorldCup2026"),
    concierge: c("concierge"),
    testimonials: c("testimonials"),
    blog: c("news"),
  };
}

const SERVICES_CRUMB = (label: string): Crumb => ({
  name: label,
  path: "/services",
});

/**
 * Las cuatro landings que cuelgan de /services/ más las que el schema map
 * también trata como Service landing (airport, signature events, FIFA,
 * for-business). `serviceType` en inglés a propósito: es un valor de datos que
 * Google lee, no copy visible.
 */
const SERVICE_LANDINGS = {
  transfers: {
    path: "/transfers",
    ns: "services.transfers",
    serviceType: "Private chauffeured transfers",
    crumb: "transfers",
    underServices: true,
  },
  hourly: {
    path: "/hourly",
    ns: "services.hourly",
    serviceType: "Hourly as-directed chauffeur service",
    crumb: "hourly",
    underServices: true,
  },
  corporate: {
    path: "/corporate",
    ns: "services.corporate",
    serviceType: "Corporate ground transportation",
    crumb: "corporate",
    underServices: true,
  },
  events: {
    path: "/events",
    ns: "services.events",
    serviceType: "Event transportation",
    crumb: "events",
    underServices: true,
  },
  airport: {
    path: "/airport",
    ns: "services.airport",
    serviceType: "Airport transfers",
    crumb: "airport",
    underServices: true,
  },
  concierge: {
    path: "/concierge",
    ns: "services.concierge",
    serviceType: "Concierge transportation",
    crumb: "concierge",
    underServices: true,
  },
  signatureEvents: {
    path: "/signature-events",
    ns: "services.signatureEvents",
    serviceType: "Event transportation",
    crumb: "signatureEvents",
    underServices: true,
  },
  forBusiness: {
    path: "/for-business",
    ns: "services.forBusiness",
    serviceType: "Chauffeured transportation for business accounts",
    crumb: "forBusiness",
    underServices: false,
  },
} as const;

export async function serviceLandingNodes(
  locale: string,
  key: keyof typeof SERVICE_LANDINGS
): Promise<SchemaNode[]> {
  const cfg = SERVICE_LANDINGS[key];
  const labels = await crumbLabels(locale);
  const t = await getTranslations({ locale, namespace: cfg.ns });
  const trail: Crumb[] = [
    ...(cfg.underServices ? [SERVICES_CRUMB(labels.services)] : []),
    { name: labels[cfg.crumb], path: cfg.path },
  ];
  return serviceSchema({
    locale,
    path: cfg.path,
    name: t("hero.title"),
    description: t("meta.description"),
    serviceType: cfg.serviceType,
    homeName: labels.home,
    trail,
  });
}

/** La página FIFA vive fuera del namespace `services`, de ahí el helper aparte. */
export async function worldCupNodes(locale: string): Promise<SchemaNode[]> {
  const labels = await crumbLabels(locale);
  const t = await getTranslations({ locale, namespace: "wc" });
  return serviceSchema({
    locale,
    path: "/fifa-world-cup-2026-private-transportation",
    name: t("hero.title"),
    description: t("meta.description"),
    serviceType: "Event transportation",
    homeName: labels.home,
    trail: [
      SERVICES_CRUMB(labels.services),
      {
        name: labels.fifa,
        path: "/fifa-world-cup-2026-private-transportation",
      },
    ],
  });
}

export async function servicesHubNodes(locale: string): Promise<SchemaNode[]> {
  const labels = await crumbLabels(locale);
  const t = await getTranslations({ locale, namespace: "services" });
  return collectionSchema({
    locale,
    path: "/services",
    name: t("hero.title"),
    description: t("meta.description"),
    homeName: labels.home,
    trail: [SERVICES_CRUMB(labels.services)],
    // ItemList con los servicios reales enlazados, como pide el schema map.
    items: SERVICES.map((s) => ({
      name: t(`items.${s.slug}.title`),
      url: `${ORIGIN}${s.href}`,
    })),
  });
}

export async function fleetNodes(locale: string): Promise<SchemaNode[]> {
  const labels = await crumbLabels(locale);
  const t = await getTranslations({ locale, namespace: "fleet" });
  return collectionSchema({
    locale,
    path: "/fleet",
    name: `${t("hero.titleLine1")} ${t("hero.titleLine2")}`,
    description: t("meta.description"),
    homeName: labels.home,
    trail: [{ name: labels.fleet, path: "/fleet" }],
    // Categorías, no modelos: el schema map avisa de no usar Product salvo que
    // haya una oferta de producto real.
    items: FLEET.map((v) => ({ name: t(`tiers.${v.id}`) })),
  });
}

/**
 * El hub del blog queda fuera del cluster hreflang: /es/blog/ y /pt/blog/
 * canonicalizan al listado inglés (ver app/[locale]/blog/page.tsx). Por eso el
 * grafo se emite siempre con la URL y los labels del locale default — si usara
 * el locale de la request, el @id apuntaría a una URL que no es la canónica y
 * la entidad quedaría partida en tres. Mismo criterio que `postSchema`.
 */
export async function blogHubNodes(): Promise<SchemaNode[]> {
  const locale = routing.defaultLocale;
  const labels = await crumbLabels(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  return blogSchema({
    locale,
    path: "/blog",
    name: `${t("hero.titleLine1")} ${t("hero.titleLine2")}`,
    description: t("meta.description"),
    homeName: labels.home,
    trail: [{ name: labels.blog, path: "/blog" }],
  });
}

export async function aboutNodes(locale: string): Promise<SchemaNode[]> {
  const labels = await crumbLabels(locale);
  const t = await getTranslations({ locale, namespace: "pages.about" });
  return entityPageSchema("AboutPage", {
    locale,
    path: "/about",
    name: `${t("hero.titleLine1")} ${t("hero.titleLine2")}`,
    description: t("meta.description"),
    homeName: labels.home,
    trail: [{ name: labels.about, path: "/about" }],
  });
}

export async function contactNodes(locale: string): Promise<SchemaNode[]> {
  const labels = await crumbLabels(locale);
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  return entityPageSchema("ContactPage", {
    locale,
    path: "/contact",
    name: `${t("hero.titleLine1")} ${t("hero.titleLine2")}`,
    description: t("meta.description"),
    homeName: labels.home,
    trail: [{ name: labels.contact, path: "/contact" }],
  });
}

/**
 * /testimonials/ no está en el schema map de la hoja 08 y la hoja 00 sugería
 * `Service`, que sería falso — la página no vende un servicio, muestra
 * reviews. Queda WebPage + BreadcrumbList. No se emite `aggregateRating`
 * porque no hay un feed verificable de reviews en el repo (mismo criterio que
 * la entidad de negocio).
 */
export async function testimonialsNodes(locale: string): Promise<SchemaNode[]> {
  const labels = await crumbLabels(locale);
  const t = await getTranslations({ locale, namespace: "pages.testimonials" });
  return webPageSchema({
    locale,
    path: "/testimonials",
    name: `${t("hero.titleLine1")} ${t("hero.titleLine2")}`,
    description: t("meta.description"),
    homeName: labels.home,
    trail: [{ name: labels.testimonials, path: "/testimonials" }],
  });
}

export async function reservationNodes(locale: string): Promise<SchemaNode[]> {
  const labels = await crumbLabels(locale);
  const t = await getTranslations({
    locale,
    namespace: "services.reservation",
  });
  return webPageSchema({
    locale,
    path: "/online-reservation",
    name: `${t("hero.titleLine1")} ${t("hero.titleLine2")}`,
    description: t("meta.description"),
    homeName: labels.home,
    trail: [{ name: t("hero.eyebrow"), path: "/online-reservation" }],
  });
}

/** Ídem: los posts son EN-only, así que el grafo va siempre en el locale default. */
export async function postNodes(post: Post): Promise<SchemaNode[]> {
  const labels = await crumbLabels(routing.defaultLocale);
  return postSchema({
    url: `${ORIGIN}/${post.slug}/`,
    headline: post.title,
    description: post.metaDescription ?? post.excerpt,
    datePublished: post.date,
    dateModified: post.modified,
    author: post.author,
    image: post.cover,
    homeName: labels.home,
    blogName: labels.blog,
  });
}
