import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils/cn";
import {
  LEGAL_ENTITY,
  LEGAL_LAST_UPDATED,
  privacyContact,
} from "@/lib/legal/entity";
import { legalPath, type LegalPageKey } from "@/lib/legal/routes";
import styles from "./LegalPage.module.css";

// Shell compartido de las 5 páginas legales. El contenido sale de
// `legal.<page>.sections.<id>`: cada sección tiene `title` y bloques cuyo
// prefijo de key decide el elemento (`p*` párrafo, `h*` subtítulo, `ul*`
// lista cuyos valores son los ítems). El orden de las keys es el de lectura.
//
// Sin Reveal ni animaciones de entrada: el texto legal tiene que estar visible
// siempre, con o sin JS.

type Section = Record<string, string | Record<string, string>>;

interface LegalPageProps {
  locale: string;
  page: LegalPageKey;
  /** Secciones a omitir enteras (p. ej. ley aplicable cuando no hay dato). */
  omitSections?: string[];
  /** Bloques a omitir dentro de una sección: `{ controller: ["p3"] }`. */
  omitBlocks?: Record<string, string[]>;
  /** Contenido que va al final de una sección (tabla de cookies, botón). */
  extras?: Record<string, ReactNode>;
}

// Teléfonos y casillas fuera del JSON: las strings los reciben como parámetros
// ICU, así un cambio de dato no toca los tres idiomas.
// TODO(cliente): +1 (347) 855-0000 figura como WhatsApp de Affiliates en
// lib/contact/departments.ts; confirmar que es el número para consultas de
// clientes que trae el doc "NYC Services & Policies".
const NY_POLICY_PHONE = { display: "+1 (347) 855-0000", tel: "+13478550000" };
// TODO(cliente): el doc de España trae "+34 638 00 00 00", que es un
// placeholder. Hasta tener el número real se publica solo el email.
const ES_EMAIL = "info@relier.es";
const RESERVATIONS_EMAIL = "reservations@relier.com";

const tel = (display: string) => `tel:+${display.replace(/\D/g, "")}`;

export function legalDate(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${LEGAL_LAST_UPDATED}T00:00:00Z`));
}

function richValues(locale: string) {
  const mail = (address: string) => {
    const MailLink = (chunks: ReactNode) => (
      <a href={`mailto:${address}`}>{chunks}</a>
    );
    return MailLink;
  };
  const internal = (key: LegalPageKey) => {
    const InternalLink = (chunks: ReactNode) => (
      <Link href={legalPath(key)}>{chunks}</Link>
    );
    return InternalLink;
  };

  return {
    // Parámetros
    controller: LEGAL_ENTITY.legalName ?? LEGAL_ENTITY.tradeName,
    address: LEGAL_ENTITY.registeredAddress ?? LEGAL_ENTITY.officeAddress,
    officeAddress: LEGAL_ENTITY.officeAddress,
    incorporation: LEGAL_ENTITY.incorporation ?? "",
    law: LEGAL_ENTITY.governingLaw ?? "",
    euRepresentative: LEGAL_ENTITY.euRepresentative ?? "",
    infoEmail: LEGAL_ENTITY.contactEmail,
    privacyEmail: privacyContact(),
    phone: LEGAL_ENTITY.phone,
    nyPhone: NY_POLICY_PHONE.display,
    esEmail: ES_EMAIL,
    reservationsEmail: RESERVATIONS_EMAIL,
    date: legalDate(locale),
    // Tags
    b: (chunks: ReactNode) => <strong>{chunks}</strong>,
    infoMail: mail(LEGAL_ENTITY.contactEmail),
    privacyMail: mail(privacyContact()),
    esMail: mail(ES_EMAIL),
    reservationsMail: mail(RESERVATIONS_EMAIL),
    phoneLink: (chunks: ReactNode) => (
      <a href={tel(LEGAL_ENTITY.phone)}>{chunks}</a>
    ),
    nyPhoneLink: (chunks: ReactNode) => (
      <a href={`tel:${NY_POLICY_PHONE.tel}`}>{chunks}</a>
    ),
    privacyLink: internal("privacy"),
    termsLink: internal("terms"),
    cookieLink: internal("cookies"),
    refundLink: internal("refund"),
    fleetLink: (chunks: ReactNode) => <Link href="/fleet">{chunks}</Link>,
    aepd: (chunks: ReactNode) => (
      <a href="https://www.aepd.es" rel="noopener noreferrer" target="_blank">
        {chunks}
      </a>
    ),
  };
}

export default async function LegalPage({
  locale,
  page,
  omitSections = [],
  omitBlocks = {},
  extras = {},
}: LegalPageProps) {
  const t = await getTranslations({ locale, namespace: "legal" });
  const values = richValues(locale);
  const base = `${page}.sections`;
  const raw = t.raw(base) as Record<string, Section>;
  const sectionIds = Object.keys(raw).filter((id) => !omitSections.includes(id));

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className={cn("container", styles.heroInner)}>
            <p className="eyebrow">{t("common.eyebrow")}</p>
            <h1 className={styles.h1}>{t(`${page}.title`)}</h1>
            <p className={styles.lead}>{t.rich(`${page}.lead`, values)}</p>
            <p className={styles.updated}>
              {t("common.lastUpdated")}{" "}
              <time dateTime={LEGAL_LAST_UPDATED}>{values.date}</time>
            </p>
          </div>
        </header>

        <div className={cn("container", styles.layout)}>
          <nav className={styles.toc} aria-label={t("common.tocLabel")}>
            <p className={styles.tocTitle} aria-hidden="true">
              {t("common.tocLabel")}
            </p>
            <ol className={styles.tocList}>
              {sectionIds.map((id) => (
                <li key={id}>
                  <a href={`#${id}`}>{t(`${base}.${id}.title`)}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className={styles.body}>
            {sectionIds.map((id) => {
              const skip = omitBlocks[id] ?? [];
              const blocks = Object.entries(raw[id]).filter(
                ([key]) => key !== "title" && !skip.includes(key)
              );
              return (
                <section key={id} className={styles.section} aria-labelledby={id}>
                  <h2 id={id} className={styles.h2}>
                    {t(`${base}.${id}.title`)}
                  </h2>
                  {blocks.map(([key, value]) => {
                    const path = `${base}.${id}.${key}`;
                    if (key.startsWith("ul") && typeof value === "object") {
                      return (
                        <ul key={key} className={styles.list}>
                          {Object.keys(value).map((item) => (
                            <li key={item}>{t.rich(`${path}.${item}`, values)}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (key.startsWith("h")) {
                      return (
                        <h3 key={key} className={styles.h3}>
                          {t(path)}
                        </h3>
                      );
                    }
                    return <p key={key}>{t.rich(path, values)}</p>;
                  })}
                  {extras[id]}
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
