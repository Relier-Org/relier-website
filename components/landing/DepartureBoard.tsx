"use client";

import { useEffect, useRef } from "react";
import type { Airport } from "./Landing";
import styles from "./DepartureBoard.module.css";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Tablero de salidas (Airports, Nico 26-oct-2026, referencia: pantalla de
 * departures): los aeropuertos en filas sobre un panel oscuro, con el código
 * IATA en fichas tipo split-flap que giran letra por letra al entrar en
 * pantalla. El HTML del server ya trae las letras finales (sin JS o con
 * movimiento reducido se ven quietas); la animación sólo pasa por letras al
 * azar y vuelve a la correcta.
 *
 * TODO(cliente): los tiempos de viaje de los regionales (TEB, HPN, ISP, SWF)
 * son estimaciones de Google Maps y guías de traslado (26-oct-2026); Relier
 * tiene que validarlos.
 */
export default function DepartureBoard({
  main,
  regional,
  regionalTitle,
  distanceLabel,
  timeLabel,
}: {
  main: Airport[];
  regional: Airport[];
  regionalTitle: string;
  distanceLabel: string;
  timeLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const board = ref.current;
    if (!board) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tiles = [...board.querySelectorAll<HTMLElement>("[data-flap]")];
    const timers: number[] = [];

    const run = () => {
      tiles.forEach((tile, i) => {
        const final = tile.dataset.flap ?? "";
        // Escalonado por fila y por letra, como un tablero real.
        const flips = 6 + (i % 3) * 2 + Math.floor(Math.random() * 4);
        let n = 0;
        const start = window.setTimeout(() => {
          const iv = window.setInterval(() => {
            n += 1;
            tile.textContent = n >= flips ? final : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            tile.classList.remove(styles.flip);
            void tile.offsetWidth;
            tile.classList.add(styles.flip);
            if (n >= flips) window.clearInterval(iv);
          }, 70);
          timers.push(iv);
        }, Math.floor(i / 3) * 110);
        timers.push(start);
      });
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(board);
    return () => {
      io.disconnect();
      timers.forEach((t) => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
    };
  }, []);

  const code = (c: string) => (
    <span className={styles.code} aria-label={c} role="img">
      {c.split("").map((ch, i) => (
        <span key={i} className={styles.tile} data-flap={ch} aria-hidden="true">
          {ch}
        </span>
      ))}
    </span>
  );

  return (
    <div ref={ref} className={styles.board}>
      <div className={styles.head} aria-hidden="true">
        <span className={styles.plane}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z" />
          </svg>
        </span>
        <span className={styles.colName} />
        <span className={styles.colLabel}>{distanceLabel}</span>
        <span className={styles.colLabel}>{timeLabel}</span>
      </div>

      <ul className={styles.rows}>
        {main.map((a) => (
          <li key={a.code} className={styles.row}>
            {code(a.code)}
            <span className={styles.name}>{a.name}</span>
            <span className={styles.cell} data-label={distanceLabel}>{a.distance}</span>
            <span className={styles.cell} data-label={timeLabel}>{a.time}</span>
          </li>
        ))}
      </ul>

      <h3 className={styles.sub}>{regionalTitle}</h3>
      <ul className={styles.rows}>
        {regional.map((a) => (
          <li key={a.code} className={`${styles.row} ${styles.rowRegional}`}>
            {code(a.code)}
            {/* Nombre con el detalle debajo, como la observación de un vuelo. */}
            <span className={styles.nameBlock}>
              <span className={styles.name}>{a.name}</span>
              <span className={styles.detail}>{a.detail}</span>
            </span>
            <span className={styles.cell} data-label={distanceLabel}>{a.distance}</span>
            <span className={styles.cell} data-label={timeLabel}>{a.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
