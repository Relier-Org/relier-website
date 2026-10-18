import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ORIGIN } from "@/lib/i18n/seo";
import { SERVICES } from "@/lib/services/data";
import { FLEET } from "@/lib/fleet/data";
import { B2B_SEGMENTS } from "@/lib/b2b/segments";
import { EVENTS } from "@/lib/events/data";
import { getAllPosts, type Post } from "@/lib/blog/posts";
import {
  blogSchema,
  collectionSchema,
  entityPageSchema,
  homeSchema,
  pageUrl,
  postSchema,
  serviceNode,
  serviceSchema,
  webPageSchema,
  type Crumb,
  type SchemaNode,
  type ServiceExtras,
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
    travelAdvisors: c("travelAdvisors"),
    affiliates: c("affiliates"),
    testimonials: c("testimonials"),
    blog: c("news"),
  };
}

/** El title sin el sufijo de marca, para nombres de entidad descriptivos. */
const stripBrand = (title: string) => title.replace(/\s*\|\s*Relier$/, "");

const WORLDWIDE: SchemaNode[] = [
  { "@type": "Place", name: "Americas" },
  { "@type": "Place", name: "Europe" },
  { "@type": "Place", name: "Middle East" },
];

const SERVICES_CRUMB = (label: string): Crumb => ({
  name: label,
  path: "/services",
});

/**
 * Las landings que cuelgan de /services/ más airport y concierge, y la de travel
 * advisors, que cuelga del hub /for-business/ (roadmap SEO sep-2026, T04).
 * `parent` fija el breadcrumb intermedio. `serviceType` y `audience` en inglés a
 * propósito: son valores de datos que Google lee, no copy visible, y el
 * audience sale de la meta description de cada página (schema matrix oct-2026).
 * `nameFromMeta` usa el title en vez del H1 cuando el H1 es un tagline.
 */
type LandingConfig = {
  path: string;
  ns: string;
  crumb: keyof Awaited<ReturnType<typeof crumbLabels>>;
  parent: "services" | "forBusiness";
  nameFromMeta?: boolean;
} & ServiceExtras;

const SERVICE_LANDINGS: Record<string, LandingConfig> = {
  transfers: {
    path: "/transfers",
    ns: "services.transfers",
    serviceType: "Private chauffeured transfers",
    audience: {
      "@type": "Audience",
      audienceType: "Private travelers, executives and VIP guests",
    },
    crumb: "transfers",
    parent: "services",
  },
  hourly: {
    path: "/hourly",
    ns: "services.hourly",
    serviceType: "Hourly as-directed chauffeur service",
    crumb: "hourly",
    parent: "services",
  },
  corporate: {
    path: "/corporate",
    ns: "services.corporate",
    serviceType: "Corporate ground transportation",
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Companies, business travelers and executive teams",
    },
    crumb: "corporate",
    parent: "services",
  },
  events: {
    path: "/events",
    ns: "services.events",
    serviceType: "Event transportation",
    audience: {
      "@type": "Audience",
      audienceType: "Artists, crews, production teams and event planners",
    },
    crumb: "events",
    parent: "services",
  },
  airport: {
    path: "/airport",
    ns: "services.airport",
    serviceType: "Airport transfers",
    crumb: "airport",
    parent: "services",
  },
  concierge: {
    path: "/concierge",
    ns: "services.concierge",
    serviceType: "Concierge transportation",
    // NYC-led con cobertura worldwide: la matrix pide representar las dos.
    areaServed: [{ "@type": "City", name: "New York" }, ...WORLDWIDE],
    crumb: "concierge",
    parent: "services",
  },

};

const FOR_BUSINESS_CRUMB = (label: string): Crumb => ({
  name: label,
  path: "/for-business",
});

export async function serviceLandingNodes(
  locale: string,
  key:
    | "transfers"
    | "hourly"
    | "corporate"
    | "events"
    | "airport"
    | "concierge"
    | "travelAdvisors"
): Promise<SchemaNode[]> {
  const cfg = SERVICE_LANDINGS[key];
  const labels = await crumbLabels(locale);
  const t = await getTranslations({ locale, namespace: cfg.ns });
  const parent: Crumb[] =
    cfg.parent === "services"
      ? [SERVICES_CRUMB(labels.services)]
      : [FOR_BUSINESS_CRUMB(labels.forBusiness)];
  const trail: Crumb[] = [parent[0], { name: labels[cfg.crumb], path: cfg.path }];
  return serviceSchema({
    ...cfg,
    locale,
    name: cfg.nameFromMeta ? stripBrand(t("meta.title")) : t("hero.title"),
    description: t("meta.description"),
    homeName: labels.home,
    trail,
  });
}

