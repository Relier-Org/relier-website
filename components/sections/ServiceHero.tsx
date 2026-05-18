import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import styles from "./ServiceHero.module.css";

interface ServiceHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
}

export default function ServiceHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt = "",
}: ServiceHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className={styles.img}
        />
      </div>
      <div className={cn("container", styles.inner)}>
        <p className={cn("eyebrow", styles.eyebrow)}>{eyebrow}</p>
        <h1 className={styles.h1}>{title}</h1>
        {subtitle && <p className={styles.lead}>{subtitle}</p>}
      </div>
    </section>
  );
}
