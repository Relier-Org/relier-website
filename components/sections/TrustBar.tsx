import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils/cn";
import styles from "./TrustBar.module.css";

export type TrustBadge = {
  name: string;
  src: string;
  href?: string;
  modifier?: keyof typeof styles;
};

const BADGES: TrustBadge[] = [
  {
    name: "Virtuoso Preferred Partner",
    src: "/images/partners/virtuoso.svg",
    href: "https://www.virtuoso.com/",
  },
  {
    name: "National Limousine Association",
    src: "/images/partners/nla.webp",
    href: "https://www.limo.org/",
    modifier: "logoFlip",
  },
  {
    name: "NYC Association of Hotel Concierges",
    src: "/images/partners/nycahc.webp",
    href: "https://nycahc.org/",
    modifier: "logoFlip",
  },
  {
    name: "PAX Professional Chauffeur Certification",
    src: "/images/partners/pax.webp",
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
        {badges.map(({ name, src, href, modifier }) => {
          const logo = (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={name}
              className={cn(styles.logo, modifier && styles[modifier])}
              loading="lazy"
            />
          );
          return href ? (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.badge}
              aria-label={name}
              title={name}
            >
              {logo}
            </a>
          ) : (
            <span key={name} className={styles.badge} title={name}>
              {logo}
            </span>
          );
        })}
        {note ? <p className={styles.note}>{note}</p> : null}
      </div>
    </section>
  );
}
