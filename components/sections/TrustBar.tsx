import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils/cn";
import styles from "./TrustBar.module.css";

export type TrustBadge = {
  name: string;
  src: string;
  href?: string;
  modifier?: keyof typeof styles;
};

// Los -v2 son los logos re-encodeados a la medida (perf oct-2026). Con caché
// larga y sin hash en el nombre, un archivo reemplazado se renombra: si no,
// Cloudflare sigue sirviendo el viejo.
const BADGES: TrustBadge[] = [
  {
    name: "Virtuoso Preferred Partner",
    src: "/images/partners/virtuoso.svg",
    href: "https://www.virtuoso.com/",
  },
  {
    name: "National Limousine Association",
    src: "/images/partners/nla-v2.webp",
    href: "https://www.limo.org/",
    modifier: "logoFlip",
  },
  {
    name: "NYC Association of Hotel Concierges",
    src: "/images/partners/nycahc-v2.webp",
    href: "https://nycahc.org/",
    modifier: "logoFlip",
  },
  {
    name: "PAX Professional Chauffeur Certification",
    src: "/images/partners/pax-v2.webp",
    href: "https://paxtraining.com/courses/chauffeur-certification/",
    modifier: "logoSeal",
  },
  // TODO (assets): sumar "Chauffeur Driven" cuando llegue el asset del cliente.
];

/**
 * Banda de logos ("In service of" por defecto). Con `label`, `badges` y `note`
 * se reusa para otras tiras, p. ej. las ferias de Travel Advisors (oct-2026).
 */
export default async function TrustBar({
  label,
  badges = BADGES,
  note,
}: {
  label?: string;
  badges?: TrustBadge[];
  /** Texto corrido bajo los logos: nombra lo que muestran (lectores y AI). */
  note?: string;
} = {}) {
  const t = await getTranslations("home");

  return (
    <section className={styles.trust}>
      <div className={cn("container", styles.inner)}>
        <span className={styles.label}>{label ?? t("trust.label")}</span>
        {/* En mobile los logos corren como carrusel infinito (Nico, 18-oct-2026):
            la segunda tanda es la copia que cierra el loop, fuera del árbol
            accesible. En desktop la copia no se muestra y la pista no existe
            como caja (display: contents). */}
        <div className={styles.rail}>
          <div className={styles.track}>
            {[false, true].map((copy) =>
              badges.map(({ name, src, href, modifier }) => {
                const logo = (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={copy ? "" : name}
                    className={cn(styles.logo, modifier && styles[modifier])}
                    loading="lazy"
                  />
                );
                const cls = cn(styles.badge, copy && styles.copy);
                return href ? (
                  <a
                    key={`${copy}-${name}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                    aria-label={copy ? undefined : name}
                    aria-hidden={copy || undefined}
                    tabIndex={copy ? -1 : undefined}
                    title={name}
                  >
                    {logo}
                  </a>
                ) : (
                  <span
                    key={`${copy}-${name}`}
                    className={cls}
                    title={name}
                    aria-hidden={copy || undefined}
                  >
                    {logo}
                  </span>
                );
              })
            )}
          </div>
        </div>
        {note ? <p className={styles.note}>{note}</p> : null}
      </div>
    </section>
  );
}
