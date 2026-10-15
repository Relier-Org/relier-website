import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/i18n/seo";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import FleetHero from "@/components/sections/FleetHero";
import FleetGrid, {
  type FleetVehicle,
} from "@/components/sections/FleetGrid";
import RelatedLinks from "@/components/sections/RelatedLinks";
import GsapProvider from "@/components/effects/GsapProvider";
import PageSchema from "@/components/seo/PageSchema";
import { fleetNodes } from "@/lib/seo/pages";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "fleet" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: localeAlternates("/fleet", locale),
  };
}

export default async function FleetPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "fleet" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const smaller: FleetVehicle[] = [
    {
      tier: t("vehicles.sedan.tier"),
      label: t("vehicles.sedan.label"),
      year: "2024",
      name: "Cadillac Lyriq",
      image: "/images/fleet/lyriq.webp",
      passengers: 2,
      bags: 2,
      orSimilar: true,
    },
    {
      tier: t("vehicles.suv.tier"),
      label: t("vehicles.suv.label"),
      year: "2023",
      name: "Cadillac Escalade",
      image: "/images/fleet/escalade.webp",
      passengers: 5,
      bags: 6,
      orSimilar: true,
    },
    {
      tier: t("vehicles.sClass.tier"),
      label: t("vehicles.sClass.label"),
      year: "2024",
      name: "Mercedes-Benz S-Class",
      image: "/images/fleet/s-class.webp",
      passengers: 2,
      bags: 2,
      orSimilar: true,
    },
    {
      tier: t("vehicles.van.tier"),
      label: t("vehicles.van.label"),
      year: "2023",
      name: "Mercedes-Benz Sprinter",
      image: "/images/fleet/sprinter.webp",
      passengers: 13,
      bags: 10,
      orSimilar: true,
    },
  ];

  // Larger vehicles: only passenger count is listed on the source site.
  // Bags / year / brand are intentionally absent.
  const larger: FleetVehicle[] = [
    {
      tier: t("vehicles.minibus.tier"),
      name: t("vehicles.minibus.tier"),
      image: "/images/fleet/minibus.webp",
      passengers: "24–40",
    },
    {
      tier: t("vehicles.motorcoach.tier"),
      name: t("vehicles.motorcoach.tier"),
      image: "/images/fleet/motorcoach.webp",
      passengers: 56,
    },
  ];

  return (
    <GsapProvider>
      <PageSchema nodes={await fleetNodes(locale)} />
      <Nav />
      <main>
        <FleetHero />
        <FleetGrid
          title={t("smaller.title")}
          lead={t("smaller.lead")}
          vehicles={smaller}
          id="smaller"
        />
        <FleetGrid
          title={t("larger.title")}
          lead={t("larger.lead")}
          vehicles={larger}
          id="larger"
        />
        {/* Internal linking (roadmap SEO sep-2026): vehículos → money pages. */}
        <RelatedLinks
          eyebrow={t("useCases.eyebrow")}
          title={t("useCases.title")}
          links={[
            { href: "/corporate", label: t("useCases.corporate") },
            { href: "/events", label: t("useCases.events") },
            { href: "/airport", label: t("useCases.airport") },
          ]}
          primary={{ href: "/online-reservation", label: tc("bookOnline") }}
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
