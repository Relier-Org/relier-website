import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import styles from "./ContactHero.module.css";

export default function ContactHero() {
  const t = useTranslations("pages");
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
        <p className={cn("eyebrow", styles.eyebrow)}>
          {t("contact.hero.eyebrow")}
        </p>
        <h1 className={styles.h1}>{t("contact.hero.title")}</h1>
        <p className={styles.lead}>{t("contact.hero.lead")}</p>
      </div>
    </section>
  );
}
