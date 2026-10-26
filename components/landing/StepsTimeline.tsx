"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Item } from "./Landing";
import { cn } from "@/lib/utils/cn";
import styles from "./StepsTimeline.module.css";

/** Autito de perfil, sedán, para recorrer la ruta. */
function Car({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 26" aria-hidden="true">
      <path
        d="M6 18.5c0-2.4 1.3-3.9 3.6-4.6l8.3-2.6 6.6-5.6c1.2-1 2.7-1.6 4.3-1.6h11.4c1.8 0 3.5.7 4.8 2l5 5 5.2 1.1c2.6.6 4.4 2.6 4.4 5.2v1.3c0 1-.8 1.8-1.8 1.8H8c-1.1 0-2-.9-2-2Z"
        fill="currentColor"
      />
      <path d="M26.6 7.6c.7-.6 1.5-.9 2.4-.9h5.4v5.1H20.8l5.8-4.2Zm9.6-.9h4.7c1 0 1.9.4 2.6 1.1l4 3.9H36.2V6.7Z" fill="rgba(255,255,255,.55)" />
      <circle cx="18" cy="21" r="4.6" fill="#141310" />
      <circle cx="18" cy="21" r="2" fill="currentColor" />
      <circle cx="49" cy="21" r="4.6" fill="#141310" />
      <circle cx="49" cy="21" r="2" fill="currentColor" />
    </svg>
  );
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * "How it works" como línea de tiempo (Nico, 26-oct-2026; referencia: el dial
 * de restoexp.com, pero lineal). Desktop: la sección queda fija mientras se
 * scrollea y un autito recorre una ruta con marcas; cada paso se enciende al
 * llegar a su punto. Mobile: la ruta es vertical y el auto baja con el scroll.
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

  // Los puntos van al centro de cada columna: el auto recorre del primero al
  // último. Un paso se enciende apenas el auto lo alcanza.
  const reached = (i: number) => p >= i / Math.max(1, n - 1) - 0.02;

  return (
    <div
      ref={outerRef}
      className={cn(styles.outer, still && styles.still)}
      style={{ "--steps": n, "--p": p } as React.CSSProperties}
    >
      <div className={styles.sticky}>
        {head}
        <div className={styles.track}>
          <div className={styles.road} aria-hidden="true">
            <span className={styles.ticks} />
            <span className={styles.progress} />
            <span className={styles.carWrap}>
              <Car className={styles.car} />
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
