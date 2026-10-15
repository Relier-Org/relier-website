import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./ServiceHero.module.css";

interface ServiceHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  /** Page-level hook, for framing a photo the shared crop doesn't suit. */
  className?: string;
  /** Botones bajo el subtítulo (landings B2B, oct-2026). */
  actions?: ReactNode;
}

export default function ServiceHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt = "",
  className,
  actions,
}: ServiceHeroProps) {
  return (
    <section className={cn(styles.hero, className)}>
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
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </section>
  );
}
