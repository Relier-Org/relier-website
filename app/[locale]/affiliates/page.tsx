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
import TrustBar from "@/components/sections/TrustBar";
import GsapProvider from "@/components/effects/GsapProvider";
import PageSchema from "@/components/seo/PageSchema";
import { affiliatesNodes } from "@/lib/seo/pages";

// Página nueva (roadmap SEO sep-2026, R04 / P0): programa de partners para
// operadores de transporte con chofer. Cuelga del hub /for-business/ en el
// breadcrumb pero vive en la raíz, que es la URL que fijó el equipo de SEO.
//
// Schema: WebPage + BreadcrumbList, NO Service (criterio T05: es un partner
// program, no un servicio que se vende). La banda de asociaciones reutiliza
// TrustBar, que ya tiene los badges reales (Virtuoso, NLA, NYCAHC, PAX).
//
// Copy provisorio apoyado en lo que el sitio ya afirma; el Excel deja como
// pendientes del cliente: casilla affiliates@relier.com (hoy el CTA va a
// /contact/), requisitos y tarifas formales, canal de dispatch, ciudades con
// operación propia y foto/cargo de Joaquín (por eso no hay bloque "Team" ni
// nodo Person). Reemplazar cuando llegue el WebCopy v2.
// TODO (imágenes): provisorias reutilizadas; pendiente shooting.

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "services.affiliates.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/affiliates", locale),
  };
}

export default async function AffiliatesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.affiliates");

  const blocks: ServiceBlock[] = [
    {
      title: t("blocks.ownOperation.title"),
      paragraphs: [t("blocks.ownOperation.p1"), t("blocks.ownOperation.p2")],
      image: "/images/services/corporate/hero.webp",
      imageAlt: t("blocks.ownOperation.imageAlt"),
      links: [{ href: "/about", label: t("blocks.ownOperation.link") }],
    },
    {
      title: t("blocks.partnershipModel.title"),
      paragraphs: [
        t("blocks.partnershipModel.p1"),
        t("blocks.partnershipModel.p2"),
      ],
      image: "/images/services/transfers/stress-free.webp",
      imageAlt: t("blocks.partnershipModel.imageAlt"),
      links: [
        { href: "/for-business", label: t("blocks.partnershipModel.link") },
      ],
    },
    {
      title: t("blocks.compliance.title"),
      paragraphs: [t("blocks.compliance.p1"), t("blocks.compliance.p2")],
      image: "/images/services/transfers/cost-certainty.webp",
      imageAlt: t("blocks.compliance.imageAlt"),
      links: [{ href: "/fleet", label: t("blocks.compliance.link") }],
    },
  ];

  return (
    <GsapProvider>
      <PageSchema nodes={await affiliatesNodes(locale)} />
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/services/hourly/hero.webp"
        />
        <ServiceBody blocks={blocks} />
        <TrustBar />
        <ServiceCloser
          title={t("closer.title")}
          body={t("closer.body")}
          ctaLabel={t("closer.ctaLabel")}
          ctaHref="mailto:info@relier.com"
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
