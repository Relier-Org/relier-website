import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import styles from "./RelatedLinks.module.css";

export type RelatedLink = { href: string; label: string };

interface RelatedLinksProps {
  eyebrow: string;
  title: string;
  links: RelatedLink[];
  /** Acción principal de la página (p. ej. reservar). Los links van como
      secundarios: nunca un grupo entero en el mismo nivel (jerarquía oct-2026). */
  primary?: RelatedLink;
  className?: string;
}

/**
 * Banda de links contextuales al pie de una página (About, Fleet): un título
 * corto y los anchors descriptivos del plan de internal linking (roadmap SEO
 * sep-2026, T17). Es un módulo del body, no navegación: el plan pide
 * explícitamente no depender sólo del menú y el footer.
 */
export default function RelatedLinks({
  eyebrow,
  title,
  links,
  primary,
  className,
}: RelatedLinksProps) {
  return (
    <section className={cn(styles.section, className)}>
      <div className="container">
        <Reveal className={styles.inner}>
          <div className={styles.text}>
            <p className={cn("eyebrow", styles.eyebrow)}>{eyebrow}</p>
            <h2 className={styles.title}>{title}</h2>
          </div>
          <div className={styles.actions}>
            {primary ? (
              <Button href={primary.href} withArrow>
                {primary.label}
              </Button>
            ) : null}
            <ul className={styles.list}>
              {links.map((l) => (
                <li key={l.href}>
                  <Button href={l.href} variant="secondary">
                    {l.label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
