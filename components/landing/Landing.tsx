import type { ReactNode } from "react";
import Reveal from "@/components/effects/Reveal";
import { cn } from "@/lib/utils/cn";
import styles from "./Landing.module.css";

/**
 * Secciones de las landings B2B de SEO (oct-2026: events, corporate,
 * affiliates, travel advisors). El contenido es el del equipo de SEO; la forma
 * es la del sitio: mismos tokens, misma escala de títulos, franjas crema y
 * oscuras alternadas, título a la izquierda y descripción a la derecha.
 */

export type Tone = "dark" | "light";
export type Item = { title: string; body: string };

export function Band({
  tone = "dark",
  id,
  children,
}: {
  tone?: Tone;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(styles.band, tone === "light" ? styles.light : styles.dark)}
    >
      <div className="container">{children}</div>
    </section>
  );
}

export function Head({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <Reveal className={cn(styles.head, !lead && styles.headSolo)}>
      <div className={styles.headText}>
        <p className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 className={styles.title}>{title}</h2>
      </div>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </Reveal>
  );
}

/** Franja bajo el hero: cuatro puntos fuertes y una frase de cierre. */
export function Highlights({
  items,
  tagline,
}: {
  items: string[];
  tagline: string;
}) {
  return (
    <section className={styles.highlights}>
      <div className="container">
        <ul className={styles.hlList}>
          {items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
        <p className={styles.tagline}>{tagline}</p>
      </div>
    </section>
  );
}

export function Cards({
  items,
  columns = 3,
  numbered = false,
}: {
  items: Item[];
  columns?: 3 | 4 | 5;
  numbered?: boolean;
}) {
  return (
    <ul className={cn(styles.cards, styles[`cols${columns}`])}>
      {items.map((it, i) => (
        <Reveal as="li" key={it.title} className={styles.card} delay={Math.min(i * 0.06, 0.24)}>
          {numbered ? (
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
          ) : null}
          <h3 className={styles.cardTitle}>{it.title}</h3>
          <p className={styles.cardBody}>{it.body}</p>
        </Reveal>
      ))}
    </ul>
  );
}

/** Pasos 01–03 en fila, separados por un filete arriba. */
export function Steps({ items, note }: { items: Item[]; note?: string }) {
  return (
    <>
      <ol className={styles.steps}>
        {items.map((it, i) => (
          <Reveal as="li" key={it.title} className={styles.step} delay={i * 0.08}>
            <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className={styles.cardTitle}>{it.title}</h3>
            <p className={styles.cardBody}>{it.body}</p>
          </Reveal>
        ))}
      </ol>
      {note ? <p className={styles.note}>{note}</p> : null}
    </>
  );
}

export function Badges({ items }: { items: string[] }) {
  return (
    <ul className={styles.badges}>
      {items.map((b) => (
        <li key={b}>{b}</li>
      ))}
    </ul>
  );
}

/** Nombres destacados en tags y el resto en un desplegable nativo. */
export function NameList({
  names,
  more,
  moreLabel,
  note,
  link,
}: {
  names: string[];
  more: string[];
  moreLabel: string;
  note: string;
  link?: ReactNode;
}) {
  return (
    <div className={styles.names}>
      <Badges items={names} />
      <details className={styles.more}>
        <summary>{moreLabel}</summary>
        <ul className={styles.moreList}>
          {more.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </details>
      <p className={styles.note}>{note}</p>
      {link ? <div className={styles.linkRow}>{link}</div> : null}
    </div>
  );
}
