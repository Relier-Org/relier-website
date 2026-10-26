"use client";

import { useState } from "react";
import { CONTEXT_PATHS, MAP_AIRPORTS, MAP_H, MAP_W, REGION_PATHS } from "@/lib/coverage/nyMap";
import type { Region } from "./Landing";
import { cn } from "@/lib/utils/cn";
import styles from "./AreaMap.module.css";

/**
 * Zona de servicio como mapa interactivo (Airports, Nico 26-oct-2026): las
 * ocho regiones dibujadas con los límites reales de sus condados y los
 * aeropuertos marcados. Al pasar o tocar una región se ilumina y el panel
 * muestra sus barrios. La lista de regiones son botones (teclado y lectores);
 * el mapa es el mismo control para el mouse y queda fuera del árbol accesible.
 */
export default function AreaMap({ regions }: { regions: Region[] }) {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? active;
  const r = regions[shown];

  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <ul className={styles.list} role="tablist" aria-orientation="vertical">
          {regions.map((reg, i) => (
            <li key={reg.name}>
              <button
                type="button"
                role="tab"
                id={`area-tab-${i}`}
                aria-selected={i === active}
                aria-controls="area-panel"
                className={cn(styles.tab, i === shown && styles.tabOn)}
                onClick={() => setActive(i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                {reg.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.map} aria-hidden="true">
        {/* Como el mapa del home: tierra en matriz de puntos dorados sobre
            obsidiana, con un relleno tenue debajo. */}
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className={styles.svg}>
          <defs>
            <pattern id="area-dots" width="7" height="7" patternUnits="userSpaceOnUse">
              <circle cx="3.5" cy="3.5" r="1.1" fill="rgba(201,169,97,0.5)" />
            </pattern>
            <pattern id="area-dots-on" width="7" height="7" patternUnits="userSpaceOnUse">
              <circle cx="3.5" cy="3.5" r="1.7" fill="#e3c27d" />
            </pattern>
          </defs>
          <g className={styles.context}>
            {CONTEXT_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          {REGION_PATHS.map((d, i) => (
            <g
              key={i}
              className={cn(styles.region, i === shown && styles.regionOn)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setActive(i)}
            >
              <path d={d} className={styles.regionFill} />
              <path d={d} className={styles.regionDots} />
            </g>
          ))}
          {MAP_AIRPORTS.map((a) => (
            <g key={a.code} transform={`translate(${a.x} ${a.y})`} className={styles.airport}>
              <circle r="22" className={styles.pinHalo} />
              <circle r="4" className={styles.pin} />
              <text x="11" y="4.5">{a.code}</text>
            </g>
          ))}
        </svg>
      </div>

      {/* Barrios de la región, a la derecha del mapa (Nico). */}
      <div id="area-panel" role="tabpanel" aria-labelledby={`area-tab-${active}`} className={styles.places}>
        <h3 className={styles.placesTitle}>{r.name}</h3>
        <p className={styles.placesList}>{r.places.join(" · ")}</p>
      </div>
    </div>
  );
}
