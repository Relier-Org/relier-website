import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import LegalPage from "@/components/legal/LegalPage";
import { LEGAL_ENTITY } from "@/lib/legal/entity";
import { legalMetadata } from "@/lib/legal/metadata";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return legalMetadata("privacy", locale);
}

// Confirmado por el cliente (22-oct-2026): conservación de 7 años para
// consultas y reservas, Limo Anywhere como CRM de leads, sin certificación
// propia en el EU-US Data Privacy Framework y sin representante art. 27.
export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPage
      locale={locale}
      page="privacy"
      omitBlocks={{
        controller: LEGAL_ENTITY.euRepresentative ? [] : ["p3"],
      }}
    />
  );
}
