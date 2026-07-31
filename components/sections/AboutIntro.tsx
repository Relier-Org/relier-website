import { useTranslations } from "next-intl";
import Reveal from "@/components/effects/Reveal";
import styles from "./AboutIntro.module.css";

export default function AboutIntro() {
  const t = useTranslations("pages");
  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal className={styles.content}>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.lead}>
            {t("about.intro.lead")}{" "}
            <span className={styles.accent}>{t("about.intro.leadAccent")}</span>
          </p>
          <p className={styles.support}>{t("about.intro.support")}</p>
        </Reveal>
      </div>
    </section>
  );
}
