"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Item } from "./Landing";
import { cn } from "@/lib/utils/cn";
import styles from "./StepsTimeline.module.css";

/**
 * SUV negra vista desde arriba (mirando a la derecha): carrocería con brillo,
 * parabrisas y luneta, techo, espejos y faros. Los conos de luz van aparte,
 * en CSS, para que sumen sobre el asfalto.
 */
function TopCar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 140 64" aria-hidden="true">
      <defs>
        <linearGradient id="tc-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2a27" />
          <stop offset=".18" stopColor="#141412" />
          <stop offset=".5" stopColor="#0b0b0a" />
          <stop offset=".82" stopColor="#141412" />
          <stop offset="1" stopColor="#2b2a27" />
        </linearGradient>
        <linearGradient id="tc-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3b4249" />
          <stop offset="1" stopColor="#14181c" />
        </linearGradient>
        <linearGradient id="tc-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1c1a" />
          <stop offset=".5" stopColor="#0d0d0c" />
          <stop offset="1" stopColor="#1c1c1a" />
        </linearGradient>
      </defs>
      {/* ruedas asomando */}
      <rect x="22" y="2" width="20" height="7" rx="3" fill="#050505" />
      <rect x="22" y="55" width="20" height="7" rx="3" fill="#050505" />
      <rect x="98" y="2" width="20" height="7" rx="3" fill="#050505" />
      <rect x="98" y="55" width="20" height="7" rx="3" fill="#050505" />
      {/* carrocería */}
      <path d="M10 14c0-5 3-8 8-8h96c9 0 16 4 18 10 1.6 4.8 2 10.8 2 16s-.4 11.2-2 16c-2 6-9 10-18 10H18c-5 0-8-3-8-8Z" fill="url(#tc-body)" />
      {/* brillo de capot */}
      <path d="M104 12c8 1 14 4 16 9" stroke="rgba(255,255,255,.18)" strokeWidth="1.2" fill="none" />
      <path d="M104 52c8-1 14-4 16-9" stroke="rgba(255,255,255,.1)" strokeWidth="1.2" fill="none" />
      {/* parabrisas */}
      <path d="M84 13c5 0 9 1 11 3 1.6 4.6 2.2 10.4 2.2 16S96.6 43.4 95 48c-2 2-6 3-11 3Z" fill="url(#tc-glass)" />
      {/* techo */}
      <rect x="34" y="12" width="50" height="40" rx="6" fill="url(#tc-roof)" />
      <path d="M38 18h42M38 46h42" stroke="rgba(255,255,255,.07)" strokeWidth="1" />
      {/* Aro de Relier en el techo, como un ploteo discreto. Gira para que se
          lea igual en mobile, donde el auto va rotado. */}
      <g transform="translate(59 32)">
        <circle r="10" fill="none" stroke="rgba(255,255,255,.82)" strokeWidth="3.2" />
        <circle r="10" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="5.6" strokeDasharray="1.2 2.4" />
      </g>
      {/* luneta */}
      <path d="M33 13c-6 0-10 1-12 3-1.4 4.6-1.8 10.4-1.8 16s.4 11.4 1.8 16c2 2 6 3 12 3Z" fill="url(#tc-glass)" opacity=".85" />
      {/* espejos */}
      <path d="M86 6l6-4h3l-2 5Z" fill="#141412" />
      <path d="M86 58l6 4h3l-2-5Z" fill="#141412" />
      {/* faros */}
      <rect x="126" y="12" width="5" height="9" rx="2" fill="#fff6dc" />
      <rect x="126" y="43" width="5" height="9" rx="2" fill="#fff6dc" />
      {/* traseras */}
      <rect x="9" y="10" width="4" height="12" rx="1.5" fill="#c81e1e" />
      <rect x="9" y="42" width="4" height="12" rx="1.5" fill="#c81e1e" />
    </svg>
  );
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * "How it works" como línea de tiempo (Nico, 26-oct-2026): una ruta nocturna
 * vista desde arriba (asfalto, banquinas, carril central) que una SUV negra con
 * los faros encendidos recorre con el scroll. Cada paso se enciende cuando el
 * auto llega a su altura (sin marcas sobre la ruta: Nico, 26-oct-2026). Desktop: la
 * sección queda fija mientras se scrollea. Mobile: ruta vertical.
 *
 * El texto de los pasos está siempre en el HTML y visible (atenuado hasta
 * encenderse): nada depende de JS para leerse. Con movimiento reducido no hay
 * fijado ni recorrido: todo encendido.
 */
export default function StepsTimeline({
  head,
  items,
}: {
  head: ReactNode;
  items: Item[];
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [p, setP] = useState(0);
  const [still, setStill] = useState(false);
  const n = items.length;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      setStill(true);
      setP(1);
      return;
    }
    const desktop = window.matchMedia("(min-width: 861px)");
    let raf = 0;
    const measure = () => {
      raf = 0;
      if (desktop.matches) {
        const el = outerRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        setP(total > 0 ? clamp(-r.top / total) : 1);
      } else {
        const el = listRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        // El auto llega a cada paso cuando ese paso cruza el 60% de la pantalla.
        setP(clamp((window.innerHeight * 0.6 - r.top) / r.height));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    desktop.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      desktop.removeEventListener("change", onScroll);
    };
  }, []);

  // Entrada: el primer 18% del scroll: el auto viene desde fuera de la
  // ruta (izquierda) hasta el paso 1. El resto recorre del paso 1 al último.
  // `pos` < 0 = todavía entrando. Un paso se enciende apenas el auto lo alcanza.
  // Igual a la salida: el último 18% saca al auto de la ruta por la derecha.
  const ENTRY = still ? 0 : 0.18;
  const EXIT = still ? 0 : 0.18;
  const cruise = 1 - ENTRY - EXIT;
  const pos =
    p < ENTRY
      ? (p / ENTRY - 1) * 0.35
      : p > 1 - EXIT
        ? 1 + ((p - (1 - EXIT)) / EXIT) * 0.35
        : (p - ENTRY) / cruise;
  const reached = (i: number) => pos >= i / Math.max(1, n - 1) - 0.005;

  return (
    <div
      ref={outerRef}
      className={cn(styles.outer, still && styles.still)}
      style={{ "--steps": n, "--p": p, "--pos": pos } as React.CSSProperties}
    >
      <div className={styles.sticky}>
        {head}
        <div className={styles.track}>
          <div className={styles.road} aria-hidden="true">
            <span className={styles.lane} />
            <span className={styles.carWrap}>
              {/* Un cono por faro, nacen en cada faro (ver el SVG). */}
              <span className={`${styles.beam} ${styles.beamL}`} />
              <span className={`${styles.beam} ${styles.beamR}`} />
              <TopCar className={styles.car} />
            </span>
          </div>
          <ol ref={listRef} className={styles.steps}>
            {items.map((it, i) => (
              <li key={it.title} className={cn(styles.step, reached(i) && styles.on)}>
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.title}>{it.title}</h3>
                <p className={styles.body}>{it.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
