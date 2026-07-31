import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/i18n/seo";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import TestimonialsHero from "@/components/sections/TestimonialsHero";
import TestimonialsIntro from "@/components/sections/TestimonialsIntro";
import Testimonials from "@/components/sections/Testimonials";
import testimonialsStyles from "@/components/sections/Testimonials.module.css";
import GsapProvider from "@/components/effects/GsapProvider";
import { TESTIMONIALS } from "@/lib/testimonials/data";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });
  return {
    title: t("testimonials.meta.title"),
    description: t("testimonials.meta.description"),
    alternates: localeAlternates("/testimonials", locale),
  };
}

export default async function TestimonialsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <GsapProvider>
      <Nav />
      <main>
        <TestimonialsHero />
        <TestimonialsIntro />
        <Testimonials
          testimonials={TESTIMONIALS}
          showHeader={false}
          showRatingPill={false}
          reviewPillMode="sticky"
          className={testimonialsStyles.testimonialsFlush}
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
