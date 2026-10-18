import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import Reveal from "@/components/effects/Reveal";
import styles from "./TestimonialsIntro.module.css";

export default function TestimonialsIntro() {
  const t = useTranslations("pages");
  return (
    <section className={styles.section}>
      <div className={cn("container", styles.container)}>
        <Reveal className={styles.eyebrowRow}>
          <span className={styles.eyebrow}>
            {t("testimonials.intro.eyebrow")}
          </span>
        </Reveal>
        <Reveal className={styles.body} delay={0.05}>
          {t("testimonials.intro.body")}
        </Reveal>
      </div>
    </section>
  );
}
