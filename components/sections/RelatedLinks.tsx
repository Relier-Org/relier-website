import Reveal from "@/components/effects/Reveal";
import TextCTA from "@/components/ui/TextCTA";
import { cn } from "@/lib/utils/cn";
import styles from "./RelatedLinks.module.css";

export type RelatedLink = { href: string; label: string };

interface RelatedLinksProps {
  eyebrow: string;
  title: string;
  links: RelatedLink[];
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
          <ul className={styles.list}>
            {links.map((l) => (
              <li key={l.href}>
                <TextCTA href={l.href}>{l.label}</TextCTA>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
