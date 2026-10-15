import Reveal from "@/components/effects/Reveal";
import SegmentCards, {
  type SegmentCard,
} from "@/components/sections/SegmentCards";
import { cn } from "@/lib/utils/cn";
import styles from "./RelatedLinks.module.css";

interface RelatedLinksProps {
  eyebrow: string;
  title: string;
  /** Las cards compactas de SegmentCards (ícono, título, texto, link): el
      `cta` de cada una es el anchor del plan de internal linking. */
  items: SegmentCard[];
  className?: string;
}

/**
 * Banda de links contextuales al pie de una página (Fleet): un encabezado y
 * las cards compactas que ya usan el home y About, en vez de una lista de
 * botones (Nico, oct-2026: reutilizar componentes). Los anchors siguen siendo
 * los del plan de internal linking (roadmap SEO sep-2026, T17).
 */
export default function RelatedLinks({
  eyebrow,
  title,
  items,
  className,
}: RelatedLinksProps) {
  return (
    <section className={cn(styles.section, className)}>
      <div className="container">
        <Reveal className={styles.head}>
          <p className={cn("eyebrow", styles.eyebrow)}>{eyebrow}</p>
          <h2 className={styles.title}>{title}</h2>
        </Reveal>
        <SegmentCards
          items={items}
          className={items.length === 3 ? styles.grid3 : undefined}
        />
      </div>
    </section>
  );
}
