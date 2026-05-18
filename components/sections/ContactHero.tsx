import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import styles from "./ContactHero.module.css";

export default function ContactHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <Image
          src="/images/contact-hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.img}
        />
      </div>
      <div className={cn("container", styles.inner)}>
        <p className={cn("eyebrow", styles.eyebrow)}>Get in touch</p>
        <h1 className={styles.h1}>
          Customer support,
          <br />
          <span className={styles.muted}>made personal.</span>
        </h1>
        <p className={styles.lead}>
          If you need something tailored to your needs, reach out — we&apos;re
          here to assist you and will get back to you promptly.
        </p>
      </div>
    </section>
  );
}
