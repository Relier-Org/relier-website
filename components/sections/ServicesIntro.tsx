import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import Reveal from "@/components/effects/Reveal";
import styles from "./ServicesIntro.module.css";

export default function ServicesIntro() {
  const t = useTranslations("services.intro");

  return (
    <section className={styles.section}>
      <div className={cn("container", styles.container)}>
        <Reveal className={styles.eyebrowRow}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.eyebrow}>{t("eyebrow")}</span>
        </Reveal>
        <Reveal className={styles.body} delay={0.05}>
          {t("body")}
        </Reveal>
      </div>
    </section>
  );
}
