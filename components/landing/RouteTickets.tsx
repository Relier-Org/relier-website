import Reveal from "@/components/effects/Reveal";
import type { Item } from "./Landing";
import { cn } from "@/lib/utils/cn";
import styles from "./RouteTickets.module.css";

/** Avión mirando a la derecha. */
function Plane({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z" transform="rotate(90 12 12)" />
    </svg>
  );
}

/** Código de barras decorativo, estable por ruta (anchos según las letras). */
function Barcode({ seed }: { seed: string }) {
  const bars: number[] = [];
  for (let i = 0; i < 26; i++) bars.push(1 + ((seed.charCodeAt(i % seed.length) * (i + 7)) % 3));
  let x = 0;
  return (
    <svg className={styles.barcode} viewBox="0 0 80 28" preserveAspectRatio="none" aria-hidden="true">
      {bars.map((w, i) => {
        const r = <rect key={i} x={x} y="0" width={w} height="28" />;
        x += w + 1.2;
        return r;
      })}
    </svg>
  );
}

/**
 * Rutas como pasajes de avión (Airports, Nico 26-oct-2026): cuerpo con el
 * encabezado de Relier, campos From / To y el texto de la ruta, y a la derecha
 * el talón (perforación vertical con muescas, código de origen y código de
 * barras). El título "ORIGEN › DESTINO" se parte en los dos campos y queda
 * completo como nombre accesible.
 */
export default function RouteTickets({
  items,
  labels,
  className,
}: {
  items: Item[];
  labels: { pass: string; from: string; to: string };
  className?: string;
}) {
  return (
    <ul className={cn(styles.tickets, className)}>
      {items.map((it, i) => {
        const [from, to] = it.title.split(" › ");
        // El talón repite el mismo origen que el cuerpo, un código por línea.
        const codes = from.split(" · ");
        return (
          <Reveal as="li" key={it.title} className={styles.ticket} delay={Math.min(i * 0.06, 0.24)}>
            <div className={styles.main}>
              <p className={styles.top} aria-hidden="true">
                <span className={styles.brand}>
                  <span className={styles.ring} />
                  Relier
                </span>
                <span>{labels.pass}</span>
              </p>
              <h3 className={styles.route} aria-label={it.title}>
                <span className={styles.field} aria-hidden="true">
                  <span className={styles.label}>{labels.from}</span>
                  <span className={styles.from}>{from}</span>
                </span>
                <span className={styles.path} aria-hidden="true">
                  <Plane />
                </span>
                <span className={cn(styles.field, styles.fieldTo)} aria-hidden="true">
                  <span className={styles.label}>{labels.to}</span>
                  <span className={styles.to}>{to}</span>
                </span>
              </h3>
              <p className={styles.body}>{it.body}</p>
            </div>
            <div className={styles.stub} aria-hidden="true">
              <span className={styles.label}>{labels.from}</span>
              <span className={styles.stubCodes}>
                {codes.map((c) => (
                  <span key={c} className={styles.stubCode}>{c}</span>
                ))}
              </span>
              <Plane className={styles.stubPlane} />
              <Barcode seed={it.title} />
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}
