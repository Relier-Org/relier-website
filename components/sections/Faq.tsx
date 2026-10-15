import Reveal from "@/components/effects/Reveal";
import { cn } from "@/lib/utils/cn";
import styles from "./Faq.module.css";

export type FaqItem = { q: string; a: string };

/**
 * Preguntas frecuentes con <details> nativo: abre sin JS y el texto completo
 * está en el HTML (lo leen buscadores y asistentes). Cada página que la use
 * suma el nodo FAQPage con las mismas preguntas (criterio T04: sólo con FAQ
 * visible).
 */
export default function Faq({
  eyebrow,
  title,
  items,
  className,
}: {
  eyebrow: string;
  title: string;
  items: FaqItem[];
  className?: string;
}) {
  return (
    <section className={cn(styles.section, className)}>
      <div className={cn("container", styles.inner)}>
        <Reveal className={styles.head}>
          <p className={cn("eyebrow", styles.eyebrow)}>{eyebrow}</p>
          <h2 className={styles.title}>{title}</h2>
        </Reveal>
        <Reveal className={styles.list} delay={0.05}>
          {items.map((it, i) => (
            <details key={it.q} className={styles.item} open={i === 0}>
              <summary className={styles.q}>{it.q}</summary>
              <p className={styles.a}>{it.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
