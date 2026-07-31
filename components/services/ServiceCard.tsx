import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import TextCTA from "@/components/ui/TextCTA";
import type { ServiceItem } from "@/lib/services/data";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
  service: ServiceItem;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const t = useTranslations("services.items");
  const tc = useTranslations("common");
  const title = t(`${service.slug}.title`);

  return (
    <article className={styles.card}>
      <Link
        href={service.href}
        className={styles.imageWrap}
        aria-label={title}
        tabIndex={-1}
      >
        <Image
          src={service.cover}
          alt={t(`${service.slug}.coverAlt`)}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 50vw"
          className={styles.image}
        />
      </Link>
      <div className={styles.content}>
        <p className={styles.tagline}>{t(`${service.slug}.tagline`)}</p>
        <h3 className={styles.title}>
          <Link href={service.href}>{title}</Link>
        </h3>
        <TextCTA href={service.href} tone="light" className={styles.cta}>
          {tc("learnMore")}
        </TextCTA>
      </div>
    </article>
  );
}
