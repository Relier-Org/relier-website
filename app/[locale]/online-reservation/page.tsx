import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/i18n/seo";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ReservationHero from "@/components/sections/ReservationHero";
import ReservationWidget from "@/components/ReservationWidget";
import GsapProvider from "@/components/effects/GsapProvider";
import PageSchema from "@/components/seo/PageSchema";
import { reservationNodes } from "@/lib/seo/pages";
import styles from "./page.module.css";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "services.reservation.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/online-reservation", locale),
  };
}

export default async function OnlineReservationPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <GsapProvider>
      <PageSchema nodes={await reservationNodes(locale)} />
      <Nav />
      <main className={styles.main}>
        <ReservationHero />
        <section className={styles.formSection}>
          <div className="container">
            <ReservationWidget configId="13" />
          </div>
        </section>
      </main>
      <Footer />
    </GsapProvider>
  );
}
