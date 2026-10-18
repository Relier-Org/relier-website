import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/sections/ServiceHero";
import ServiceCloser from "@/components/sections/ServiceCloser";
import Faq, { type FaqItem } from "@/components/sections/Faq";
import Button from "@/components/ui/Button";
import GsapProvider from "@/components/effects/GsapProvider";
import PageSchema from "@/components/seo/PageSchema";
import TrustBar from "@/components/sections/TrustBar";
import Testimonials from "@/components/sections/Testimonials";
import {
  Band,
  CoverageBand,
  Head,
  Highlights,
  NameList,
  PhotoCards,
  Split,
  Steps,
} from "@/components/landing/Landing";
import { items, landingMetadata, strings } from "@/components/landing/landingPage";
import { landingNodes } from "@/lib/seo/pages";
import styles from "./page.module.css";

// Landing de SEO (oct-2026, relier_events_seo_final.html), con el feedback del
// cliente ya incorporado en el copy. Contacto: events@ (doc del cliente).
const EMAIL = "mailto:events@relier.com";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return landingMetadata(locale, "events");
}

export default async function EventsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landings.events");
  const c = await getTranslations("landings.common");

  return (
    <GsapProvider>
      <PageSchema nodes={await landingNodes(locale, "events")} />
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/services/events/hero.webp"
          className={styles.hero}
          actions={
            <>
              <Button href={EMAIL} withArrow>{c("talk")}</Button>
              <Button href="#why" variant="secondary">{c("why")}</Button>
            </>
          }
        />
        <Highlights items={strings(t.raw("highlights.items"))} tagline={t("highlights.tagline")} />
        <TrustBar />

        <Band id="why">
          <Head eyebrow={t("services.eyebrow")} title={t("services.title")} lead={t("services.lead")} />
          <PhotoCards
            items={items(t.raw("services.items"))}
            images={[
              "/images/events-nyc/door-press.webp",
              "/images/services/events/entertainment.webp",
              "/images/services/events/conferences.webp",
            ]}
          />
        </Band>

        <Band tone="light">
          <Head eyebrow={t("experience.eyebrow")} title={t("experience.title")} lead={t("experience.lead")} />
          <NameList
            names={strings(t.raw("experience.names"))}
            more={strings(t.raw("experience.more_names"))}
            label={t("experience.title")}
            note={t("experience.note")}
            link={
              <Button href="/signature-events" variant="secondary" tone="light">
                {t("experience.link")}
              </Button>
            }
          />
        </Band>

        <Band>
          <Split
            image="/images/events-nyc/chauffeur-curbside.webp"
            eyebrow={t("how.eyebrow")}
            title={t("how.title")}
            lead={t("how.lead")}
            items={items(t.raw("how.items"))}
          />
        </Band>

        <Band tone="light">
          <Head eyebrow={t("steps.eyebrow")} title={t("steps.title")} />
          <Steps items={items(t.raw("steps.items"))} note={t("steps.note")} />
        </Band>

        <CoverageBand
          eyebrow={t("coverage.eyebrow")}
          title={t("coverage.title")}
          lead={t("coverage.lead")}
          badges={strings(t.raw("coverage.badges"))}
          hubLabels={[c("hubNy"), c("hubBcn")]}
        />
        {/* Reseñas de Google del home: prueba social sin copy nuevo. */}
        <Testimonials reviewPillMode="none" />

        <Faq
          eyebrow={c("faqEyebrow")}
          title={c("faqTitle")}
          items={t.raw("faq") as FaqItem[]}
        />
        <ServiceCloser
          title={t("closer.title")}
          body={t("closer.body")}
          ctaLabel={c("contactRelier")}
          ctaHref={EMAIL}
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
