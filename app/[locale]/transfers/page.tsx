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
    namespace: "services.transfers.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/transfers", locale),
  };
}

export default async function TransfersPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.transfers");

  const blocks: ServiceBlock[] = [
    {
      title: t("blocks.maximize.title"),
      paragraphs: [t("blocks.maximize.p1")],
      image: "/images/services/transfers/maximize.webp",
      imageAlt: t("blocks.maximize.imageAlt"),
    },
    {
      title: t("blocks.stressFree.title"),
      paragraphs: [t("blocks.stressFree.p1")],
      image: "/images/services/transfers/stress-free.webp",
      imageAlt: t("blocks.stressFree.imageAlt"),
    },
    {
      title: t("blocks.costCertainty.title"),
      paragraphs: [t("blocks.costCertainty.p1")],
      image: "/images/services/transfers/cost-certainty.webp",
      imageAlt: t("blocks.costCertainty.imageAlt"),
    },
  ];

  return (
    <GsapProvider>
      <PageSchema nodes={await serviceLandingNodes(locale, "transfers")} />
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/services/transfers/hero.webp"
        />
        <ServiceBody blocks={blocks} />
        <ServiceCloser title={t("closer.title")} body={t("closer.body")} />
      </main>
      <Footer />
    </GsapProvider>
  );
}
