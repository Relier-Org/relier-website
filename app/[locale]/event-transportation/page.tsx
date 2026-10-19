import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/sections/ServiceHero";
import ServiceCloser from "@/components/sections/ServiceCloser";
import Faq, { type FaqItem } from "@/components/sections/Faq";
import Button from "@/components/ui/Button";
import GsapProvider from "@/components/effects/GsapProvider";
import PageSchema from "@/components/seo/PageSchema";
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
  TouringBand,
  type Venue,
} from "@/components/landing/Landing";
import { items, landingMetadata, strings } from "@/components/landing/landingPage";
import { CalendarIcon, GlobeIcon } from "@/components/icons/PillarIcons";
import { PassengerIcon } from "@/components/icons/FleetIcons";
import { PhoneIcon } from "@/components/icons/ContactIcons";
import LandingForm from "@/components/landing/LandingForm";
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
              <Button href="#contact-form" withArrow>{c("talk")}</Button>
              <Button href="#why" variant="secondary">{c("why")}</Button>
            </>
          }
        />
        {/* Formulario al principio (checklist de cierre, oct-2026): llega al
            departamento de la landing con la sección marcada en el asunto. */}
        <LandingForm
          segment="events"
          eyebrow={t("form.eyebrow")}
          title={t("form.title")}
          lead={t("form.lead")}
          messagePlaceholder={t("form.placeholder")}
          companyLabel={c("formCompany")}
          directLabel={c("formDirect")}
          directEmail="events@relier.com"
        />
        <Highlights items={strings(t.raw("highlights.items"))} icons={[CalendarIcon, PassengerIcon, PhoneIcon, GlobeIcon]} />

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

        {/* "Event & Touring Experts" (Andy, checklist oct-2026): giras con la
            flota grande y las operaciones confirmadas en Nueva York. */}
        <TouringBand
          eyebrow={t("touring.eyebrow")}
          title={t("touring.title")}
          lead={t("touring.lead")}
          vehicles={(t.raw("touring.vehicles") as { name: string; pax: string }[]).map((v, i) => ({
            ...v,
            image: ["/images/fleet/motorcoach.webp", "/images/fleet/minibus-v2.webp", "/images/fleet/sprinter.webp"][i],
          }))}
          venuesTitle={t("touring.venuesTitle")}
          venues={t.raw("touring.venues") as Venue[]}
        />

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

        <Faq
          eyebrow={c("faqEyebrow")}
          title={c("faqTitle")}
          items={t.raw("faq") as FaqItem[]}
        />
        {/* Reseñas de Google del home: prueba social sin copy nuevo. */}
        <Testimonials reviewPillMode="none" />
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
