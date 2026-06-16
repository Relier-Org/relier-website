import { cn } from "@/lib/utils/cn";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          poster="/videos/hero/horizontal-poster.jpg"
        >
          {/* Mobile portrait: vertical 720x1280 framing keeps the subject in view. */}
          <source
            src="/videos/hero/vertical.mp4"
            type="video/mp4"
            media="(max-width: 720px)"
          />
          <source src="/videos/hero/horizontal.mp4" type="video/mp4" />
        </video>
      </div>
      <div className={cn("container", styles.inner)}>
        <p className={cn("eyebrow", styles.eyebrow)}>
          Worldwide Executive Car Service Company · Virtuoso Preferred
        </p>
        <h1 className={styles.h1}>
          Ride premium,
          <br />
          <span className={styles.muted}>arrive in style.</span>
        </h1>
        <p className={styles.subtitle}>
          Where private transfers &amp; transportation begins. From New York to
          the World. Operating more than 500 cities worldwide.
        </p>
      </div>
    </section>
  );
}
