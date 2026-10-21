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
  return legalMetadata("terms", locale);
}

// TODO(cliente): propinas/gratuity. El doc del cliente las marcó "a chequear":
// no se mencionan hasta que confirme la política.
export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPage
      locale={locale}
      page="terms"
      // Sin ley aplicable confirmada la cláusula no se publica (no se inventa).
      omitSections={LEGAL_ENTITY.governingLaw ? [] : ["law"]}
      omitBlocks={{
        about: LEGAL_ENTITY.incorporation ? [] : ["p3"],
      }}
    />
  );
}
