import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import LegalPage from "@/components/legal/LegalPage";
import CookieTables from "@/components/legal/CookieTables";
import CookieSettingsButton from "@/components/legal/CookieSettingsButton";
import { legalMetadata } from "@/lib/legal/metadata";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return legalMetadata("cookies", locale);
}

export default async function CookiePolicyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <LegalPage
      locale={locale}
      page="cookies"
      extras={{
        list: <CookieTables locale={locale} />,
        manage: (
          <div className={styles.action}>
            <CookieSettingsButton label={t("common.cookieSettings")} />
          </div>
        ),
      }}
    />
  );
}
