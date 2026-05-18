import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import TextCTA from "@/components/ui/TextCTA";
import Reveal from "@/components/effects/Reveal";
import { WC_FEATURED } from "@/lib/services/data";
import styles from "./ServicesFeatured.module.css";

export default function ServicesFeatured() {
  const post = WC_FEATURED;
  return (
    <section className={styles.section}>
      <div className={cn("container", styles.container)}>
        <Reveal className={styles.eyebrowRow}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.sectionLabel}>Featured · Now booking</span>
        </Reveal>
        <Reveal className={styles.card} delay={0.05}>
          <Link href={post.href} className={styles.imageWrap} aria-label={post.title}>
            <Image
              src={post.cover}
              alt={post.coverAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className={styles.image}
            />
          </Link>
          <div className={styles.content}>
            <span className={styles.tag}>FIFA World Cup 2026</span>
            <h2 className={styles.title}>
              <Link href={post.href}>{post.title}</Link>
            </h2>
            <p className={styles.lead}>{post.tagline}</p>
            <TextCTA href={post.href} tone="light" className={styles.cta}>
              Plan your World Cup transport
            </TextCTA>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
