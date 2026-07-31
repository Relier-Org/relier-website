import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import styles from "./BlogHero.module.css";

export default function BlogHero() {
  const t = useTranslations("blog");
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
        <p className={cn("eyebrow", styles.eyebrow)}>{t("hero.eyebrow")}</p>
        <h1 className={styles.h1}>
          {t("hero.titleLine1")}
          <br />
          <span className={styles.muted}>{t("hero.titleLine2")}</span>
        </h1>
        <p className={styles.lead}>{t("hero.lead")}</p>
      </div>
    </section>
  );
}