/** Mundial ya jugado: la matrix pide EventCompleted y FIFA como organizer. */
const WORLD_CUP_EVENT = EVENTS.find((e) => e.id === "world-cup")!;
const HOST_COUNTRIES: SchemaNode[] = [
  { "@type": "Country", name: "United States" },
  { "@type": "Country", name: "Mexico" },
  { "@type": "Country", name: "Canada" },
];

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
    areaServed: HOST_COUNTRIES,
    about: {
      "@type": "Event",
      name: "FIFA World Cup 2026",
      startDate: WORLD_CUP_EVENT.startDate,
      endDate: WORLD_CUP_EVENT.endDate,
      eventStatus: "https://schema.org/EventCompleted",
      location: HOST_COUNTRIES,
      organizer: {
        "@type": "Organization",
        name: "FIFA",
        url: "https://www.fifa.com/",
      },
    },
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

/**
 * /signature-events/ es un hub: CollectionPage + ItemList con un Service por
 * evento que muestra la página, y el Event anidado en `about` (Relier vende el
 * transporte, no organiza el evento). Los textos salen del mismo namespace que
 * renderiza `EventsDossier`.
 */
const EVENT_SERVICE_NAME: Record<string, (event: string) => string> = {
  en: (e) => `${e} transportation`,
  es: (e) => `Transporte para ${e}`,
  pt: (e) => `Transporte para ${e}`,
};

