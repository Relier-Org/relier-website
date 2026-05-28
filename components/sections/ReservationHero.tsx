import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import styles from "./ReservationHero.module.css";

export default function ReservationHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <Image
          src="/images/online-reservation/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.img}
        />
      </div>
      <div className={cn("container", styles.inner)}>
        <p className={cn("eyebrow", styles.eyebrow)}>Online reservation</p>
        <h1 className={styles.h1}>
          Make Your
          <br />
          <span className={styles.muted}>Reservation.</span>
        </h1>
        <p className={styles.lead}>Turn your trip into an experience.</p>
      </div>
    </section>
  );
}
