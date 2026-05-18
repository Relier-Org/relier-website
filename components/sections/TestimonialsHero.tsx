import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import GoogleIcon from "@/components/icons/GoogleIcon";
import {
  GOOGLE_RATING,
  GOOGLE_REVIEW_COUNT,
} from "@/lib/testimonials/data";
import styles from "./TestimonialsHero.module.css";

export default function TestimonialsHero() {
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
        <p className={cn("eyebrow", styles.eyebrow)}>Testimonials</p>
        <h1 className={styles.h1}>
          Real travelers,
          <br />
          <span className={styles.muted}>real journeys.</span>
        </h1>
        <p className={styles.lead}>
          {GOOGLE_REVIEW_COUNT}+ verified reviews across Google, Tripadvisor and Birdeye, rating
          us {GOOGLE_RATING.toFixed(1)} out of 5.
        </p>
        <div className={styles.ratingBadge}>
          <GoogleIcon size={16} />
          <span className={styles.ratingValue}>{GOOGLE_RATING.toFixed(1)}</span>
          <span className={styles.ratingStars} aria-hidden="true">★★★★★</span>
          <span className={styles.ratingDot} aria-hidden="true">·</span>
          <span className={styles.ratingCount}>
            {GOOGLE_REVIEW_COUNT} reviews
          </span>
        </div>
      </div>
    </section>
  );
}
