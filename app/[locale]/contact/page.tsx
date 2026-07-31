import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/i18n/seo";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ContactHero from "@/components/sections/ContactHero";
import ContactStatement from "@/components/sections/ContactStatement";
import ContactSplit from "@/components/sections/ContactSplit";
import ContactMap from "@/components/sections/ContactMap";
import GsapProvider from "@/components/effects/GsapProvider";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });
  return {
    title: t("contact.meta.title"),
    description: t("contact.meta.description"),
    alternates: localeAlternates("/contact", locale),
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

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
