import { hasLocale } from "next-intl";
import { ORIGIN, localeUrl } from "@/lib/i18n/seo";
import { SOCIAL_SAME_AS } from "@/lib/social/profiles";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Structured data del sitio. Los tipos por página salen de la schema matrix
 * del equipo de SEO (`relier_schema_matrix.xlsx`, oct-2026), que reemplaza al
 * "Schema Implementation Map" del audit de ago-2026:
 *
 *   Home              → Organization + WebSite + WebPage
 *   Services hub      → CollectionPage + ItemList + BreadcrumbList
 *   Service landing   → WebPage + Service (con audience) + BreadcrumbList
 *   Fleet             → CollectionPage + ItemList(Vehicle/BusOrCoach) + BreadcrumbList
 *   Signature Events  → CollectionPage + ItemList(Service, Event en about) + BreadcrumbList
 *   FIFA World Cup    → WebPage + Service (Event en about) + BreadcrumbList
 *   Blog hub          → CollectionPage + Blog (blogPost) + BreadcrumbList
 *   Blog post         → BlogPosting + BreadcrumbList
 *   About             → AboutPage + Organization + BreadcrumbList
 *   Contact           → ContactPage + Organization + BreadcrumbList
 *   Testimonials      → CollectionPage + BreadcrumbList, sin Review/AggregateRating
 *   Reservations      → WebPage + BreadcrumbList
 *   For Business hub  → CollectionPage + ItemList (4 segmentos) + BreadcrumbList
 *   Travel Advisors   → Service + WebPage + BreadcrumbList (roadmap sep-2026, T04)
 *   Affiliates        → WebPage (about Organization) + BreadcrumbList, sin Service
 *                       (T05: es un partner program, no un servicio que se vende)
 *   Localized (es/pt) → mismo tipo + inLanguage, con @id y canonical coherentes
 *
 * Las páginas no indexables (tags, legacy, endpoints técnicos) no llevan nada:
 * el mapa lo dice explícitamente.
 */

export type SchemaNode = Record<string, unknown>;

/**
 * @id canónico de la entidad (regla de la schema matrix: uno solo para todo el
 * sitio y los tres idiomas). Hasta oct-2026 era `#business`; se migró a
 * `#organization` para alinearlo con la matrix.
 */
export const BUSINESS_ID = `${ORIGIN}/#organization`;
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
  url: `${ORIGIN}/`,
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
      contactType: "reservations and concierge",
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
  url: `${ORIGIN}/`,
  name: "Relier",
  publisher: { "@id": BUSINESS_ID },
  inLanguage: ["en", "es", "pt"],
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

/**
 * Home: el WebPage que la matrix pide junto a Organization + WebSite (esos dos
 * ya los emite el layout). Sin breadcrumb: la home es la raíz.
 */
export function homeSchema({
  locale,
  name,
  description,
}: Pick<PageArgs, "locale" | "name" | "description">): SchemaNode[] {
  return [
    {
      "@type": "WebPage",
      "@id": pageId(locale, "/"),
      url: pageUrl(locale, "/"),
      name,
      description,
      inLanguage: IN_LANGUAGE[locale] ?? IN_LANGUAGE.en,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": BUSINESS_ID },
    },
  ];
}

export interface ServiceExtras {
  serviceType: string;
  /** Audience / BusinessAudience: la matrix lo pide en las páginas B2B y de eventos. */
  audience?: SchemaNode;
  /** Pisa el default worldwide cuando la página es de una zona concreta. */
  areaServed?: SchemaNode[];
  /** Contexto del servicio (p. ej. un Event). Nunca Relier como organizer. */
  about?: SchemaNode;
}

/** Nodo Service suelto, para las landings y para los ItemList de hubs. */
export function serviceNode(
  id: string,
  name: string,
  description: string,
  { serviceType, audience, areaServed, about }: ServiceExtras
): SchemaNode {
  return {
    "@type": "Service",
    "@id": id,
    name,
    description,
    serviceType,
    provider: { "@id": BUSINESS_ID },
    areaServed: areaServed ?? AREA_SERVED,
    ...(audience ? { audience } : {}),
    ...(about ? { about } : {}),
  };
}

/** Service landing: transfers, hourly, corporate, events, airport, etc. */
export function serviceSchema(args: PageArgs & ServiceExtras): SchemaNode[] {
  const { locale, path, name, description } = args;
  const serviceId = `${pageUrl(locale, path)}#service`;
  return [
    ...pageNode("WebPage", args, { mainEntity: { "@id": serviceId } }),
    {
      ...serviceNode(serviceId, name, description, args),
      mainEntityOfPage: { "@id": pageId(locale, path) },
    },
  ];
}

/**
 * Hub con listado: /services/, /fleet/, /for-business/, /signature-events/.
 * `item` embebe la entidad del ListItem (Vehicle, Service) cuando la matrix la
 * pide; sin `item` queda el ListItem con name + url.
 */
export function collectionSchema(
  args: PageArgs & {
    items: { name: string; url?: string; item?: SchemaNode }[];
  }
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
      itemListElement: items.map((entry, i) => ({
        "@type": "ListItem",
        position: i + 1,
        ...(entry.item
          ? { item: entry.item }
          : { name: entry.name, ...(entry.url ? { url: entry.url } : {}) }),
      })),
    },
  ];
}

/** Páginas que sólo necesitan el contenedor: /online-reservation/, legales. */
export function webPageSchema(args: PageArgs): SchemaNode[] {
  return pageNode("WebPage", args);
}

/**
 * Páginas cuyo tema es la propia Relier: /about/, /contact/, /testimonials/ y
 * /affiliates/. La Organization no se repite acá — ya la emite `JsonLd` en el
 * layout con el mismo @id, así que alcanza con apuntarle desde `about`.
 */
export function entityPageSchema(
  type: "AboutPage" | "ContactPage" | "CollectionPage" | "WebPage",
  args: PageArgs
): SchemaNode[] {
  return pageNode(type, args, { about: { "@id": BUSINESS_ID } });
}

/**
 * Hub editorial /blog/: CollectionPage cuyo mainEntity es el Blog, con
 * referencias por @id a cada BlogPosting (el nodo completo vive en cada post).
 */
export function blogSchema(
  args: PageArgs & { posts: { url: string; headline: string }[] }
): SchemaNode[] {
  const { locale, path, name, description, posts } = args;
  const blogId = `${pageUrl(locale, path)}#blog`;
  return [
    ...pageNode("CollectionPage", args, { mainEntity: { "@id": blogId } }),
    {
      "@type": "Blog",
      "@id": blogId,
      url: pageUrl(locale, path),
      name,
      description,
      inLanguage: IN_LANGUAGE[locale] ?? IN_LANGUAGE.en,
      publisher: { "@id": BUSINESS_ID },
      blogPost: posts.map((p) => ({
        "@type": "BlogPosting",
        "@id": `${p.url}#post`,
        url: p.url,
        headline: p.headline,
      })),
    },
  ];
}

/** og:image por defecto (app/opengraph-image.jpg), para posts sin cover propia. */
const DEFAULT_IMAGE = `${ORIGIN}/opengraph-image.jpg`;

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
      image: image ? `${ORIGIN}${image}` : DEFAULT_IMAGE,
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
