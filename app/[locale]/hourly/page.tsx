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

// Página nueva para la categoría "By the Hour" (PDF cliente 04-jun §3). El
// booking widget ya ofrece el modo Hourly; esto le da destino propio a la card
// de servicios (antes compartía /corporate).
// TODO (copy en HOLD por Tupac/SEO): draft — revisar antes de publicar. Las
// traducciones es/pt de `services.hourly` siguen el draft y hay que rehacerlas
// cuando el copy EN se cierre.
// TODO (imágenes): provisorias reutilizadas; pendiente shooting.

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "services.hourly.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/hourly", locale),
  };
}

export default async function HourlyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.hourly");

  const blocks: ServiceBlock[] = [
    {
      title: t("blocks.schedule.title"),
      paragraphs: [t("blocks.schedule.p1")],
      image: "/images/services/transfers/maximize.webp",
      imageAlt: t("blocks.schedule.imageAlt"),
      links: [{ href: "/corporate", label: t("links.corporate") }],
    },
    {
      title: t("blocks.freedom.title"),
      paragraphs: [t("blocks.freedom.p1")],
      image: "/images/services/corporate/work-relax.webp",
      imageAlt: t("blocks.freedom.imageAlt"),
      links: [{ href: "/concierge", label: t("links.concierge") }],
    },
  ];

  return (
    <GsapProvider>
      <PageSchema nodes={await serviceLandingNodes(locale, "hourly")} />
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/services/hourly/hero.webp"
        />
        <ServiceBody blocks={blocks} />
        <ServiceCloser title={t("closer.title")} body={t("closer.body")} />
      </main>
      <Footer />
    </GsapProvider>
  );
}
