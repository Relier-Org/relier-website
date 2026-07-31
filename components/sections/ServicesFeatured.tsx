import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import TextCTA from "@/components/ui/TextCTA";
import Reveal from "@/components/effects/Reveal";
import { WC_FEATURED } from "@/lib/services/data";
import styles from "./ServicesFeatured.module.css";

export default function ServicesFeatured() {
  const post = WC_FEATURED;
  const t = useTranslations("wc.featured");
  const ts = useTranslations("services.featured");
  const tc = useTranslations("common");
  const title = t("title");

  return (
    <section className={styles.section}>
      <div className={cn("container", styles.container)}>
        <Reveal className={styles.eyebrowRow}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.sectionLabel}>{ts("label")}</span>
        </Reveal>
        <Reveal className={styles.card} delay={0.05}>
          <Link href={post.href} className={styles.imageWrap} aria-label={title}>
            <Image
              src={post.cover}
              alt={t("coverAlt")}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className={styles.image}
            />
          </Link>
          <div className={styles.content}>
            <span className={styles.tag}>{tc("fifaWorldCup2026")}</span>
            <h2 className={styles.title}>
              <Link href={post.href}>{title}</Link>
            </h2>
            <p className={styles.lead}>{t("tagline")}</p>
            <TextCTA href={post.href} tone="light" className={styles.cta}>
              {tc("planWorldCupTransport")}
            </TextCTA>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
