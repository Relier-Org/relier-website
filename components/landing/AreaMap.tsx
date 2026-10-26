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
        <div id="area-panel" role="tabpanel" aria-labelledby={`area-tab-${active}`} className={styles.places}>
          <h3 className={styles.placesTitle}>{r.name}</h3>
          <p className={styles.placesList}>{r.places.join(" · ")}</p>
        </div>
      </div>

      <div className={styles.map} aria-hidden="true">
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className={styles.svg}>
          <g className={styles.context}>
            {CONTEXT_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          {REGION_PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              className={cn(styles.region, i === shown && styles.regionOn)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setActive(i)}
            />
          ))}
          {MAP_AIRPORTS.map((a) => (
            <g key={a.code} transform={`translate(${a.x} ${a.y})`} className={styles.airport}>
              <circle r="9" className={styles.pinHalo} />
              <circle r="4.5" className={styles.pin} />
              <text x="12" y="4">{a.code}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
