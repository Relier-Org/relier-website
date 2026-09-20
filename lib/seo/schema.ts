import { hasLocale } from "next-intl";
import { ORIGIN, localeUrl } from "@/lib/i18n/seo";
import { SOCIAL_SAME_AS } from "@/lib/social/profiles";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Structured data del sitio. Los tipos por página salen del "Schema
 * Implementation Map" del audit de SEO (ago-2026):
 *
 *   Home              → Organization + WebSite
 *   Services hub      → CollectionPage + ItemList + BreadcrumbList
 *   Service landing   → Service + BreadcrumbList
 *   Fleet             → CollectionPage + ItemList + BreadcrumbList
 *   Blog hub          → Blog + BreadcrumbList
 *   Blog post         → BlogPosting + BreadcrumbList
 *   About             → AboutPage + Organization + BreadcrumbList
 *   Contact           → ContactPage + Organization + BreadcrumbList
 *   Reservations      → WebPage + BreadcrumbList
 *   For Business hub  → CollectionPage + ItemList (4 segmentos) + BreadcrumbList
 *   Travel Advisors   → Service + WebPage + BreadcrumbList (roadmap sep-2026, T04)
 *   Affiliates        → WebPage + BreadcrumbList, sin Service (T05: es un
 *                       partner program, no un servicio que se vende)
 *   Localized (es/pt) → mismo tipo + inLanguage, con @id y canonical coherentes
 *
 * Las páginas no indexables (tags, legacy, endpoints técnicos) no llevan nada:
 * el mapa lo dice explícitamente.
 */

export type SchemaNode = Record<string, unknown>;

export const BUSINESS_ID = `${ORIGIN}/#business`;
export const WEBSITE_ID = `${ORIGIN}/#website`;

/** BCP 47 por locale, el mismo criterio que los og:locale del layout. */
const IN_LANGUAGE: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  pt: "pt-BR",
};

const AREA_SERVED = [
  { "@type": "Place", name: "Americas" },
  { "@type": "Place", name: "Europe" },
  { "@type": "Place", name: "Middle East" },
];

/**
 * Entidad de negocio. Subtipo de LocalBusiness: más preciso que Organization
 * pelado y es el que Google entiende para servicios de chofer.
 *
 * Los datos salen del repo (Footer.tsx y el embed de Google Maps). Nada
 * inventado: el `sameAs` sale de lib/social/profiles.ts y no hay
 * `aggregateRating` porque no hay una fuente real de reviews.
 *
 * Roadmap SEO sep-2026 (T02): la entidad lleva logo, contactPoint y
 * foundingDate sólo porque los tres están confirmados en el sitio (logo del
 * Nav, "Concierge · 24/7" y "since 2012" del footer, idiomas del sitio). Sin
 * `Person` de leadership hasta que el cliente valide nombre/cargo/foto.
 *
 * TODO: cuando el cliente confirme la dirección de Barcelona (ver Footer.tsx),
 * agregarla como segundo nodo `LimousineService` con su propio @id.
 */
export const businessNode: SchemaNode = {
  "@type": "LimousineService",
  "@id": BUSINESS_ID,
  name: "Relier",
  alternateName: "Relier Worldwide Chauffeured Services",
  description:
    "Personal mobility concierge. Chauffeured ground transportation across the Americas, Europe, and the Middle East.",
  url: ORIGIN,
  logo: {
    "@type": "ImageObject",
    url: `${ORIGIN}/images/relier-logo.png`,
  },
  foundingDate: "2012",
  telephone: "+1-844-735-4371",
  email: "info@relier.com",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+1-844-735-4371",
      email: "info@relier.com",
      availableLanguage: ["English", "Spanish", "Portuguese"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    },
  ],
  sameAs: SOCIAL_SAME_AS,
  address: {
    "@type": "PostalAddress",
    streetAddress: "240 Kent Ave, 3rd Floor B14",
    addressLocality: "Brooklyn",
    addressRegion: "NY",
    postalCode: "11249",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 40.7170066,
    longitude: -73.9682732,
  },
  areaServed: AREA_SERVED,
};

export const websiteNode: SchemaNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: ORIGIN,
  name: "Relier",
  publisher: { "@id": BUSINESS_ID },
};

/** Mismo criterio que `localeAlternates`: un locale desconocido cae al default. */
const asLocale = (locale: string): Locale =>
  hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;

export function graph(nodes: SchemaNode[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Ruta locale-agnóstica ("/transfers") + label ya traducido. */
export interface Crumb {
  name: string;
  path: string;
}

const pageId = (locale: string, path: string) =>
  `${localeUrl(asLocale(locale), path)}#webpage`;
const breadcrumbId = (locale: string, path: string) =>
  `${localeUrl(asLocale(locale), path)}#breadcrumb`;
/** URL absoluta de una ruta en el locale pedido; la usan también los ItemList. */
export const pageUrl = (locale: string, path: string) =>
  localeUrl(asLocale(locale), path);

/**
 * `trail` NO incluye Home — se prepende acá para que ninguna página tenga que
 * repetirlo. El último elemento es la página actual.
 */
function breadcrumbNode(
  locale: string,
  homeName: string,
  trail: Crumb[]
): SchemaNode {
  const crumbs = [{ name: homeName, path: "/" }, ...trail];
  return {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId(locale, trail[trail.length - 1].path),
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: pageUrl(locale, c.path),
    })),
  };
}

