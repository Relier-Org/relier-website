import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/sections/ServiceHero";
import ServiceCloser from "@/components/sections/ServiceCloser";
import Faq, { type FaqItem } from "@/components/sections/Faq";
import Button from "@/components/ui/Button";
import GsapProvider from "@/components/effects/GsapProvider";
import PageSchema from "@/components/seo/PageSchema";
import { Band, CoverageBand, Head, Highlights, IconColumns, PhotoCards, Split, Steps } from "@/components/landing/Landing";
import Testimonials from "@/components/sections/Testimonials";
import { CalendarIcon, GlobeIcon, ShieldTickIcon } from "@/components/icons/PillarIcons";
import { CarIcon, RouteIcon } from "@/components/icons/SegmentIcons";
import { PassengerIcon } from "@/components/icons/FleetIcons";
import { items, landingMetadata, strings } from "@/components/landing/landingPage";
import LandingForm from "@/components/landing/LandingForm";
import { landingNodes } from "@/lib/seo/pages";
import styles from "./page.module.css";

// Landing de SEO (oct-2026, relier_corporate_seo_final.html). Contacto:
// reservations@ (agencias y clientes directos, doc del cliente).
const EMAIL = "mailto:reservations@relier.com";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return landingMetadata(locale, "corporate");
}

export default async function CorporatePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landings.corporate");
  const c = await getTranslations("landings.common");

  return (
    <GsapProvider>
      <PageSchema nodes={await landingNodes(locale, "corporate")} />
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/services/corporate/hero.webp"
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
          segment="corporate"
          eyebrow={t("form.eyebrow")}
          title={t("form.title")}
          lead={t("form.lead")}
          messagePlaceholder={t("form.placeholder")}
          companyLabel={c("formCompany")}
          directLabel={c("formDirect")}
          directEmail="reservations@relier.com"
        />
        <Highlights items={strings(t.raw("highlights.items"))} icons={[CarIcon, PassengerIcon, RouteIcon, CalendarIcon]} />

        <Band id="why">
          <Head eyebrow={t("services.eyebrow")} title={t("services.title")} lead={t("services.lead")} />
          <PhotoCards
            items={items(t.raw("services.items"))}
            images={[
              "/images/services/corporate/work-relax.webp",
              "/images/home/corporate.webp",
              "/images/services/airport/prompt.webp",
              "/images/services/events/conferences.webp",
            ]}
          />
        </Band>

        <Band tone="light">
          <Head eyebrow={t("program.eyebrow")} title={t("program.title")} lead={t("program.lead")} />
          <Steps items={items(t.raw("program.items"))} />
        </Band>

        <Band>
          <Split
            image="/images/services/transfers/maximize.webp"
            reverse
            eyebrow={t("uses.eyebrow")}
            title={t("uses.title")}
            items={items(t.raw("uses.items"))}
          />
        </Band>

        <Band tone="light">
          <Head eyebrow={t("built.eyebrow")} title={t("built.title")} center />
          <IconColumns
            items={items(t.raw("built.items"))}
            carouselLabel={t("built.title")}
            icons={[GlobeIcon, PassengerIcon, RouteIcon, ShieldTickIcon]}
          />
        </Band>

        <Band>
          <Head eyebrow={t("steps.eyebrow")} title={t("steps.title")} />
          <Steps items={items(t.raw("steps.items"))} />
        </Band>

        <CoverageBand
          eyebrow={t("coverage.eyebrow")}
          title={t("coverage.title")}
          lead={t("coverage.lead")}
          badges={strings(t.raw("coverage.badges"))}
          hubLabels={[c("hubNy"), c("hubBcn")]}
        />

        <Faq eyebrow={c("faqEyebrow")} title={c("faqTitle")} items={t.raw("faq") as FaqItem[]} />
        {/* Reseñas de Google del home: prueba social sin copy nuevo. */}
        <Testimonials reviewPillMode="none" />
        <ServiceCloser
          title={t("closer.title")}
          body={t("closer.body")}
          ctaLabel={c("contactRelier")}
          ctaHref={EMAIL}
          secondaryHref="/for-business"
          secondaryLabel={t("hero.eyebrow").split(" · ")[0]}
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
