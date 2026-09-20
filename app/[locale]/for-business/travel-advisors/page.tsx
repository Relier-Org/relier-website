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

// Página nueva (roadmap SEO sep-2026, R01 / P0): landing dedicada al travel
// trade, hija del hub /for-business/. Title, H1, meta, estructura y anchors
// salen de la hoja "SEO Specs" del Excel del equipo de SEO.
//
// El copy del body es provisorio y se apoya sólo en lo que el sitio ya afirma
// (Virtuoso Preferred Partner, NLA, NYCAHC, PAX, 500+ ciudades, despacho 24/7,
// precio fijo, cambios gratis hasta 24 h antes). El WebCopy v2 del cliente no
// llegó al repo: cuando llegue, reemplazar por ese copy en los 3 locales.
//
// TODO (copy/cliente): secciones "Team" y "FAQs" de la estructura sugerida
// quedaron fuera a propósito — el Excel marca como pendientes el alcance de
// Virtuoso/PHC/Muse, representantes, ferias y la política de comisión y
// facturación. Sin eso no hay FAQ que no sea inventada (y sin FAQ visible no
// va FAQPage en el schema, criterio T04).
// TODO (imágenes): provisorias reutilizadas de las service pages; pendiente shooting.

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "services.travelAdvisors.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/for-business/travel-advisors", locale),
  };
}

export default async function TravelAdvisorsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.travelAdvisors");

  const blocks: ServiceBlock[] = [
    {
      title: t("blocks.whatYouGet.title"),
      paragraphs: [t("blocks.whatYouGet.p1"), t("blocks.whatYouGet.p2")],
      image: "/images/services/transfers/maximize.webp",
      imageAlt: t("blocks.whatYouGet.imageAlt"),
      links: [{ href: "/fleet", label: t("blocks.whatYouGet.link") }],
    },
    {
      title: t("blocks.whereWeOperate.title"),
      paragraphs: [
        t("blocks.whereWeOperate.p1"),
        t("blocks.whereWeOperate.p2"),
      ],
      image: "/images/services-listing/hero.webp",
      imageAlt: t("blocks.whereWeOperate.imageAlt"),
      links: [{ href: "/about", label: t("blocks.whereWeOperate.link") }],
    },
    {
      title: t("blocks.ecosystem.title"),
      paragraphs: [t("blocks.ecosystem.p1"), t("blocks.ecosystem.p2")],
      image: "/images/services/corporate/lasting-impression.webp",
      imageAlt: t("blocks.ecosystem.imageAlt"),
      links: [{ href: "/for-business", label: t("blocks.ecosystem.link") }],
    },
    {
      title: t("blocks.hotels.title"),
      paragraphs: [t("blocks.hotels.p1")],
      image: "/images/services/airport/prompt.webp",
      imageAlt: t("blocks.hotels.imageAlt"),
      links: [
        { href: "/concierge", label: t("blocks.hotels.linkConcierge") },
        { href: "/hourly", label: t("blocks.hotels.linkHourly") },
      ],
    },
  ];

  return (
    <GsapProvider>
      <PageSchema nodes={await serviceLandingNodes(locale, "travelAdvisors")} />
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/services/transfers/hero.webp"
        />
        <ServiceBody blocks={blocks} />
        <ServiceCloser
          title={t("closer.title")}
          body={t("closer.body")}
          ctaLabel={t("closer.ctaLabel")}
          ctaHref="/contact"
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
