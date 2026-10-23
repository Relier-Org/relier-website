import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/i18n/seo";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/sections/ServiceHero";
import ServiceCloser from "@/components/sections/ServiceCloser";
import Faq, { type FaqItem } from "@/components/sections/Faq";
import FleetGrid, { type FleetVehicle } from "@/components/sections/FleetGrid";
import RelatedLinks from "@/components/sections/RelatedLinks";
import Testimonials from "@/components/sections/Testimonials";
import Image from "next/image";
import ReservationWidget from "@/components/ReservationWidget";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import TextCTA from "@/components/ui/TextCTA";
import GsapProvider from "@/components/effects/GsapProvider";
import PageSchema from "@/components/seo/PageSchema";
import {
  AirportBoard,
  AreaColumns,
  Band,
  Cards,
  Head,
  Highlights,
  Split,
  Stats,
  Steps,
  type Airport,
  type Region,
  type Stat,
} from "@/components/landing/Landing";
import { items, strings } from "@/components/landing/landingPage";
import { ShieldTickIcon, CalendarIcon, GlobeIcon } from "@/components/icons/PillarIcons";
import { PhoneIcon } from "@/components/icons/ContactIcons";
import { BusIcon, CarIcon, RouteIcon } from "@/components/icons/SegmentIcons";
import { TESTIMONIALS } from "@/lib/testimonials/data";
import { LEGAL_ENTITY } from "@/lib/legal/entity";
import { faqPageNode, serviceLandingNodes } from "@/lib/seo/pages";
import styles from "./page.module.css";

// Landing de Airports (Andy, oct-2026): estructura y copy de
// 20261014_Relier_Airport_Landing_v3.html (referencias: ridelux.com y
// blacklane.com), armada con los bloques del sitio (components/landing) y no
// con los estilos del HTML. El cotizador va arriba, debajo del hero.
//
// Fuera de la v3 a propósito: los links a subpáginas por aeropuerto (JFK/LGA/
// EWR car service), que todavía no existen. "Since 2012" sí entra: lo dice el
// footer del sitio.
//
// Fotos: las que indica la v3 (paquete del 22-oct-2026), que son las de la
// página anterior: hero.webp en el hero y no-waiting.webp en la espera. Los alt
// de la v3 no describían estas fotos; los de messages sí.

type PageProps = { params: Promise<{ locale: string }> };

const PHONE_HREF = `tel:+${LEGAL_ENTITY.phone.replace(/\D/g, "")}`;

// Reseñas que hablan del aeropuerto o de la puntualidad, de las verificadas.
const AIRPORT_REVIEWS = ["Sebastián J. Peralta", "Marquitos L.", "Fabri P."];

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "services.airport.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/airport", locale),
  };
}

