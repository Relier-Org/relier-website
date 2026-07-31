import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ContactHero from "@/components/sections/ContactHero";
import ContactStatement from "@/components/sections/ContactStatement";
import ContactSplit from "@/components/sections/ContactSplit";
import ContactMap from "@/components/sections/ContactMap";
import GsapProvider from "@/components/effects/GsapProvider";

export const metadata: Metadata = {
  title: "Contact · Relier — Personal Mobility Concierge",
  description:
    "Talk to a Relier concierge. Phone, email, and the Brooklyn HQ — we respond promptly to every enquiry.",
};

export default function ContactPage() {
  return (
    <GsapProvider>
      <Nav />
      <main>
        <ContactHero />
        <ContactStatement />
        <ContactSplit />
        <ContactMap />
      </main>
      <Footer />
    </GsapProvider>
  );
}
