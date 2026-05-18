import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import styles from "./BlogHero.module.css";

export default function BlogHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <Image
          src="/images/blog/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.img}
        />
      </div>
      <div className={cn("container", styles.inner)}>
        <p className={cn("eyebrow", styles.eyebrow)}>Journal</p>
        <h1 className={styles.h1}>
          News & insights
          <br />
          <span className={styles.muted}>from the road.</span>
        </h1>
        <p className={styles.lead}>
          Stories, itineraries, and field notes from our chauffeurs and concierge desks across the Americas, Europe, and the Middle East.
        </p>
      </div>
    </section>
  );
}
