"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import ClassNames from "embla-carousel-class-names";
import Autoplay from "embla-carousel-autoplay";
import Reveal from "@/components/effects/Reveal";
import TextCTA from "@/components/ui/TextCTA";
import {
  PassengerIcon,
  LuggageIcon,
  PauseIcon,
  PlayIcon,
} from "@/components/icons/FleetIcons";
import ChevronIcon from "@/components/icons/ChevronIcon";
import { FLEET } from "@/lib/fleet/data";
import { cn } from "@/lib/utils/cn";
import styles from "./Fleet.module.css";

// Versión cliente (PDF 04-jun §5): showroom auto-advancing de 6 categorías.
// El competitor research mostró que NADIE auto-avanza con elegancia ni muestra
// pax/valijas directo — eso es lo que hacemos. Embla maneja snap/scroll; el
// estado activo (escala, specs fade-up, glow) es CSS sobre la clase is-snapped
// que aplica el plugin ClassNames (mismo patrón probado del fleet anterior).

const AUTOPLAY_DELAY = 6000; // contenido grande (autos) → 6s, premium no apurado.

// Vista mínima del plugin Autoplay (evita fricción de tipos con el augment).
type AutoplayApi = {
  play: () => void;
  stop: () => void;
  reset: () => void;
  isPlaying: () => boolean;
  timeUntilNext: () => number | null;
};

export default function Fleet() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      loop: true,
      containScroll: false,
      skipSnaps: false,
      duration: 28,
    },
    [
      ClassNames({ snapped: "is-snapped", inView: "is-in-view" }),
      Autoplay({
        delay: AUTOPLAY_DELAY,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
        playOnInit: true,
      }),
    ]
  );

  const [selected, setSelected] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const progressRef = useRef<HTMLDivElement>(null);

  const autoplay = () =>
    (emblaApi?.plugins() as { autoplay?: AutoplayApi } | undefined)?.autoplay;

  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Selección + estado play/pause + arranque reduced-motion.
  useEffect(() => {
    if (!emblaApi) return;
    const ap = autoplay();

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) ap?.stop();

    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    const onPlay = () => setIsPlaying(true);
    const onStop = () => setIsPlaying(false);

    onSelect();
    setIsPlaying(ap?.isPlaying() ?? false);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("autoplay:play", onPlay);
    emblaApi.on("autoplay:stop", onStop);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("autoplay:play", onPlay);
      emblaApi.off("autoplay:stop", onStop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emblaApi]);

  // Progress bar: se llena hacia el próximo slide leyendo timeUntilNext().
  // Cuando está pausado (null) congela su valor → feedback visual de pausa.
  useEffect(() => {
    if (!emblaApi) return;
    let raf = 0;
    const tick = () => {
      const ap = autoplay();
      const left = ap?.timeUntilNext() ?? null;
      const bar = progressRef.current;
      if (bar && left !== null) {
        const pct = Math.min(Math.max(1 - left / AUTOPLAY_DELAY, 0), 1);
        bar.style.transform = `scaleX(${pct})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emblaApi]);

  const togglePlay = () => {
    const ap = autoplay();
    if (!ap) return;
    if (ap.isPlaying()) ap.stop();
    else ap.play();
  };

  // Hot-zones (brief: "al apoyarse a un costado avanza") — solo puntero fino,
  // un avance por entrada para no ser molesto. En touch manda el drag de Embla.
  const onZoneEnter = (dir: "prev" | "next") => () => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (dir === "next") scrollNext();
    else scrollPrev();
  };

  return (
    <section className={styles.fleet} id="fleet">
      <div className="container">
        <Reveal className={styles.head}>
          <div className={styles.headText}>
            <h2 className={styles.title}>
              Our fleet,
              <br />
              <span className="muted">always at the ready.</span>
            </h2>
            <p>
              Six categories, one standard. Always punctual, always immaculate —
              the showcase moves on its own, pause it to take a closer look.
            </p>
          </div>
          <div className={styles.headCta}>
            <TextCTA href="/fleet">Explore the full fleet</TextCTA>
          </div>
        </Reveal>

        <div className={styles.stageWrap}>
          <div className={styles.viewport} ref={emblaRef}>
            <div className={styles.container}>
              {FLEET.map((v) => (
                <div className={styles.slide} key={v.id}>
                  <article className={styles.card}>
                    <div
                      className={styles.stage}
                      style={{ "--car-scale": v.scale } as React.CSSProperties}
                    >
                      <span className={styles.glow} aria-hidden="true" />
                      <div className={styles.car}>
                        <Image
                          src={v.image}
                          alt={v.name}
                          fill
                          sizes="(max-width: 720px) 86vw, (max-width: 1024px) 70vw, 760px"
                          className={styles.carImg}
                        />
                      </div>
                    </div>

                    <div className={styles.meta}>
                      <p className={styles.tier}>{v.tier}</p>
                      <h3 className={styles.name}>
                        {v.name}
                        {v.orSimilar && (
                          <span className={styles.orSimilar}>or similar</span>
                        )}
                      </h3>
                      <dl className={styles.specs}>
                        <div className={styles.spec}>
                          <PassengerIcon className={styles.specIcon} />
                          <dt className={styles.specLabel}>Passengers</dt>
                          <dd className={styles.specValue}>{v.passengers}</dd>
                        </div>
                        {v.luggage !== undefined && (
                          <>
                            <span
                              className={styles.specDivider}
                              aria-hidden="true"
                            />
                            <div className={styles.spec}>
                              <LuggageIcon className={styles.specIcon} />
                              <dt className={styles.specLabel}>Luggage</dt>
                              <dd className={styles.specValue}>
                                {v.luggage} bags
                              </dd>
                            </div>
                          </>
                        )}
                      </dl>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            {/* Hot-zones: hover en un costado avanza (desktop, no intrusivo). */}
            <span
              className={cn(styles.hotZone, styles.hotZonePrev)}
              aria-hidden="true"
              onMouseEnter={onZoneEnter("prev")}
            />
            <span
              className={cn(styles.hotZone, styles.hotZoneNext)}
              aria-hidden="true"
              onMouseEnter={onZoneEnter("next")}
            />

            <button
              type="button"
              className={cn(styles.arrow, styles.arrowPrev)}
              aria-label="Previous vehicle"
              onClick={scrollPrev}
            >
              <ChevronIcon direction="left" size={18} />
            </button>
            <button
              type="button"
              className={cn(styles.arrow, styles.arrowNext)}
              aria-label="Next vehicle"
              onClick={scrollNext}
            >
              <ChevronIcon direction="right" size={18} />
            </button>
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.playBtn}
              aria-label={isPlaying ? "Pause showcase" : "Play showcase"}
              aria-pressed={!isPlaying}
              onClick={togglePlay}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <div className={styles.dots} role="tablist" aria-label="Fleet categories">
              {FLEET.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  role="tab"
                  aria-selected={i === selected}
                  aria-label={v.tier}
                  className={cn(styles.dot, i === selected && styles.dotActive)}
                  onClick={() => scrollTo(i)}
                >
                  <span className={styles.dotLabel}>{v.tier}</span>
                </button>
              ))}
            </div>

            <div className={styles.progress} aria-hidden="true">
              <div ref={progressRef} className={styles.progressBar} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
