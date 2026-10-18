"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils/cn";
import styles from "./NameMarquee.module.css";

/**
 * Experiencia con artistas como marquee tipográfico (Nico, 18-oct-2026): dos
 * filas de nombres grandes que corren en sentidos opuestos. Sin fotos de los
 * artistas a propósito: no hay stock legal y la cara en una página comercial
 * se lee como respaldo (derecho de imagen).
 *
 * Cada fila se mueve con `gsap.ticker`; el hover la frena con una rampa y con
 * el dedo o el mouse se arrastra. La lista completa va aparte, oculta a la
 * vista, para lectores de pantalla (el marquee es decorativo y repite nombres).
 */

const SPEED = 38; // px por segundo
const RAMP = 0.08; // suavizado de la velocidad al pausar/reanudar

function useMarqueeRow(dir: 1 | -1) {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = track.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // El contenido va duplicado: el loop vuelve a cero al recorrer media pista.
    let half = el.scrollWidth / 2;
    let x = dir < 0 ? 0 : -half;
    let v = reduced ? 0 : SPEED * dir;
    let target = v;
    let dragging = false;
    let lastX = 0;

    const wrap = () => {
      if (x <= -half) x += half;
      if (x > 0) x -= half;
    };
    const tick = (_t: number, dt: number) => {
      v += (target - v) * RAMP;
      if (!dragging) x += (v * dt) / 1000;
      wrap();
      el.style.transform = `translate3d(${x}px, 0, 0)`;
    };
    gsap.ticker.add(tick);

    const host = el.parentElement!;
    const pause = () => {
      target = 0;
    };
    const resume = () => {
      if (!dragging) target = reduced ? 0 : SPEED * dir;
    };
    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      host.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      x += dx;
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (host.hasPointerCapture(e.pointerId)) host.releasePointerCapture(e.pointerId);
      // En touch no hay hover: al soltar sigue corriendo.
      if (e.pointerType !== "mouse") resume();
    };
    const onResize = () => {
      half = el.scrollWidth / 2;
    };

    host.addEventListener("pointerenter", pause);
    host.addEventListener("pointerleave", resume);
    host.addEventListener("pointerdown", down);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerup", up);
    host.addEventListener("pointercancel", up);
    window.addEventListener("resize", onResize);
    // Las fuentes pueden llegar después del primer cálculo.
    document.fonts?.ready.then(onResize);

    return () => {
      gsap.ticker.remove(tick);
      host.removeEventListener("pointerenter", pause);
      host.removeEventListener("pointerleave", resume);
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerup", up);
      host.removeEventListener("pointercancel", up);
      window.removeEventListener("resize", onResize);
    };
  });

  return track;
}

function Row({ names, dir, italic }: { names: string[]; dir: 1 | -1; italic?: boolean }) {
  const track = useMarqueeRow(dir);
  const loop = [...names, ...names];
  return (
    <div className={cn(styles.row, italic && styles.italic)}>
      <div ref={track} className={styles.track}>
        {loop.map((n, i) => (
          <span key={`${n}-${i}`} className={styles.item}>
            {n}
            <span className={styles.sep} aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function NameMarquee({
  names,
  label,
}: {
  names: string[];
  /** Nombre accesible de la lista completa. */
  label: string;
}) {
  // Destacados y resto intercalados entre las dos filas, para que las dos
  // arranquen con nombres conocidos.
  const top = names.filter((_, i) => i % 2 === 0);
  const bottom = names.filter((_, i) => i % 2 === 1);

  return (
    <div className={styles.marquee}>
      <div aria-hidden="true">
        <Row names={top} dir={-1} />
        <Row names={bottom} dir={1} italic />
      </div>
      <ul className={styles.srOnly} aria-label={label}>
        {names.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  );
}
