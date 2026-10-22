import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";

export const ORIGIN = "https://relier.com";

// OG locale tags (BCP 47 with region) per site locale.
export const OG_LOCALES: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
  pt: "pt_BR",
};

export function localeUrl(locale: Locale, path: string) {
  const clean = path.replace(/^\/+|\/+$/g, "");
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const suffix = clean ? `/${clean}/` : "/";
  return `${ORIGIN}${prefix}${suffix}`;
}

/**
 * Self-referencing canonical + reciprocal hreflang alternates for a route.
 * `path` is the locale-agnostic pathname, e.g. "/" or "/transfers".
 *
 *   export async function generateMetadata({ params }) {
 *     const { locale } = await params;
 *     return { alternates: localeAlternates("/transfers", locale) };
 *   }
 */
export function localeAlternates(path: string, locale: string) {
  const current: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, localeUrl(l, path)])
  ) as Record<string, string>;
  languages["x-default"] = localeUrl(routing.defaultLocale, path);

  return { canonical: localeUrl(current, path), languages };
}
