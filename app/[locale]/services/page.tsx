import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/i18n/seo";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/sections/ServiceHero";
import ServicesIntro from "@/components/sections/ServicesIntro";
import ServicesFeatured from "@/components/sections/ServicesFeatured";
import ServicesGrid from "@/components/sections/ServicesGrid";
import GsapProvider from "@/components/effects/GsapProvider";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/services", locale),
  };
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.hero");

  return (
    <GsapProvider>
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          image="/images/services-listing/hero.webp"
          imageAlt={t("imageAlt")}
        />
        <ServicesIntro />
        <ServicesFeatured />
        <ServicesGrid />
      </main>
      <Footer />
    </GsapProvider>
  );
}