export interface PageArgs {
  locale: string;
  /** Ruta locale-agnóstica, la misma que se le pasa a `localeAlternates`. */
  path: string;
  name: string;
  description: string;
  homeName: string;
  trail: Crumb[];
}

/**
 * Nodo contenedor de la página. Lleva el `inLanguage` que el mapa pide para
 * /es/ y /pt/, y cuelga del WebSite y del BreadcrumbList por @id — así los
 * nodos temáticos (Service, ItemList) no tienen que repetir esos datos.
 */
function pageNode(
  type: string,
  { locale, path, name, description, homeName, trail }: PageArgs,
  extra: SchemaNode = {}
): SchemaNode[] {
  const url = pageUrl(locale, path);
  return [
    {
      "@type": type,
      "@id": pageId(locale, path),
      url,
      name,
      description,
      inLanguage: IN_LANGUAGE[locale] ?? IN_LANGUAGE.en,
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": breadcrumbId(locale, path) },
      ...extra,
    },
    breadcrumbNode(locale, homeName, trail),
  ];
}

/** Service landing: transfers, hourly, corporate, events, airport, etc. */
export function serviceSchema(
  args: PageArgs & { serviceType: string }
): SchemaNode[] {
  const { locale, path, name, description, serviceType } = args;
  return [
    ...pageNode("WebPage", args),
    {
      "@type": "Service",
      "@id": `${pageUrl(locale, path)}#service`,
      name,
      description,
      serviceType,
      provider: { "@id": BUSINESS_ID },
      areaServed: AREA_SERVED,
      mainEntityOfPage: { "@id": pageId(locale, path) },
    },
  ];
}

/** Hub con listado: /services/ y /fleet/. */
export function collectionSchema(
  args: PageArgs & { items: { name: string; url?: string }[] }
): SchemaNode[] {
  const { locale, path, items } = args;
  return [
    ...pageNode("CollectionPage", args, {
      mainEntity: { "@id": `${pageUrl(locale, path)}#list` },
    }),
    {
      "@type": "ItemList",
      "@id": `${pageUrl(locale, path)}#list`,
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        ...(item.url ? { url: item.url } : {}),
      })),
    },
  ];
}

/** Páginas que sólo necesitan el contenedor: /online-reservation/, legales. */
export function webPageSchema(args: PageArgs): SchemaNode[] {
  return pageNode("WebPage", args);
}

/**
 * /about/ y /contact/: el mapa pide el tipo específico + la Organization. La
 * Organization no se repite acá — ya la emite `JsonLd` en el layout con el
 * mismo @id, así que alcanza con apuntarle desde `about`.
 */
export function entityPageSchema(
  type: "AboutPage" | "ContactPage",
  args: PageArgs
): SchemaNode[] {
  return pageNode(type, args, { about: { "@id": BUSINESS_ID } });
}

/** Hub editorial /blog/. */
export function blogSchema(args: PageArgs): SchemaNode[] {
  return pageNode("Blog", args, { publisher: { "@id": BUSINESS_ID } });
}

export interface PostSchemaArgs {
  /** Los posts viven sin prefijo de locale y canonicalizan al inglés. */
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  image?: string;
  homeName: string;
  blogName: string;
}

/**
 * BlogPosting de un artículo. El @id y el canonical usan la URL sin prefijo:
 * los posts son EN-only y las versiones /es/ y /pt/ canonicalizan al inglés
 * (ver app/[locale]/[slug]/page.tsx), así que el breadcrumb sigue el mismo
 * criterio para no partir la entidad en tres.
 */
export function postSchema({
  url,
  headline,
  description,
  datePublished,
  dateModified,
  author,
  image,
  homeName,
  blogName,
}: PostSchemaArgs): SchemaNode[] {
  return [
    {
      "@type": "BlogPosting",
      "@id": `${url}#post`,
      url,
      headline,
      description,
      datePublished,
      dateModified: dateModified ?? datePublished,
      author: { "@type": "Organization", name: author, url: ORIGIN },
      publisher: { "@id": BUSINESS_ID },
      ...(image ? { image: `${ORIGIN}${image}` } : {}),
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      isPartOf: { "@id": WEBSITE_ID },
      inLanguage: IN_LANGUAGE.en,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: homeName, item: `${ORIGIN}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: blogName,
          item: `${ORIGIN}/blog/`,
        },
        { "@type": "ListItem", position: 3, name: headline, item: url },
      ],
    },
  ];
}
