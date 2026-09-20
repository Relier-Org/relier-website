import Image from "next/image";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/effects/Reveal";
import TextCTA from "@/components/ui/TextCTA";
import { cn } from "@/lib/utils/cn";
import styles from "./SegmentCards.module.css";

export type SegmentCard = {
  id: string;
  href: string;
  title: string;
  body: string;
  /**
   * Texto del link. Es el anchor que Google lee, así que viene del plan de
   * internal linking del equipo de SEO y no de un "Learn more" genérico.
   */
  cta: string;
  image?: string;
  imageAlt?: string;
};

interface SegmentCardsProps {
  items: SegmentCard[];
  className?: string;
}

/**
 * Grilla de los segmentos B2B. La usan el hub /for-business/ (con foto) y el
 * bloque "Work with Relier" del home (sin foto, más compacto).
 */
export default function SegmentCards({ items, className }: SegmentCardsProps) {
  return (
    <div className={cn(styles.grid, className)}>
      {items.map((item, i) => (
        <Reveal
          key={item.id}
          as="article"
          className={styles.card}
          delay={Math.min(i * 0.06, 0.24)}
        >
          {item.image ? (
            <Link
              href={item.href}
              className={styles.media}
              aria-label={item.title}
              tabIndex={-1}
            >
              <Image
                src={item.image}
                alt={item.imageAlt ?? ""}
                fill
                sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={styles.img}
              />
            </Link>
          ) : null}
          <div className={styles.content}>
            <h3 className={styles.title}>
              <Link href={item.href}>{item.title}</Link>
            </h3>
            <p className={styles.body}>{item.body}</p>
            <TextCTA href={item.href} className={styles.cta}>
              {item.cta}
            </TextCTA>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
