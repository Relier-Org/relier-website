import Reveal from "@/components/effects/Reveal";
import type { Item } from "./Landing";
import { cn } from "@/lib/utils/cn";
import styles from "./RouteTickets.module.css";

/** Avión de perfil, mirando a la derecha. */
function Plane() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z" transform="rotate(90 12 12)" />
    </svg>
  );
}

/**
 * Rutas como pases de abordar (Airports, Nico 26-oct-2026): el título
 * "ORIGEN › DESTINO" se parte en el origen (códigos, en dorado) y el destino,
 * unidos por una línea punteada con un avión; una perforación con muescas
 * separa el talón del texto. El título completo queda como nombre accesible.
 */
export default function RouteTickets({ items, className }: { items: Item[]; className?: string }) {
  return (
    <ul className={cn(styles.tickets, className)}>
      {items.map((it, i) => {
        const [from, to] = it.title.split(" › ");
        return (
          <Reveal as="li" key={it.title} className={styles.ticket} delay={Math.min(i * 0.06, 0.24)}>
            <h3 className={styles.route} aria-label={it.title}>
              <span className={styles.from} aria-hidden="true">{from}</span>
              <span className={styles.path} aria-hidden="true">
                <Plane />
              </span>
              <span className={styles.to} aria-hidden="true">{to}</span>
            </h3>
            <span className={styles.perf} aria-hidden="true" />
            <p className={styles.body}>{it.body}</p>
          </Reveal>
        );
      })}
    </ul>
  );
}
