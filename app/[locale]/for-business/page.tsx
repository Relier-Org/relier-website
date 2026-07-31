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

// Página nueva (PDF cliente 04-jun-2026 §1, "For Business" estilo Blacklane).
// Apunta a travel agencies / corporativos / eventos. Arranca como contenido
// informativo (ayuda al posicionamiento).
// TODO (copy en HOLD por Tupac/SEO): el copy EN es DRAFT — revisar con SEO
// antes de publicar. Las traducciones es/pt de `services.forBusiness` siguen
// ese draft y hay que rehacerlas cuando se cierre. Subsecciones a confirmar
// con el cliente.
// TODO (imágenes): provisorias reutilizadas de service pages; pendiente shooting.

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "services.forBusiness.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/for-business", locale),
  };
}

export default async function ForBusinessPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.forBusiness");

  const blocks: ServiceBlock[] = [
    {
      title: t("blocks.advisors.title"),
      paragraphs: [t("blocks.advisors.p1"), t("blocks.advisors.p2")],
      image: "/images/services/transfers/hero.webp",
      imageAlt: t("blocks.advisors.imageAlt"),
    },
    {
      title: t("blocks.accounts.title"),
      paragraphs: [t("blocks.accounts.p1"), t("blocks.accounts.p2")],
      image: "/images/services/corporate/arrive-on-time.webp",
      imageAlt: t("blocks.accounts.imageAlt"),
    },
    {
      title: t("blocks.events.title"),
      paragraphs: [t("blocks.events.p1")],
      image: "/images/services/events/conferences.webp",
      imageAlt: t("blocks.events.imageAlt"),
    },
  ];

  return (
    <GsapProvider>
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/services/corporate/hero.webp"
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
