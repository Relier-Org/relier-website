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
function TopCar({ className, traffic = false }: { className?: string; traffic?: boolean }) {
  // Los autos del tráfico: grafito, sin el aro. Ids propios para no pisar los
  // degradés de la SUV de Relier.
  const id = traffic ? "tt" : "tc";
  const [edge, mid, core] = traffic ? ["#5a5b5e", "#3a3b3e", "#2a2b2e"] : ["#2b2a27", "#141412", "#0b0b0a"];
  return (
    <svg className={className} viewBox="0 0 140 64" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={edge} />
          <stop offset=".18" stopColor={mid} />
          <stop offset=".5" stopColor={core} />
          <stop offset=".82" stopColor={mid} />
          <stop offset="1" stopColor={edge} />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3b4249" />
          <stop offset="1" stopColor="#14181c" />
        </linearGradient>
        <linearGradient id={`${id}-roof`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={traffic ? "#45464a" : "#1c1c1a"} />
          <stop offset=".5" stopColor={traffic ? "#2e2f32" : "#0d0d0c"} />
          <stop offset="1" stopColor={traffic ? "#45464a" : "#1c1c1a"} />
        </linearGradient>
      </defs>
      {/* ruedas asomando */}
      <rect x="22" y="2" width="20" height="7" rx="3" fill="#050505" />
      <rect x="22" y="55" width="20" height="7" rx="3" fill="#050505" />
      <rect x="98" y="2" width="20" height="7" rx="3" fill="#050505" />
      <rect x="98" y="55" width="20" height="7" rx="3" fill="#050505" />
      {/* carrocería */}
      <path d="M10 14c0-5 3-8 8-8h96c9 0 16 4 18 10 1.6 4.8 2 10.8 2 16s-.4 11.2-2 16c-2 6-9 10-18 10H18c-5 0-8-3-8-8Z" fill={`url(#${id}-body)`} />
      {/* brillo de capot */}
      <path d="M104 12c8 1 14 4 16 9" stroke="rgba(255,255,255,.18)" strokeWidth="1.2" fill="none" />
      <path d="M104 52c8-1 14-4 16-9" stroke="rgba(255,255,255,.1)" strokeWidth="1.2" fill="none" />
      {/* parabrisas */}
      <path d="M84 13c5 0 9 1 11 3 1.6 4.6 2.2 10.4 2.2 16S96.6 43.4 95 48c-2 2-6 3-11 3Z" fill={`url(#${id}-glass)`} />
      {/* techo */}
      <rect x="34" y="12" width="50" height="40" rx="6" fill={`url(#${id}-roof)`} />
      <path d="M38 18h42M38 46h42" stroke="rgba(255,255,255,.07)" strokeWidth="1" />
      {/* Aro de Relier en el techo, como un ploteo discreto. Gira para que se
          lea igual en mobile, donde el auto va rotado. */}
      {!traffic && (
        <g transform="translate(59 32)">
          <circle r="10" fill="none" stroke="rgba(255,255,255,.82)" strokeWidth="3.2" />
          <circle r="10" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="5.6" strokeDasharray="1.2 2.4" />
        </g>
      )}
      {/* luneta */}
      <path d="M33 13c-6 0-10 1-12 3-1.4 4.6-1.8 10.4-1.8 16s.4 11.4 1.8 16c2 2 6 3 12 3Z" fill={`url(#${id}-glass)`} opacity=".85" />
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
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * Tráfico: autos más lentos en el carril de la SUV. Cada uno arranca en `base`
 * y avanza a SPEED de la velocidad de la SUV, así ella los alcanza entre un
 * paso y otro (pasa cuando pos = base / (1 - SPEED)).
 */
const TRAFFIC = [0.15, 0.5];
const SPEED = 0.3;
const trafficAt = (pos: number) => TRAFFIC.map((b) => b + pos * SPEED);

/** Carril de la SUV en pos: 1 = su carril (derecho), -1 = pasando (izquierdo). */
function laneAt(pos: number) {
  let out = 0;
  for (const b of TRAFFIC) {
    const d = pos * (1 - SPEED) - b; // < 0: atrás del auto lento
    // Sale a pasar con distancia y vuelve recién con el auto bien atrás.
    out = Math.max(out, smooth(-0.13, -0.06, d) * (1 - smooth(0.07, 0.14, d)));
  }
  return 1 - 2 * out;
}

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
  // Cuánto fuera de la ruta arranca y termina el auto: lo suficiente para que
  // tampoco se vean los haces de los faros (Nico, 26-oct-2026).
  const OFF = 0.65;
  const pos =
    p < ENTRY
      ? (p / ENTRY - 1) * OFF
      : p > 1 - EXIT
        ? 1 + ((p - (1 - EXIT)) / EXIT) * OFF
        : (p - ENTRY) / cruise;
  const reached = (i: number) => pos >= i / Math.max(1, n - 1) - 0.005;
  const lane = still ? 1 : laneAt(pos);
  // Giro de la trompa al cambiar de carril (derivada del carril), en grados.
  const yaw = still ? 0 : Math.max(-9, Math.min(9, (laneAt(pos + 0.01) - laneAt(pos - 0.01)) * 22));
  const traffic = trafficAt(pos);

  return (
    <div
      ref={outerRef}
      className={cn(styles.outer, still && styles.still)}
      style={{ "--steps": n, "--p": p, "--pos": pos, "--lane": lane, "--yaw": `${yaw}deg` } as React.CSSProperties}
    >
      <div className={styles.sticky}>
        {head}
        <div className={styles.track}>
          <div className={styles.road} aria-hidden="true">
            <span className={styles.lane} />
            {traffic.map((x, i) => (
              <span
                key={i}
                className={`${styles.carWrap} ${styles.trafficCar}`}
                style={{ "--x": x } as React.CSSProperties}
              >
                <span className={`${styles.beam} ${styles.beamL}`} />
                <span className={`${styles.beam} ${styles.beamR}`} />
                <TopCar className={styles.car} traffic />
              </span>
            ))}
            <span className={`${styles.carWrap} ${styles.hero}`}>
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
