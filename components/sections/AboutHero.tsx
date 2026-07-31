import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import styles from "./AboutHero.module.css";

export default function AboutHero() {
  const t = useTranslations("pages");
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
        <p className={cn("eyebrow", styles.eyebrow)}>
          {t("about.hero.eyebrow")}
        </p>
        <h1 className={styles.h1}>
          {t("about.hero.titleLine1")}
          <br />
          <span className={styles.muted}>{t("about.hero.titleLine2")}</span>
        </h1>
      </div>
    </section>
  );
}
