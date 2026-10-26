"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import ChevronIcon from "@/components/icons/ChevronIcon";
import styles from "./CardCarousel.module.css";

/**
 * Carrusel de cards de las landings (Nico, 18-oct-2026), con el sistema del
 * carrusel de eventos que tuvo el home (EventsCarousel, hasta oct-2026):
 * scroll-snap nativo, pista a sangre hasta el borde de la ventana y cada card
 * asentándose en el borde izquierdo del container. Dos
 * flechas centradas debajo de la pista. Sin autoplay.
 *
 * Infinito: las cards se renderizan tres veces y la pista arranca en la copia
 * del medio. Cuando el scroll se detiene dentro de la primera o la tercera
 * copia, salta (sin animación) a la posición equivalente de la del medio, que
 * se ve idéntica, así que el salto no se nota. Las copias de los costados
 * quedan fuera del árbol accesible.
 *
 * `children`: una card por ítem, ya renderizada en el server (los íconos son
 * componentes y no se pueden pasar como props a un client component).
 *
 * `loop={false}` (recientes de /signature-events, 22-oct-2026): carrusel
 * normal, una sola copia, flechas deshabilitadas en los extremos. `trackClassName`
 * deja al que lo usa cambiar `--basis` (cuántas cards entran por vista).
 */
export default function CardCarousel({
  children,
  label,
  loop = true,
  trackClassName,
  tone = "light",
}: {
  children: ReactNode;
  label: string;
  loop?: boolean;
  trackClassName?: string;
  /** Fondo de la sección: las flechas cambian de color. */
  tone?: "light" | "dark";
}) {
  const t = useTranslations("common");
  const trackRef = useRef<HTMLUListElement>(null);
  const items = Children.toArray(children);
  const n = items.length;
  const copies = loop ? [0, 1, 2] : [1];
  const [edge, setEdge] = useState({ start: true, end: false });

  // Ancho de una copia completa: distancia entre la primera card de la copia
  // del medio y la primera de la copia original.
  const copyWidth = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.children.length < n * 2) return 0;
    return (
      (el.children[n] as HTMLElement).offsetLeft -
      (el.children[0] as HTMLElement).offsetLeft
    );
  }, [n]);

  const recenter = useCallback(() => {
    const el = trackRef.current;
    const w = copyWidth();
    if (!el || !w) return;
    if (el.scrollLeft < w * 0.5) el.scrollLeft += w;
    else if (el.scrollLeft > w * 1.5) el.scrollLeft -= w;
  }, [copyWidth]);

  // Sin loop: sólo hay que saber si la pista está en un extremo.
  useEffect(() => {
    const el = trackRef.current;
    if (loop || !el) return;
    const update = () =>
      setEdge({
        start: el.scrollLeft <= 2,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [loop]);

  useEffect(() => {
    const el = trackRef.current;
    if (!loop || !el) return;
    // Arranque en la copia del medio.
    el.scrollLeft = copyWidth();

    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(recenter, 140);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    if ("onscrollend" in window) el.addEventListener("scrollend", recenter);
    const ro = new ResizeObserver(recenter);
    ro.observe(el);
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", recenter);
      ro.disconnect();
    };
  }, [copyWidth, recenter, loop]);

  const step = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const slides = el.children;
    const stride =
      slides.length > 1
        ? (slides[1] as HTMLElement).offsetLeft - (slides[0] as HTMLElement).offsetLeft
        : el.clientWidth;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * stride, behavior: reduced ? "auto" : "smooth" });
  }, []);

  return (
    <div className={styles.wrap}>
      {/* La región nombrada envuelve la lista y el <ul> conserva su semántica
          de lista. El tabIndex queda en el <ul> porque es el contenedor que
          scrollea: las flechas del teclado desplazan el elemento enfocado, no
          un descendiente. */}
      <div role="region" aria-label={label}>
      <ul
        className={trackClassName ? `${styles.track} ${trackClassName}` : styles.track}
        ref={trackRef}
        tabIndex={0}
      >
        {copies.flatMap((copy) =>
          items.map((item, i) => (
            <li
              key={`${copy}-${i}`}
              className={styles.slide}
              aria-hidden={copy !== 1 || undefined}
              inert={copy !== 1 || undefined}
            >
              {item}
            </li>
          ))
        )}
      </ul>
      </div>

      <div className={tone === "dark" ? `${styles.controls} ${styles.dark}` : styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => step(-1)}
          aria-label={t("previous")}
          disabled={!loop && edge.start}
        >
          <ChevronIcon direction="left" size={15} />
        </button>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => step(1)}
          aria-label={t("next")}
          disabled={!loop && edge.end}
        >
          <ChevronIcon direction="right" size={15} />
        </button>
      </div>
    </div>
  );
}
