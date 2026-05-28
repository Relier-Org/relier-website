import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ReservationHero from "@/components/sections/ReservationHero";
import BookingWidget from "@/components/sections/BookingWidget";
import GsapProvider from "@/components/effects/GsapProvider";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Online Reservation · Relier — Make Your Reservation",
  description:
    "Reserve your private chauffeured transport with Relier. Point-to-point or hourly, anywhere in the Americas, Europe and the Middle East.",
  alternates: { canonical: "https://relier.com/online-reservation/" },
};

export default function OnlineReservationPage() {
  return (
    <GsapProvider>
      <Nav />
      <main className={styles.main}>
        <ReservationHero />
        <section className={styles.formSection}>
          <BookingWidget variant="flat" />
        </section>
      </main>
      <Footer />
    </GsapProvider>
  );
}
