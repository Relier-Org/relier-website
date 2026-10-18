import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/sections/ServiceHero";
import ServiceCloser from "@/components/sections/ServiceCloser";
import TrustBar, { type TrustBadge } from "@/components/sections/TrustBar";
import Faq, { type FaqItem } from "@/components/sections/Faq";
import Button from "@/components/ui/Button";
import GsapProvider from "@/components/effects/GsapProvider";
import PageSchema from "@/components/seo/PageSchema";
import { Band, CoverageBand, Head, Highlights, IconColumns, PhotoCards, Steps } from "@/components/landing/Landing";
import Testimonials from "@/components/sections/Testimonials";
import { CalendarIcon } from "@/components/icons/PillarIcons";
import { BusIcon, CarIcon, RouteIcon } from "@/components/icons/SegmentIcons";
import { items, landingMetadata, strings } from "@/components/landing/landingPage";
import { landingNodes } from "@/lib/seo/pages";

// Landing de SEO (oct-2026, relier_travel_advisors_seo_final.html). URL nueva
// en la raíz, como pide su canonical; /for-business/travel-advisors redirige
// acá (next.config.mjs). La FAQ de comisiones usa el texto del cliente, no el
// del borrador. Contacto: reservations@ (lista oficial del cliente).
const EMAIL = "mailto:reservations@relier.com";

const TRADE_EVENTS: TrustBadge[] = [
  { name: "ILTM", src: "/images/partners/events/iltm.png" },
  { name: "M&I Forums", src: "/images/partners/events/mi.png" },
  { name: "IMEX", src: "/images/partners/events/imex.png" },
  { name: "Virtuoso On Tour", src: "/images/partners/events/virtuoso-on-tour.png" },
  {
    name: "Virtuoso Travel Week",
    src: "/images/partners/events/virtuoso-travel-week.png",
    // Logo apilado con texto chico: a la altura de los wordmarks no se lee.
    modifier: "logoSeal",
  },
];

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return landingMetadata(locale, "travelAdvisors");
}

export default async function TravelAdvisorsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landings.travelAdvisors");
  const c = await getTranslations("landings.common");

  return (
    <GsapProvider>
      <PageSchema nodes={await landingNodes(locale, "travelAdvisors")} />
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/services/transfers/hero.webp"
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
              "/images/services/airport/no-waiting.webp",
              "/images/services/hourly/hero.webp",
              "/images/services/transfers/stress-free.webp",
            ]}
          />
        </Band>

        <Band tone="light">
          <Head eyebrow={t("built.eyebrow")} title={t("built.title")} lead={t("built.lead")} />
          <Steps items={items(t.raw("built.items"))} />
        </Band>

        <Band>
          <Head eyebrow={t("recognition.eyebrow")} title={t("recognition.title")} lead={t("recognition.lead")} />
        </Band>
        <TrustBar
          label={t("recognition.eventsLabel")}
          badges={TRADE_EVENTS}
          note={t("recognition.eventsNote")}
        />

        <Band tone="light">
          <Head eyebrow={t("range.eyebrow")} title={t("range.title")} />
          <IconColumns
            items={items(t.raw("range.items"))}
            icons={[CarIcon, CalendarIcon, RouteIcon, BusIcon]}
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
        {/* Reseñas de Google del home: prueba social sin copy nuevo. */}
        <Testimonials reviewPillMode="none" />

        <Faq eyebrow={c("faqEyebrow")} title={c("faqTitle")} items={t.raw("faq") as FaqItem[]} />
        <ServiceCloser
          title={t("closer.title")}
          body={t("closer.body")}
          ctaLabel={c("contactRelier")}
          ctaHref={EMAIL}
          note={`${c("advisorPrompt")} ${c("advisorLink")}`}
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
