"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Video de fondo decorativo (muted, loop) que respeta prefers-reduced-motion:
// sin autoplay con la preferencia activa (queda el poster) y reacciona si el
// usuario la cambia con la página abierta. No lleva el atributo autoPlay: el
// play() lo da el efecto según la preferencia, así no arrancan frames antes de
// hidratar. Sin JS se ve el poster.
//
// `toggle` agrega un botón de pausa/reanudar (WCAG 2.2.2: loop de más de 5 s).
// Una vez que el usuario lo usa, su elección manda también sobre la
// preferencia de movimiento reducido.
//
// `playInView`: sólo reproduce mientras el video está en pantalla (los reels
// de la sección social del home: tres videos a la vez no tienen que correr ni
// bajar datos fuera de vista).
//
// `deferUntilLoad`: no pide el video hasta después del `load` de la página
// (perf oct-2026: el del hero bajaba en paralelo al LCP). `before` va dentro
// del wrap, debajo del video: ahí se pinta el poster como imagen prioritaria.
// Con Save-Data activo no hay autoplay, igual que con movimiento reducido.

interface AmbientVideoProps {
  className?: string;
  poster?: string;
  src?: string;
  preload?: "none" | "metadata" | "auto";
  /** Envuelve el <video> en un div con esta clase; el botón queda fuera, como
   *  hermano, para poder apilarse por encima del contenido de la sección. */
  wrapClassName?: string;
  toggle?: { pauseLabel: string; playLabel: string; className?: string };
  playInView?: boolean;
  deferUntilLoad?: boolean;
  before?: ReactNode;
  /** Usa como poster del <video> la imagen ya cargada en `before` (la variante
   *  que eligió el navegador), así el video cuenta para el LCP por su poster y
   *  no por el primer frame, que llega después del load. */
  mirrorPoster?: boolean;
  children?: ReactNode;
}

export default function AmbientVideo({
  className,
  poster,
  src,
  preload = "metadata",
  wrapClassName,
  toggle,
  playInView = false,
  deferUntilLoad = false,
  before,
  mirrorPoster = false,
  children,
}: AmbientVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  // null hasta montar: en SSR no se sabe la preferencia y no se reproduce.
  const [reduced, setReduced] = useState<boolean | null>(null);
  const [choice, setChoice] = useState<"play" | "pause" | null>(null);
  // Primer frame reproducido: a partir de ahí el video tapa lo que haya en
  // `before` (el wrap lo expone como data-started para el CSS).
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData === true;
    const sync = () => setReduced(mq.matches || saveData);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Sin `playInView` cuenta como siempre visible.
  const [inView, setInView] = useState(!playInView);

  useEffect(() => {
    const video = ref.current;
    if (!playInView || !video) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [playInView]);

  useEffect(() => {
    const video = ref.current;
    if (!mirrorPoster || !video) return;
    const img = video.parentElement?.querySelector("img");
    if (!img) return;
    const apply = () => {
      if (img.currentSrc) video.poster = img.currentSrc;
    };
    if (img.complete) apply();
    else img.addEventListener("load", apply, { once: true });
    return () => img.removeEventListener("load", apply);
  }, [mirrorPoster]);

  // Sin `deferUntilLoad` cuenta como ya cargada.
  const [pageLoaded, setPageLoaded] = useState(!deferUntilLoad);

  useEffect(() => {
    if (!deferUntilLoad) return;
    const done = () => setPageLoaded(true);
    if (document.readyState === "complete") done();
    else window.addEventListener("load", done, { once: true });
    return () => window.removeEventListener("load", done);
  }, [deferUntilLoad]);

  const wantsPlay = choice ? choice === "play" : reduced === false;
  // Un play() pedido por el usuario no espera al load.
  const shouldPlay = wantsPlay && inView && (pageLoaded || choice === "play");
  const hasToggle = Boolean(toggle);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!shouldPlay) {
      video.pause();
      return;
    }
    // React no siempre refleja `muted` al hidratar, y sin muted el play() sin
    // gesto se rechaza.
    video.muted = true;
    let cancelled = false;
    video.play().catch(() => {
      // Autoplay bloqueado (ahorro de batería, política del browser): el botón
      // tiene que decir la verdad y ofrecer "reproducir".
      if (!cancelled && hasToggle) setChoice("pause");
    });
    return () => {
      cancelled = true;
    };
  }, [shouldPlay, hasToggle]);

  const video = (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={preload}
      aria-hidden="true"
      onPlaying={() => setStarted(true)}
    >
      {children}
    </video>
  );

  return (
    <>
      {wrapClassName ? (
        <div className={wrapClassName} data-started={started || undefined}>
          {before}
          {video}
        </div>
      ) : (
        video
      )}
      {toggle && (
        <button
          type="button"
          className={toggle.className}
          aria-label={wantsPlay ? toggle.pauseLabel : toggle.playLabel}
          onClick={() => setChoice(wantsPlay ? "pause" : "play")}
        >
          {wantsPlay ? (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
              <rect x="0" y="0" width="3" height="12" rx="0.5" />
              <rect x="7" y="0" width="3" height="12" rx="0.5" />
            </svg>
          ) : (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
              <path d="M0 0.8v10.4a0.6 0.6 0 0 0 0.9 0.5l8.6-5.2a0.6 0.6 0 0 0 0-1L0.9 0.3A0.6 0.6 0 0 0 0 0.8z" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
