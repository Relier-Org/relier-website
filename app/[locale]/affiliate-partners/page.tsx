import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/sections/ServiceHero";
import ServiceCloser from "@/components/sections/ServiceCloser";
import Faq, { type FaqItem } from "@/components/sections/Faq";
import Button from "@/components/ui/Button";
import TextCTA from "@/components/ui/TextCTA";
import GsapProvider from "@/components/effects/GsapProvider";
import PageSchema from "@/components/seo/PageSchema";
import { Band, CoverageBand, Head, Highlights, IconColumns, PhotoCards, Split, Steps } from "@/components/landing/Landing";
import { ShieldTickIcon } from "@/components/icons/PillarIcons";
import { PassengerIcon } from "@/components/icons/FleetIcons";
import { LocationIcon, PhoneIcon } from "@/components/icons/ContactIcons";
import { items, landingMetadata, strings } from "@/components/landing/landingPage";
import { BusIcon } from "@/components/icons/SegmentIcons";
import LandingForm from "@/components/landing/LandingForm";
import { landingNodes } from "@/lib/seo/pages";

// Landing de SEO (oct-2026, relier_affiliates_seo_final.html): vende a Relier
// como afiliado en Nueva York y España (pedido del cliente). Contacto: info@.
const EMAIL = "mailto:info@relier.com";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return landingMetadata(locale, "affiliates");
}

export default async function AffiliatesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landings.affiliates");
  const c = await getTranslations("landings.common");

  return (
    <GsapProvider>
      <PageSchema nodes={await landingNodes(locale, "affiliates")} />
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/events-nyc/fleet-line.webp"
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
          segment="affiliates"
          eyebrow={t("form.eyebrow")}
          title={t("form.title")}
          lead={t("form.lead")}
          messagePlaceholder={t("form.placeholder")}
          companyLabel={c("formCompany")}
          directLabel={c("formDirect")}
          directEmail="info@relier.com"
        />
        <Highlights items={strings(t.raw("highlights.items"))} icons={[LocationIcon, PhoneIcon, ShieldTickIcon, BusIcon]} />

        <Band id="why">
          <Head eyebrow={t("markets.eyebrow")} title={t("markets.title")} lead={t("markets.lead")} />
          <PhotoCards
            items={items(t.raw("markets.items"))}
            images={[
              "/images/events-nyc/suv-arrival.webp",
              "/images/home/vehicle.webp",
              "/images/services/airport/luxury.webp",
            ]}
          />
        </Band>

        <Band tone="light">
          <Head eyebrow={t("why.eyebrow")} title={t("why.title")} />
          <Steps items={items(t.raw("why.items"))} />
        </Band>

        <Band>
          {/* Experiencia en eventos grandes (pedido del cliente): link al
              dossier de eventos. */}
          <Split
            image="/images/events-nyc/chauffeur-press.webp"
            eyebrow={t("get.eyebrow")}
            title={t("get.title")}
            lead={t("get.lead")}
            items={items(t.raw("get.items"))}
            footer={
              <TextCTA href="/signature-events">
                {items(t.raw("get.items"))[4].title}
              </TextCTA>
            }
          />
        </Band>

        <Band tone="light">
          <Head eyebrow={t("standard.eyebrow")} title={t("standard.title")} lead={t("standard.lead")} center />
          <IconColumns
            items={items(t.raw("standard.items"))}
            carouselLabel={t("standard.title")}
            icons={[PhoneIcon, ShieldTickIcon, PassengerIcon, LocationIcon]}
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
