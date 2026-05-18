import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import styles from "./FleetHero.module.css";

export default function FleetHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <Image
          src="/images/fleet-hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.img}
        />
      </div>
      <div className={cn("container", styles.inner)}>
        <p className={cn("eyebrow", styles.eyebrow)}>Our fleet</p>
        <h1 className={styles.h1}>
          Our fleet,
          <br />
          <span className={styles.muted}>always at the ready.</span>
        </h1>
      </div>
    </section>
  );
}
