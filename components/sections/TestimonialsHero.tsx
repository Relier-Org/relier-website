import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import GoogleIcon from "@/components/icons/GoogleIcon";
import {
  GOOGLE_RATING,
  GOOGLE_REVIEW_COUNT,
} from "@/lib/testimonials/data";
import styles from "./TestimonialsHero.module.css";

export default function TestimonialsHero() {
  const t = useTranslations("pages");
  const tc = useTranslations("common");
  const rating = GOOGLE_RATING.toFixed(1);
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <Image
          src="/images/testimonials/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.img}
        />
      </div>
      <div className={cn("container", styles.inner)}>
        <p className={cn("eyebrow", styles.eyebrow)}>{tc("testimonials")}</p>
        <h1 className={styles.h1}>
          {t("testimonials.hero.titleLine1")}
          <br />
          <span className={styles.muted}>
            {t("testimonials.hero.titleLine2")}
          </span>
        </h1>
        <p className={styles.lead}>
          {t("testimonials.hero.lead", {
            count: GOOGLE_REVIEW_COUNT,
            rating,
          })}
        </p>
        <div className={styles.ratingBadge}>
          <GoogleIcon size={16} />
          <span className={styles.ratingValue}>{rating}</span>
          <span className={styles.ratingStars} aria-hidden="true">★★★★★</span>
          <span className={styles.ratingDot} aria-hidden="true">·</span>
          <span className={styles.ratingCount}>
            {t("testimonials.hero.reviewsCount", { count: GOOGLE_REVIEW_COUNT })}
          </span>
        </div>
      </div>
    </section>
  );
}
