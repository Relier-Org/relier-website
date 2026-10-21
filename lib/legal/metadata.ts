import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeAlternates } from "@/lib/i18n/seo";
import { LEGAL_REVIEWED } from "@/lib/legal/entity";
import { legalPath, type LegalPageKey } from "@/lib/legal/routes";

/** Metadata común: noindex mientras los textos no estén revisados por un abogado. */
export async function legalMetadata(
  page: LegalPageKey,
  locale: string
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: t(`${page}.meta.title`),
    description: t(`${page}.meta.description`),
    alternates: localeAlternates(legalPath(page), locale),
    ...(LEGAL_REVIEWED ? {} : { robots: { index: false, follow: true } }),
  };
}
