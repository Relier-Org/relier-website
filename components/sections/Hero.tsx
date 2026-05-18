import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <Image
          src="/images/home/airport.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.img}
        />
      </div>
      <div className={cn("container", styles.inner)}>
        <p className={cn("eyebrow", styles.eyebrow)}>
          Personal mobility concierge · Virtuoso Preferred
        </p>
        <h1 className={styles.h1}>
          Ride premium,
          <br />
          <span className={styles.muted}>arrive in style.</span>
        </h1>
        <p className={styles.subtitle}>
          Where luxury travel begins. Concierge transport from New York and
          Barcelona to wherever you go.
        </p>
      </div>
    </section>
  );
}
