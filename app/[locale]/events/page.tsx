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
  const t = await getTranslations({
    locale,
    namespace: "services.events.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/events", locale),
  };
}

export default async function EventsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.events");

  const blocks: ServiceBlock[] = [
    {
      title: t("blocks.entertainment.title"),
      paragraphs: [t("blocks.entertainment.p1")],
      image: "/images/services/events/entertainment.webp",
      imageAlt: t("blocks.entertainment.imageAlt"),
    },
    {
      title: t("blocks.corporate.title"),
      paragraphs: [t("blocks.corporate.p1")],
      image: "/images/services/events/corporate.webp",
      imageAlt: t("blocks.corporate.imageAlt"),
    },
    {
      title: t("blocks.sports.title"),
      paragraphs: [t("blocks.sports.p1")],
      image: "/images/services/events/sports.webp",
      imageAlt: t("blocks.sports.imageAlt"),
    },
    {
      title: t("blocks.conferences.title"),
      paragraphs: [t("blocks.conferences.p1")],
      image: "/images/services/events/conferences.webp",
      imageAlt: t("blocks.conferences.imageAlt"),
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
          image="/images/services/events/hero.webp"
        />
        <ServiceBody blocks={blocks} />
        <ServiceCloser title={t("closer.title")} body={t("closer.body")} />
      </main>
      <Footer />
    </GsapProvider>
  );
}
