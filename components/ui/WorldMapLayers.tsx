"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Las dos capas del mapa de cobertura (continentes y puntos), enmascaradas con
 * /images/world-map.svg (perf oct-2026). Una máscara CSS se descarga apenas se
 * aplica el estilo, aunque la sección esté lejos: eran 112 kB en la carga
 * inicial. La máscara entra por `--world-map` recién a 800px de la pantalla;
 * hasta entonces las capas no se pintan, así que nunca se ven sin máscara.
 */
export default function WorldMapLayers({
  landClassName,
  dotsClassName,
  as: Tag = "div",
}: {
  landClassName: string;
  dotsClassName: string;
  as?: "div" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties = on
    ? ({ "--world-map": 'url("/images/world-map.svg")' } as CSSProperties)
    : { visibility: "hidden" };

  return (
    <>
      <Tag
        ref={ref as React.Ref<HTMLDivElement & HTMLSpanElement>}
        className={landClassName}
        style={style}
        aria-hidden="true"
      />
      <Tag className={dotsClassName} style={style} aria-hidden="true" />
    </>
  );
}
