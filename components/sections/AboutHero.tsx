import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import styles from "./AboutHero.module.css";

export default function AboutHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <Image
          src="/images/about-hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.img}
        />
      </div>
      <div className={cn("container", styles.inner)}>
        <p className={cn("eyebrow", styles.eyebrow)}>About Relier</p>
        <h1 className={styles.h1}>
          A seamless way to travel
          <br />
          <span className={styles.muted}>anywhere in the world.</span>
        </h1>
      </div>
    </section>
  );
}
