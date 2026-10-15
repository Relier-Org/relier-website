import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/i18n/seo";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/sections/ServiceHero";
import ServiceBody, {
  type ServiceBlock,
} from "@/components/sections/ServiceBody";
import TrustBar, { type TrustBadge } from "@/components/sections/TrustBar";
import Faq, { type FaqItem } from "@/components/sections/Faq";
import { pageUrl } from "@/lib/seo/schema";
import ServiceCloser from "@/components/sections/ServiceCloser";
import GsapProvider from "@/components/effects/GsapProvider";
import PageSchema from "@/components/seo/PageSchema";
import { serviceLandingNodes } from "@/lib/seo/pages";

// Página nueva (roadmap SEO sep-2026, R01 / P0): landing dedicada al travel
// trade, hija del hub /for-business/. Title, H1, meta, estructura y anchors
// salen de la hoja "SEO Specs" del Excel del equipo de SEO.
//
// El copy del body es provisorio y se apoya sólo en lo que el sitio ya afirma
// (Virtuoso Preferred Partner, NLA, NYCAHC, PAX, 500+ ciudades, despacho 24/7,
// precio fijo, cambios gratis hasta 24 h antes). El WebCopy v2 del cliente no
// llegó al repo: cuando llegue, reemplazar por ese copy en los 3 locales.
//
// FAQ (doc del cliente, oct-2026): la de comisiones es texto del cliente; las
// otras tres salen de lo que ya dice esta página. Sigue pendiente "Team".
// TODO (imágenes): provisorias reutilizadas de las service pages; pendiente shooting.

const FAQ_KEYS = ["commissions", "account", "updates", "where"] as const;

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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "services.travelAdvisors.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/for-business/travel-advisors", locale),
  };
}

export default async function TravelAdvisorsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.travelAdvisors");

  const faq: FaqItem[] = FAQ_KEYS.map((k) => ({
    q: t(`faq.items.${k}.q`),
    a: t(`faq.items.${k}.a`),
  }));

  const blocks: ServiceBlock[] = [
    {
      title: t("blocks.whatYouGet.title"),
      paragraphs: [t("blocks.whatYouGet.p1"), t("blocks.whatYouGet.p2")],
      image: "/images/services/transfers/maximize.webp",
      imageAlt: t("blocks.whatYouGet.imageAlt"),
      links: [{ href: "/fleet", label: t("blocks.whatYouGet.link") }],
    },
    {
      title: t("blocks.whereWeOperate.title"),
      paragraphs: [
        t("blocks.whereWeOperate.p1"),
        t("blocks.whereWeOperate.p2"),
      ],
      image: "/images/services-listing/hero.webp",
      imageAlt: t("blocks.whereWeOperate.imageAlt"),
      links: [{ href: "/about", label: t("blocks.whereWeOperate.link") }],
    },
    {
      title: t("blocks.ecosystem.title"),
      paragraphs: [t("blocks.ecosystem.p1"), t("blocks.ecosystem.p2")],
      image: "/images/services/corporate/lasting-impression.webp",
      imageAlt: t("blocks.ecosystem.imageAlt"),
      links: [{ href: "/for-business", label: t("blocks.ecosystem.link") }],
    },
    {
      title: t("blocks.hotels.title"),
      paragraphs: [t("blocks.hotels.p1")],
      image: "/images/services/airport/prompt.webp",
      imageAlt: t("blocks.hotels.imageAlt"),
      links: [
        { href: "/concierge", label: t("blocks.hotels.linkConcierge") },
        { href: "/hourly", label: t("blocks.hotels.linkHourly") },
      ],
    },
  ];

  return (
    <GsapProvider>
      <PageSchema
        nodes={[
          ...(await serviceLandingNodes(locale, "travelAdvisors")),
          {
            "@type": "FAQPage",
            "@id": `${pageUrl(locale, "/for-business/travel-advisors")}#faq`,
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/services/transfers/hero.webp"
        />
        <ServiceBody blocks={blocks} />
        {/* Ferias de la industria (doc del cliente, oct-2026): logos en blanco
            sacados del doc, sin link porque no los mandaron. */}
        <TrustBar
          label={t("events.label")}
          badges={TRADE_EVENTS}
          note={t("events.note")}
        />
        <Faq
          eyebrow={t("faq.eyebrow")}
          title={t("faq.title")}
          items={faq}
        />
        <ServiceCloser
          title={t("closer.title")}
          body={t("closer.body")}
          ctaLabel={t("closer.ctaLabel")}
          ctaHref="mailto:reservations@relier.com"
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
