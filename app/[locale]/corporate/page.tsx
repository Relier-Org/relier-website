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
import styles from "./page.module.css";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "services.corporate.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/corporate", locale),
  };
}

export default async function CorporatePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.corporate");

  const blocks: ServiceBlock[] = [
    {
      title: t("blocks.onTime.title"),
      paragraphs: [t("blocks.onTime.p1")],
      image: "/images/services/corporate/arrive-on-time.webp",
      imageAlt: t("blocks.onTime.imageAlt"),
      links: [{ href: "/airport", label: t("links.airport") }],
    },
    {
      title: t("blocks.impression.title"),
      paragraphs: [t("blocks.impression.p1")],
      image: "/images/services/corporate/lasting-impression.webp",
      imageAlt: t("blocks.impression.imageAlt"),
    },
    {
      title: t("blocks.workRelax.title"),
      paragraphs: [t("blocks.workRelax.p1")],
      image: "/images/services/corporate/work-relax.webp",
      imageAlt: t("blocks.workRelax.imageAlt"),
      links: [{ href: "/fleet", label: t("links.fleet") }],
    },
  ];

  return (
    <GsapProvider>
      <PageSchema nodes={await serviceLandingNodes(locale, "corporate")} />
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/services/corporate/hero.webp"
          className={styles.hero}
        />
        <ServiceBody blocks={blocks} />
        <ServiceCloser
          title={t("closer.title")}
          body={t("closer.body")}
          secondaryHref="/for-business"
          secondaryLabel={t("links.forBusiness")}
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
