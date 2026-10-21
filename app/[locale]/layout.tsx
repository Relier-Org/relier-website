import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Manrope } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import AttributionCapture from "@/components/analytics/AttributionCapture";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { routing } from "@/i18n/routing";
import { clientNamespaces } from "@/i18n/request";
import Analytics from "@/components/analytics/Analytics";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CookieBanner from "@/components/consent/CookieBanner";
import { ORIGIN } from "@/lib/i18n/seo";
import JsonLd from "@/components/seo/JsonLd";
import "../globals.css";

// OG locale tags (BCP 47 with region) per site locale.
const OG_LOCALES: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
  pt: "pt_BR",
};

const fraunces = Fraunces({
  subsets: ["latin"],
  // WONK se carga para poder apagarlo: el default trae la "&" en forma "Et" que
  // no se lee rápido (Figma oct-2026, Fraunces 72pt Light Italic).
  axes: ["opsz", "WONK"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    metadataBase: new URL(ORIGIN),
    // Search Console pide el meta en el <head> de la home; el resto de las
    // páginas lo heredan de este layout porque nadie sobreescribe verification.
    verification: {
      google: "lpmTYCy4qioj3yPAih5KhKTB1WwHoBIMssBrBAKGgHQ",
    },
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.ogDescription"),
      type: "website",
      locale: OG_LOCALES[locale] ?? OG_LOCALES.en,
    },
    // El WordPress emitía og:image en todas las páginas y este sitio no emitía
    // ninguna salvo en los posts: compartir un link salía sin preview. La imagen
    // sale de app/opengraph-image.jpg + app/twitter-image.jpg (convención de
    // Next), así que acá sólo hace falta subir la card de Twitter a la grande.
    twitter: {
      card: "summary_large_image",
      title: t("meta.title"),
      description: t("meta.ogDescription"),
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const clientMessages = Object.fromEntries(
    clientNamespaces.map((ns) => [ns, messages[ns]])
  );

  return (
    // suppressHydrationWarning: the preloader's inline script stamps
    // `data-preloader` (and the scroll lock class) on <html> before hydration.
    <html
      lang={locale}
      className={`${fraunces.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body>
        <JsonLd />
        <Analytics />
        <NextIntlClientProvider messages={clientMessages}>
          <AttributionCapture />
          {/* Opt-in global: sin decisión no carga ningún tag (ver Analytics).
              Va antes del contenido para ser lo primero del orden de Tab: al
              final del DOM quedaba a ~80 tabs y tapaba controles enfocados. */}
          <CookieBanner />
          {children}
        </NextIntlClientProvider>
        <WhatsAppButton />
      </body>
    </html>
  );
}
