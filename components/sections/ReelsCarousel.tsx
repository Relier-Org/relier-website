"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import AmbientVideo from "@/components/ui/AmbientVideo";
import ChevronIcon from "@/components/icons/ChevronIcon";
import type { Reel } from "@/lib/social/reels";
import { cn } from "@/lib/utils/cn";
import styles from "./Social.module.css";

export type ReelItem = Reel & { caption: string };

/** Ícono de Reels de Instagram (claqueta con play), decorativo. */
function ReelsGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <path d="M2.5 8h19M9 2.5 12 8M15 2.5 18 8" />
      <path d="M10 11.2v6l5-3-5-3Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Carrusel selector de reels (Nico, 26-oct-2026, referencia de Pinterest): la
 * tarjeta activa al centro, grande, y las vecinas escalonadas detrás, más
 * chicas y atenuadas. Circular: siempre hay dos a cada lado. Se avanza con las
 * flechas, con el teclado, deslizando o tocando una tarjeta lateral. Sólo
 * reproduce la activa; las laterales muestran el poster.
 *
 * Las laterales son `inert` (no se enfocan ni se clickea su link): un botón
 * transparente encima las vuelve a traer al centro.
 */
export default function ReelsCarousel({
  reels,
  initial,
  labels,
}: {
  reels: ReelItem[];
  initial: number;
  labels: {
    prev: string;
    next: string;
    select: string;
    carousel: string;
    watch: string;
    newTab: string;
    pause: string;
    play: string;
  };
}) {
  const n = reels.length;
  const [active, setActive] = useState(initial);
  const go = useCallback((dir: 1 | -1) => setActive((a) => (a + dir + n) % n), [n]);
  const startX = useRef<number | null>(null);

  // Distancia circular al activo: -2..2 con cinco reels.
  const offsetOf = (i: number) => {
    let d = (i - active + n) % n;
    if (d > n / 2) d -= n;
    return d;
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
  };
  const onDown = (e: PointerEvent) => { startX.current = e.clientX; };
  const onUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.carousel}
      onKeyDown={onKey}
    >
      <ul
        className={styles.stage}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (startX.current = null)}
      >
        {reels.map((r, i) => {
          const off = offsetOf(i);
          const isActive = off === 0;
          const cls = r.focus === "bottom" ? `${styles.video} ${styles.focusBottom}` : styles.video;
          return (
            <li
              key={r.id}
              className={cn(styles.reel, isActive && styles.reelActive)}
              data-offset={off}
              aria-hidden={!isActive || undefined}
            >
              <div className={styles.reelInner} inert={!isActive || undefined}>
                {/* Poster como <img loading="lazy"> debajo del video y no como
                    atributo poster, que se descarga siempre (perf oct-2026). */}
                <AmbientVideo
                  src={r.video}
                  before={
                    // eslint-disable-next-line @next/next/no-img-element -- poster ya optimizado (540px)
                    <img src={r.poster} alt="" loading="lazy" decoding="async" className={cls} />
                  }
                  preload="none"
                  playInView
                  active={isActive}
                  wrapClassName={styles.media}
                  className={cls}
                  toggle={{
                    pauseLabel: labels.pause.replace("{reel}", r.caption),
                    playLabel: labels.play.replace("{reel}", r.caption),
                    className: styles.toggle,
                  }}
                />
                <ReelsGlyph className={styles.glyph} />
                <div className={styles.caption}>
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className={styles.author}>
                    <Image src="/images/socials/avatar.webp" alt="" width={30} height={30} className={styles.avatar} />
                    <span className={styles.handle}>relier</span>
                    <span className={styles.srOnly}>
                      {" "}{labels.watch}: {r.caption} {labels.newTab}
                    </span>
                  </a>
                  <p className={styles.captionText} aria-hidden="true">{r.caption}</p>
                </div>
              </div>
              {!isActive && (
                <button
                  type="button"
                  className={styles.pick}
                  tabIndex={-1}
                  aria-label={labels.select.replace("{reel}", r.caption)}
                  onClick={() => setActive(i)}
                />
              )}
            </li>
          );
        })}
      </ul>

      <div className={styles.arrows}>
        <button type="button" className={styles.arrow} onClick={() => go(-1)} aria-label={labels.prev}>
          <ChevronIcon direction="left" size={14} />
        </button>
        <button type="button" className={styles.arrow} onClick={() => go(1)} aria-label={labels.next}>
          <ChevronIcon direction="right" size={14} />
        </button>
      </div>
    </div>
  );
}