export async function signatureEventsNodes(
  locale: string
): Promise<SchemaNode[]> {
  const labels = await crumbLabels(locale);
  const t = await getTranslations({
    locale,
    namespace: "services.signatureEvents",
  });
  const serviceName = EVENT_SERVICE_NAME[locale] ?? EVENT_SERVICE_NAME.en;
  const path = "/signature-events";
  return collectionSchema({
    locale,
    path,
    name: t("hero.title"),
    description: t("meta.description"),
    homeName: labels.home,
    trail: [
      SERVICES_CRUMB(labels.services),
      { name: labels.signatureEvents, path },
    ],
    items: EVENTS.map((e) => {
      const eventName = t(`items.${e.id}.name`);
      return {
        name: eventName,
        item: serviceNode(
          `${pageUrl(locale, path)}#${e.id}`,
          serviceName(eventName),
          t.has(`items.${e.id}.service`)
            ? t(`items.${e.id}.service`)
            : t(`items.${e.id}.title`),
          {
            serviceType: "Event transportation",
            about: {
              "@type": "Event",
              name: eventName,
              startDate: e.startDate,
              endDate: e.endDate,
              ...(e.status === "operated"
                ? { eventStatus: "https://schema.org/EventCompleted" }
                : {}),
              location: { "@type": "Place", name: t(`items.${e.id}.venue`) },
            },
          }
        ),
      };
    }),
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

/**
 * Hub B2B (roadmap SEO sep-2026, T03): CollectionPage + ItemList con las 4
 * páginas de segmento. Las URLs van en el locale de la página para que el
 * ItemList apunte a las mismas versiones que enlazan las cards.
 */
export async function forBusinessHubNodes(
  locale: string
): Promise<SchemaNode[]> {
  const labels = await crumbLabels(locale);
  const t = await getTranslations({ locale, namespace: "services.forBusiness" });
  return collectionSchema({
    locale,
    path: "/for-business",
    name: t("hero.title"),
    description: t("meta.description"),
    homeName: labels.home,
    trail: [FOR_BUSINESS_CRUMB(labels.forBusiness)],
    items: B2B_SEGMENTS.map((s) => ({
      name: t(`segments.${s.id}.title`),
      url: pageUrl(locale, s.href),
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
    // Categorías, no modelos, y sin Product/Offer: no se venden ni alquilan
    // como producto en la página. Vehicle para autos y vans, BusOrCoach para
    // los buses; la capacidad es la misma que muestra la ficha.
    items: FLEET.map((v) => {
      const name = t(`tiers.${v.id}`);
      const isBus = v.id === "mini-coach" || v.id === "motor-coach";
      const [min, max] = String(v.passengers).split("–").map(Number);
      return {
        name,
        item: {
          "@type": isBus ? "BusOrCoach" : "Vehicle",
          name,
          vehicleSeatingCapacity: max
            ? { "@type": "QuantitativeValue", minValue: min, maxValue: max }
            : min,
        },
      };
    }),
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
  const posts = await getAllPosts();
  return blogSchema({
    locale,
    path: "/blog",
    name: `${t("hero.titleLine1")} ${t("hero.titleLine2")}`,
    description: t("meta.description"),
    homeName: labels.home,
    trail: [{ name: labels.blog, path: "/blog" }],
    posts: posts.map((p) => ({
      url: `${ORIGIN}/${p.slug}/`,
      headline: p.title,
    })),
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
    name: t("hero.title"),
    description: t("meta.description"),
    homeName: labels.home,
    trail: [{ name: labels.contact, path: "/contact" }],
  });
}

/**
 * /testimonials/: CollectionPage sobre Relier (schema matrix oct-2026). Nada
 * de Review/AggregateRating: son reviews importadas de Google/Tripadvisor y
 * Google las trata como self-serving / agregación de terceros.
 */
export async function testimonialsNodes(locale: string): Promise<SchemaNode[]> {
  const labels = await crumbLabels(locale);
  const t = await getTranslations({ locale, namespace: "pages.testimonials" });
  return entityPageSchema("CollectionPage", {
    locale,
    path: "/testimonials",
    name: `${t("hero.titleLine1")} ${t("hero.titleLine2")}`,
    description: t("meta.description"),
    homeName: labels.home,
    trail: [{ name: labels.testimonials, path: "/testimonials" }],
  });
}

export async function homeNodes(locale: string): Promise<SchemaNode[]> {
  const t = await getTranslations({ locale, namespace: "home" });
  return homeSchema({
    locale,
    name: t("meta.title"),
    description: t("meta.description"),
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

/**
 * Landings B2B del equipo de SEO (oct-2026): Service + WebPage + Breadcrumb +
 * FAQPage, como en sus HTML finales. Son las páginas de For Business (nav, hub
 * y footer; Nico, 18-oct-2026) y no se mezclan con Services: /events y
 * /corporate conservan su contenido de servicio. /affiliates y
 * /for-business/travel-advisors redirigen a su landing (next.config.mjs).
 */
export const LANDINGS = {
  events: {
    path: "/event-transportation",
    crumb: "events",
    serviceType: "Event transportation",
    audience: {
      "@type": "Audience",
      audienceType: "Artists, crews, production teams and event planners",
    },
  },
  corporate: {
    path: "/corporate-transportation",
    crumb: "corporate",
    serviceType:
      "Corporate transportation, executive car service and corporate chauffeur service",
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Companies, business travelers and executive teams",
    },
  },
  affiliates: {
    path: "/affiliate-partners",
    crumb: "affiliates",
    serviceType:
      "Limo affiliate network and chauffeur partner services in New York and Spain",
    areaServed: [
      { "@type": "City", name: "New York" },
      { "@type": "City", name: "Barcelona" },
      { "@type": "City", name: "Madrid" },
      ...WORLDWIDE,
    ],
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Chauffeured transportation operators",
    },
  },
  travelAdvisors: {
    path: "/travel-advisors",
    crumb: "travelAdvisors",
    serviceType: "Travel agency transportation and luxury ground transportation",
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Travel advisors, travel agencies and hospitality teams",
    },
  },
} as const satisfies Record<
  string,
  ServiceExtras & { path: string; crumb: keyof Awaited<ReturnType<typeof crumbLabels>> }
>;

export type LandingKey = keyof typeof LANDINGS;

export async function landingNodes(
  locale: string,
  key: LandingKey
): Promise<SchemaNode[]> {
  const cfg = LANDINGS[key];
  const labels = await crumbLabels(locale);
  const t = await getTranslations({ locale, namespace: `landings.${key}` });
  const faq = t.raw("faq") as { q: string; a: string }[];
  return [
    ...serviceSchema({
      ...(cfg as ServiceExtras),
      locale,
      path: cfg.path,
      name: t("hero.title"),
      description: t("meta.description"),
      homeName: labels.home,
      trail: [
        FOR_BUSINESS_CRUMB(labels.forBusiness),
        { name: labels[cfg.crumb], path: cfg.path },
      ],
    }),
    {
      "@type": "FAQPage",
      "@id": `${pageUrl(locale, cfg.path)}#faq`,
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
}
