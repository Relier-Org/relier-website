import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/i18n/seo";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ServiceHero from "@/components/sections/ServiceHero";
import EventsDossier from "@/components/sections/EventsDossier";
import GsapProvider from "@/components/effects/GsapProvider";
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
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/signature-events", locale),
  };
}

export default async function SignatureEventsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.signatureEvents");

  return (
    <GsapProvider>
      <Nav />
      <main>
        <ServiceHero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          image="/images/services/world-cup/hero.webp"
          className={styles.hero}
        />
        <EventsDossier />
      </main>
      <Footer />
    </GsapProvider>
  );
}
