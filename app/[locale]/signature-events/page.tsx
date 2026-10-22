import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates, OG_LOCALES } from "@/lib/i18n/seo";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/sections/ServiceHero";
import EventsDossier from "@/components/sections/EventsDossier";
import GsapProvider from "@/components/effects/GsapProvider";
import PageSchema from "@/components/seo/PageSchema";
import { signatureEventsNodes } from "@/lib/seo/pages";
import styles from "./page.module.css";

// The events Relier has actually run, and the ones coming. Separate page from
// `/events` on purpose (client, 11-aug-2026): `/events` is the *service* — what
// we do for galas, VIP groups and event logistics — and this one is the proof,
// event by event, with the operation's real figures. Standard ServiceHero on top
// like every other page; the body is an operations dossier.
type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "services.signatureEvents.meta",
  });
  // og propio (Andrés, 21-oct-2026): antes heredaba el de la home del layout.
  // Next reemplaza `openGraph` entero, así que type y locale van de nuevo.
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/signature-events", locale),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
      locale: OG_LOCALES[locale] ?? OG_LOCALES.en,
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
  };
}

export default async function SignatureEventsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.signatureEvents");

  return (
    <GsapProvider>
      <PageSchema nodes={await signatureEventsNodes(locale)} />
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/services/world-cup/hero.webp"
          imageAlt={t("hero.imageAlt")}
          className={styles.hero}
        />
        <EventsDossier />
      </main>
      <Footer />
    </GsapProvider>
  );
}
