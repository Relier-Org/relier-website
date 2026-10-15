import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeAlternates } from "@/lib/i18n/seo";
import { LANDINGS, type LandingKey } from "@/lib/seo/pages";
import type { Item } from "./Landing";

/** Metadata de una landing B2B: title/description de SEO + hreflang. */
export async function landingMetadata(
  locale: string,
  key: LandingKey
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `landings.${key}.meta` });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates(LANDINGS[key].path, locale),
  };
}

/** Lector tipado de las listas del JSON (`t.raw`). */
export const items = (v: unknown) => v as Item[];
export const strings = (v: unknown) => v as string[];