export default async function AirportPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.airport");
  const tf = await getTranslations("fleet");

  const faq = t.raw("faq.items") as FaqItem[];

  // Misma flota que /fleet, en el orden de la v3 (por pasajeros y valijas).
  const fleet: FleetVehicle[] = [
    {
      tier: tf("vehicles.sedan.tier"),
      label: tf("vehicles.sedan.label"),
      name: "Cadillac Lyriq",
      image: "/images/fleet/lyriq.webp",
      passengers: 2,
      bags: 2,
      orSimilar: true,
    },
    {
      tier: tf("vehicles.sClass.tier"),
      label: `${tf("vehicles.sClass.tier")} · ${tf("vehicles.sClass.label")}`,
      name: "Mercedes-Benz S-Class",
      image: "/images/fleet/s-class.webp",
      passengers: 2,
      bags: 2,
      orSimilar: true,
    },
    {
      tier: tf("vehicles.suv.tier"),
      label: tf("vehicles.suv.label"),
      name: "Cadillac Escalade",
      image: "/images/fleet/escalade.webp",
      passengers: 5,
      bags: 6,
      orSimilar: true,
    },
    {
      tier: tf("vehicles.van.tier"),
      label: tf("vehicles.van.label"),
      name: "Mercedes-Benz Sprinter",
      image: "/images/fleet/sprinter.webp",
      passengers: 13,
      bags: 10,
      orSimilar: true,
    },
  ];

  const beyond = t.raw("beyond.items") as {
    id: string;
    title: string;
    body: string;
    cta: string;
  }[];
  const beyondLinks: Record<string, { href: string; icon: typeof CarIcon }> = {
    hotel: { href: "/airport-to-hotel-transportation", icon: CarIcon },
    corporate: { href: "/corporate-transportation", icon: BusIcon },
    advisors: { href: "/travel-advisors", icon: RouteIcon },
    europe: { href: "https://relier.es", icon: GlobeIcon },
  };

  return (
    <GsapProvider>
      <PageSchema
        nodes={[
          ...(await serviceLandingNodes(locale, "airport")),
          faqPageNode(locale, "/airport", faq),
        ]}
      />
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/services/airport/hero.webp"
          imageAlt={t("hero.imageAlt")}
          actions={
            <>
              <Button href="#booking" withArrow>
                {t("hero.ctaPrice")}
              </Button>
              <Button href={PHONE_HREF} variant="secondary">
                {t("hero.ctaCall")}
              </Button>
            </>
          }
        />

        {/* El cotizador al principio (checklist de cierre, oct-2026): el mismo
            embed de /online-reservation. */}
        <section className={styles.booking} id="booking">
          <div className="container">
            <Head
              eyebrow={t("booking.eyebrow")}
              title={t("booking.title")}
              lead={t("booking.lead")}
            />
            <ReservationWidget configId="13" />
            <p className={styles.contact}>
              {t.rich("booking.contact", {
                phone: (c) => <a href={PHONE_HREF}>{c}</a>,
                mail: (c) => <a href={`mailto:${LEGAL_ENTITY.contactEmail}`}>{c}</a>,
              })}
            </p>
          </div>
        </section>

        <Highlights
          items={strings(t.raw("highlights"))}
          icons={[ShieldTickIcon, CalendarIcon, CarIcon, PhoneIcon]}
        />

        <Band>
          <Stats items={t.raw("trust") as Stat[]} />
        </Band>

        <Band id="airports">
          <Head
            eyebrow={t("airports.eyebrow")}
            title={t("airports.title")}
            lead={t("airports.lead")}
          />
          <AirportBoard
            main={t.raw("airports.main") as Airport[]}
            regional={t.raw("airports.regional") as Airport[]}
            regionalTitle={t("airports.regionalTitle")}
            distanceLabel={t("airports.distanceLabel")}
            timeLabel={t("airports.timeLabel")}
          />
          <Reveal className={styles.after}>
            <p className={styles.note}>{t("airports.note")}</p>
            <Button href="#booking" variant="secondary">
              {t("airports.cta")}
            </Button>
          </Reveal>
        </Band>

        <Band tone="light" id="how">
          <Head eyebrow={t("how.eyebrow")} title={t("how.title")} lead={t("how.lead")} />
          <Steps items={items(t.raw("how.steps"))} columns={4} rail />
        </Band>

        {/* Foto de Nueva York. El reel de recogida en aeropuerto que hay en el
            IG está filmado en Ezeiza y no puede ir en "New York pickups"
            (Nico, 23-oct-2026); cuando llegue un video de aeropuerto de NY,
            va con la prop `video` de Split. */}
        <Band>
          <Split
            image="/images/services/airport/no-waiting.webp"
            imageAlt={t("wait.imageAlt")}
            eyebrow={t("wait.eyebrow")}
            title={t("wait.title")}
            lead={t("wait.lead")}
            items={items(t.raw("wait.items"))}
          />
        </Band>

        <Band tone="light">
          <Head
            eyebrow={t("included.eyebrow")}
            title={t("included.title")}
            lead={t("included.lead")}
          />
          {/* Cifras en 2×2 con una foto al lado: la sección era sólo texto.
              Choferes esperando junto a la flota, la que la v3 asignaba acá. */}
          <div className={styles.included}>
            <Stats
              columns={2}
              rail
              items={(t.raw("included.items") as (Stat & { title: string })[]).map(
                (it) => ({ value: it.value, label: it.title, body: it.body })
              )}
            />
            <Reveal className={styles.includedPhoto}>
              <Image
                src="/images/services/airport/prompt.webp"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </Reveal>
          </div>
        </Band>

        <FleetGrid
          title={t("fleet.title")}
          lead={t("fleet.lead")}
          vehicles={fleet}
          id="fleet"
          gridClassName={`${styles.fleetRow} mobileRail`}
          footer={
            <Button href="/fleet" variant="secondary">
              {t("fleet.link")}
            </Button>
          }
        />

        <Band id="routes">
          <Head eyebrow={t("routes.eyebrow")} title={t("routes.title")} lead={t("routes.lead")} />
          <Cards items={items(t.raw("routes.items"))} columns={3} rail />
          {/* Hub → child del roadmap SEO (sep-2026): este link venía de la
              página anterior y no se pierde. */}
          <div className={styles.after}>
            <TextCTA href="/luxury-airport-transfers-to-jfk-why-choose-relier-for-your-brooklyn-travels">
              {t("routes.jfkLink")}
            </TextCTA>
          </div>
        </Band>

        <Band tone="light" id="areas">
          <Head eyebrow={t("areas.eyebrow")} title={t("areas.title")} lead={t("areas.lead")} />
          <AreaColumns regions={t.raw("areas.regions") as Region[]} />
        </Band>

        <Testimonials
          testimonials={TESTIMONIALS.filter((r) => AIRPORT_REVIEWS.includes(r.name))}
          reviewPillMode="none"
        />

        <RelatedLinks
          gridClassName="mobileRail"
          eyebrow={t("beyond.eyebrow")}
          title={t("beyond.title")}
          items={beyond
            .filter((b) => beyondLinks[b.id])
            .map((b) => ({ ...b, ...beyondLinks[b.id] }))}
        />

        <Faq eyebrow={t("faq.eyebrow")} title={t("faq.title")} items={faq} />

        <ServiceCloser
          title={t("closer.title")}
          body={t("closer.body")}
          ctaLabel={t("closer.cta")}
          ctaHref="#booking"
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
