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

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wc.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/fifa-world-cup-2026-private-transportation", locale),
  };
}

export default async function WorldCupPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("wc");

  const blocks: ServiceBlock[] = [
    {
      title: t("blocks.ground.title"),
      paragraphs: [t("blocks.ground.p1")],
      image: "/images/services/world-cup/ground-transport.webp",
      imageAlt: t("blocks.ground.imageAlt"),
    },
    {
      title: t("blocks.hostCities.title"),
      paragraphs: [t("blocks.hostCities.p1"), t("blocks.hostCities.p2")],
      image: "/images/services/world-cup/host-cities.webp",
      imageAlt: t("blocks.hostCities.imageAlt"),
    },
    {
      title: t("blocks.whyChoose.title"),
      paragraphs: [t("blocks.whyChoose.p1")],
      image: "/images/services/world-cup/why-choose.webp",
      imageAlt: t("blocks.whyChoose.imageAlt"),
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
          image="/images/services/world-cup/hero.webp"
        />
        <ServiceBody blocks={blocks} />
        <ServiceCloser title={t("closer.title")} body={t("closer.body")} />
      </main>
      <Footer />
    </GsapProvider>
  );
}
