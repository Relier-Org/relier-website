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

type PageProps = { params: Promise<{ locale: string }> };

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

  const blocks: ServiceBlock[] = [
    {
      title: t("blocks.prompt.title"),
      paragraphs: [t("blocks.prompt.p1")],
      image: "/images/services/airport/prompt.webp",
      imageAlt: t("blocks.prompt.imageAlt"),
      // Hub → child (roadmap SEO sep-2026): el post airport-to-hotel es el
      // activo con más impresiones del cluster (23k) y no recibía links.
      links: [
        {
          href: "/airport-to-hotel-transportation",
          label: t("links.airportToHotel"),
        },
      ],
    },
    {
      title: t("blocks.noWaiting.title"),
      paragraphs: [t("blocks.noWaiting.p1")],
      image: "/images/services/airport/no-waiting.webp",
      imageAlt: t("blocks.noWaiting.imageAlt"),
      links: [
        {
          href: "/luxury-airport-transfers-to-jfk-why-choose-relier-for-your-brooklyn-travels",
          label: t("links.jfk"),
        },
      ],
    },
    {
      title: t("blocks.luxury.title"),
      paragraphs: [t("blocks.luxury.p1")],
      image: "/images/services/airport/luxury.webp",
      imageAlt: t("blocks.luxury.imageAlt"),
    },
  ];

  return (
    <GsapProvider>
      <PageSchema nodes={await serviceLandingNodes(locale, "airport")} />
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/services/airport/hero.webp"
        />
        <ServiceBody blocks={blocks} />
        <ServiceCloser title={t("closer.title")} body={t("closer.body")} />
      </main>
      <Footer />
    </GsapProvider>
  );
}
