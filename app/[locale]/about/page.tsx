import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/i18n/seo";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/sections/AboutHero";
import AboutIntro from "@/components/sections/AboutIntro";
import AboutBento from "@/components/sections/AboutBento";
import RelatedLinks from "@/components/sections/RelatedLinks";
import Testimonials from "@/components/sections/Testimonials";
import GsapProvider from "@/components/effects/GsapProvider";
import PageSchema from "@/components/seo/PageSchema";
import { aboutNodes } from "@/lib/seo/pages";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });
  return {
    title: t("about.meta.title"),
    description: t("about.meta.description"),
    alternates: localeAlternates("/about", locale),
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.about.serve" });

  return (
    <GsapProvider>
      <PageSchema nodes={await aboutNodes(locale)} />
      <Nav />
      <main>
        <AboutHero />
        <AboutIntro />
        <AboutBento />
        {/* Internal linking (roadmap SEO sep-2026, T17): la página de entidad
            reparte confianza hacia los 4 segmentos B2B. El rebuild completo de
            About (R07) sigue pendiente de copy y de validar licencias. */}
        <RelatedLinks
          eyebrow={t("eyebrow")}
          title={t("title")}
          links={[
            { href: "/for-business/travel-advisors", label: t("advisors") },
            { href: "/affiliates", label: t("affiliates") },
            { href: "/corporate", label: t("corporate") },
            { href: "/events", label: t("events") },
          ]}
        />
        <Testimonials />
      </main>
      <Footer />
    </GsapProvider>
  );
}
