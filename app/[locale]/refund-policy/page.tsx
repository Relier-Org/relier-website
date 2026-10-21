import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import LegalPage from "@/components/legal/LegalPage";
import { legalMetadata } from "@/lib/legal/metadata";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return legalMetadata("refund", locale);
}

// Fuente: doc del cliente "Services & Policies" (NYC y Spain), versión sugerida.
// TODO(cliente): proceso de reembolso (plazo y medio de devolución) no está
// confirmado; la página no lo describe.
// TODO(cliente/abogado): revisar la nota de derecho de desistimiento para
// consumidores de la UE (Directiva 2011/83/UE, art. 16(l)).
export default async function RefundPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalPage locale={locale} page="refund" />;
}
