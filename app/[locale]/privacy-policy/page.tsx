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

// TODO(cliente): períodos exactos de conservación (consultas y reservas); hoy
// la sección "retention" los describe por criterio, sin plazos.
// TODO(cliente): confirmar si la entidad o sus proveedores están certificados
// en el EU-US Data Privacy Framework y nombrar la herramienta de email/CRM
// si se quiere listarla en "share".
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
