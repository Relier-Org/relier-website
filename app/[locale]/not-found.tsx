import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Nav from "@/components/layout/Nav";
import Button from "@/components/ui/Button";
import styles from "./not-found.module.css";

/**
 * 404 del sitio (Nico, 23-oct-2026): a propósito mínima, una tarjeta con el
 * logo, el error y dos salidas (home y reserva). Next responde 404 y agrega
 * noindex solo.
 *
 * Sin getTranslations ni generateMetadata a propósito: not-found no recibe
 * params, y leer el idioma por fuera del árbol del layout cae en headers().
 * En las rutas estáticas ([slug] del blog) eso rompe con 500 ("static to
 * dynamic"). El texto usa useTranslations (idioma del layout) y el título es
 * fijo.
 */
export const metadata: Metadata = { title: "Page not found | Relier" };

export default function NotFound() {
  const t = useTranslations("common.notFound");

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <section className={styles.card}>
          <Image
            src="/images/relier-logo-stacked.png"
            alt="Relier"
            width={256}
            height={240}
            className={styles.logo}
          />
          <p className={styles.eyebrow}>{t("eyebrow")}</p>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.body}>{t("body")}</p>
          <div className={styles.actions}>
            <Button href="/" withArrow>
              {t("home")}
            </Button>
            <Button href="/online-reservation" variant="secondary">
              {t("book")}
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
