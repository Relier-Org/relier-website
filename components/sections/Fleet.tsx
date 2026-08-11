"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import TextCTA from "@/components/ui/TextCTA";
import { PassengerIcon, LuggageIcon } from "@/components/icons/FleetIcons";
import { FLEET } from "@/lib/fleet/data";
import { cn } from "@/lib/utils/cn";
import styles from "./Fleet.module.css";

// Showcase "Light Bay" (Claude Design, jul-2026): un solo vehículo en escena
// compuesto directo sobre el canvas obsidian — under-glow champagne, palabra
// gigante de fondo, info centrada y playback bar. Reemplaza el carrusel Embla:
// acá no hay track, el auto entra desde el costado según la dirección y el
// resto vive precargado con opacity 0. Animaciones de entrada en CSS,
// reiniciadas por remount (key={tick}); JS solo lleva índice/dirección/autoplay.

const AUTOPLAY_MS = 6000; // contenido grande (autos) → 6s, premium no apurado.
const SWIPE_THRESHOLD = 40;
const N = FLEET.length;

// La palabra de fondo se dimensiona por cantidad de caracteres para ocupar
// siempre un ancho similar del stage (×0.42 en mobile, via CSS).
const wordSize = (word: string) =>
  word.length <= 5 ? 200 : word.length <= 8 ? 150 : 110;

export default function Fleet() {
  const t = useTranslations("fleet");
  const tc = useTranslations("common");
  const [{ active, dir, tick }, setPos] = useState({
    active: 0,
    dir: 1,
    tick: 0,
  });
  // Sin botón de pausa: el autoplay frena mientras el mouse está sobre la
  // escena o el focus dentro de la sección (equivalente al stopOnMouseEnter/
  // stopOnFocusIn de la versión Embla — mantiene el mecanismo de pausa WCAG).
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef(0);

  const go = useCallback((step: number) => {
    setPos((s) => ({
      active: (s.active + step + N) % N,
      dir: step,
      tick: s.tick + 1,
    }));
  }, []);

  const goTo = useCallback((i: number) => {
    setPos((s) =>
      i === s.active
        ? s
        : { active: i, dir: i > s.active ? 1 : -1, tick: s.tick + 1 }
    );
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Autoplay: un timeout por slide, se reagenda en cada cambio (tick) — la
  // navegación manual resetea el reloj, igual que el diseño original.
  const playing = !hovered && !focused && !reduced;
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [tick, playing, go]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
  };

  const v = FLEET[active];
  const tier = (id: string) => t(`tiers.${id}`);
  const prevTier = tier(FLEET[(active - 1 + N) % N].id);
  const nextTier = tier(FLEET[(active + 1) % N].id);

  return (
    <section
      className={styles.fleet}
      id="fleet"
      onKeyDown={onKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div className={cn("container", styles.inner)}>
        <Reveal className={styles.head}>
          <p className={styles.kicker}>{t("showcase.kicker")}</p>
          <h2 className={styles.title}>{t("showcase.title")}</h2>
          <p className={styles.lead}>{t("showcase.lead")}</p>
        </Reveal>

        <div
          className={styles.stage}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span className={styles.glow} aria-hidden="true" />
          <span
            key={`word-${tick}`}
            className={styles.word}
            aria-hidden="true"
            style={{ "--word-size": `${wordSize(v.word)}px` } as React.CSSProperties}
          >
            {v.word}
          </span>
          <span className={styles.groundShadow} aria-hidden="true" />

          {FLEET.map((c, i) => (
            <div
              key={c.id}
              className={cn(
                styles.car,
                i === active && styles.carActive,
                i === active && dir < 0 && styles.fromLeft
              )}
              aria-hidden={i !== active}
              style={
                {
                  "--car-h": c.stageHeight,
                  "--car-r": (c.width / c.height).toFixed(3),
                } as React.CSSProperties
              }
            >
              <div
                key={i === active ? `anim-${tick}` : "idle"}
                className={styles.carAnim}
              >
                <Image
                  src={c.image}
                  alt={t("showcase.imageAlt", { name: c.name })}
                  fill
                  sizes="(max-width: 760px) 340px, 640px"
                  className={styles.carImg}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            className={cn(styles.sideNav, styles.sidePrev)}
            onClick={() => go(-1)}
          >
            <span aria-hidden="true">‹</span>
            {prevTier}
          </button>
          <button
            type="button"
            className={cn(styles.sideNav, styles.sideNext)}
            onClick={() => go(1)}
          >
            {nextTier}
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <footer className={styles.foot}>
          <div key={`info-${tick}`} className={styles.info}>
            <p className={styles.tier}>{tier(v.id)}</p>
            <h3 className={styles.nameRow}>
              <span className={styles.name}>{v.name}</span>
              {v.orSimilar && (
                <span className={styles.orSimilar}>{tc("orSimilar")}</span>
              )}
            </h3>
            <ul className={styles.specs}>
              <li className={styles.spec}>
                <PassengerIcon className={styles.specIcon} />
                {v.passengers} {tc("passengers")}
              </li>
              {v.luggage !== undefined && (
                <li className={styles.spec}>
                  <span className={styles.specDivider} aria-hidden="true" />
                  <LuggageIcon className={styles.specIcon} />
                  {v.luggage} {tc("luggage")}
                </li>
              )}
            </ul>
          </div>

          <div className={styles.ctaRow}>
            <Button href="#booking">{tc("reserve")}</Button>
            <TextCTA href="/fleet">{t("showcase.exploreFull")}</TextCTA>
          </div>

          <div className={styles.playback}>
            <button
              type="button"
              className={styles.mobArrow}
              aria-label={t("showcase.previousVehicle")}
              onClick={() => go(-1)}
            >
              ‹
            </button>
            <div
              className={styles.dots}
              role="tablist"
              aria-label={t("showcase.categories")}
            >
              {FLEET.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={tier(c.id)}
                  className={cn(styles.dot, i === active && styles.dotActive)}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className={styles.mobArrow}
              aria-label={t("showcase.nextVehicle")}
              onClick={() => go(1)}
            >
              ›
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}
