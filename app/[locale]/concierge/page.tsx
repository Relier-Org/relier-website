import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/i18n/seo";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/sections/ServiceHero";
import ServiceBody, {
  type ServiceBlock,
} from "@/components/sections/ServiceBody";
import ServiceCloser from "@/components/sections/ServiceCloser";
import GsapProvider from "@/components/effects/GsapProvider";
import PageSchema from "@/components/seo/PageSchema";
import { serviceLandingNodes } from "@/lib/seo/pages";

// Recupera /concierge/, que el corte del WordPress dejó redirigiendo a
// /services/. Es la URL con más demanda perdida del sitio: 11.344 impresiones
// GSC y 156 en features generativas en los últimos 3 meses, con el redirect
// marcado P0 en el audit de SEO (ago-2026) por mandar intención comercial
// propia a una página genérica.
//
// El WP tenía acá "Premium Concierge Transportation in New York City (NYC)"
// (ver docs/seo-legacy-wordpress.md). Wayback sólo conservó su metadata, no el
// body, así que el copy es nuevo y se apoya en lo que el sitio ya afirma:
// 500+ ciudades, chóferes bilingües, concierge 24/7, precio fijo.
//
// TODO (copy): revisar con el cliente antes de darlo por cerrado; las
// traducciones es/pt siguen el draft EN.
// TODO (imágenes): provisorias reutilizadas; pendiente shooting propio.

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "services.concierge.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/concierge", locale),
  };
}

export default async function ConciergePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.concierge");

  const blocks: ServiceBlock[] = [
    {
      title: t("blocks.oneDesk.title"),
      paragraphs: [t("blocks.oneDesk.p1")],
      image: "/images/news/the-importance-of-booking-concierge-in-advance-during-peak-season/cover.webp",
      imageAlt: t("blocks.oneDesk.imageAlt"),
      // Cluster concierge (roadmap SEO sep-2026, T14): las tres URLs se
      // preservan y se diferencian por intent; /concierge/ es la principal y
      // enlaza a las dos legacy, que a su vez apuntan de vuelta acá.
      links: [
        { href: "/concierge-service", label: t("links.conciergeService") },
      ],
    },
    {
      title: t("blocks.chauffeurs.title"),
      paragraphs: [t("blocks.chauffeurs.p1")],
      image: "/images/news/concierge-service/cover.webp",
      imageAlt: t("blocks.chauffeurs.imageAlt"),
    },
    {
      title: t("blocks.alwaysOn.title"),
      paragraphs: [t("blocks.alwaysOn.p1")],
      image: "/images/news/concierge-service-in-new-york-city/cover.webp",
      imageAlt: t("blocks.alwaysOn.imageAlt"),
      links: [
        {
          href: "/concierge-service-in-new-york-city",
          label: t("links.conciergeNyc"),
        },
      ],
    },
  ];

  return (
    <GsapProvider>
      <PageSchema nodes={await serviceLandingNodes(locale, "concierge")} />
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/services-listing/hero.webp"
          imageAlt={t("hero.imageAlt")}
        />
        <ServiceBody blocks={blocks} />
        <ServiceCloser title={t("closer.title")} body={t("closer.body")} />
      </main>
      <Footer />
    </GsapProvider>
  );
}
