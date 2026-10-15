import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/i18n/seo";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/sections/ServiceHero";
import SegmentCards, {
  type SegmentCard,
} from "@/components/sections/SegmentCards";
import TrustBar from "@/components/sections/TrustBar";
import ServicesIntro from "@/components/sections/ServicesIntro";
import Reveal from "@/components/effects/Reveal";
import ServiceCloser from "@/components/sections/ServiceCloser";
import GsapProvider from "@/components/effects/GsapProvider";
import PageSchema from "@/components/seo/PageSchema";
import { forBusinessHubNodes } from "@/lib/seo/pages";
import { B2B_SEGMENTS } from "@/lib/b2b/segments";
import styles from "./page.module.css";

// Hub B2B (PDF cliente 04-jun-2026 §1; reconvertido en hub de 4 segmentos por
// el roadmap SEO de sep-2026, R05): Travel Advisors, Corporate Accounts,
// Events & Productions y Affiliates, con proof strip y CTA. Corporate y Events
// enlazan a /corporate/ y /events/ (URLs que ya rankean); los otros dos son
// páginas nuevas. Schema CollectionPage + ItemList de los 4 (criterio T03).
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

  const items: SegmentCard[] = B2B_SEGMENTS.map((s) => ({
    id: s.id,
    href: s.href,
    title: t(`segments.${s.id}.title`),
    body: t(`segments.${s.id}.body`),
    cta: t(`segments.${s.id}.cta`),
    image: s.image,
    imageAlt: t(`segments.${s.id}.imageAlt`),
  }));

  return (
    <GsapProvider>
      <PageSchema nodes={await forBusinessHubNodes(locale)} />
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/events-nyc/suv-arrival.webp"
          className={styles.hero}
        />
        {/* Misma gramática que /services: franja crema con "Why Relier" y
            después la grilla con su propio encabezado (pedido de Nico,
            oct-2026: cuatro cards solas, sin título ni texto, se leían raro). */}
        <ServicesIntro namespace="services.forBusiness.intro" />
        <section className={styles.segments}>
          <div className="container">
            <Reveal className={styles.head}>
              <p className={styles.eyebrow}>
                <span className={styles.dot} aria-hidden="true" />
                {t("segmentsHead.eyebrow")}
              </p>
              <h2 className={styles.title}>{t("segmentsHead.title")}</h2>
            </Reveal>
            <SegmentCards items={items} className={styles.grid} />
          </div>
        </section>
        <TrustBar />
        <ServiceCloser
          title={t("closer.title")}
          body={t("closer.body")}
          ctaLabel={t("closer.ctaLabel")}
          ctaHref="mailto:reservations@relier.com"
          note={t("closer.agentNote")}
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
