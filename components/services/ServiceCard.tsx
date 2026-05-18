import Image from "next/image";
import Link from "next/link";
import TextCTA from "@/components/ui/TextCTA";
import type { ServiceItem } from "@/lib/services/data";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
  service: ServiceItem;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className={styles.card}>
      <Link
        href={service.href}
        className={styles.imageWrap}
        aria-label={service.title}
        tabIndex={-1}
      >
        <Image
          src={service.cover}
          alt={service.coverAlt}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 50vw"
          className={styles.image}
        />
      </Link>
      <div className={styles.content}>
        <p className={styles.tagline}>{service.tagline}</p>
        <h3 className={styles.title}>
          <Link href={service.href}>{service.title}</Link>
        </h3>
        <TextCTA href={service.href} tone="light" className={styles.cta}>
          Learn more
        </TextCTA>
      </div>
    </article>
  );
}
