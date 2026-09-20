import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import Reveal from "@/components/effects/Reveal";
import TextCTA from "@/components/ui/TextCTA";
import styles from "./ServicesIntro.module.css";

export default function ServicesIntro() {
  const t = useTranslations("services.intro");
  const tl = useTranslations("services.intro.links");

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
        {/* Internal linking (roadmap SEO sep-2026): el hub de servicios abre
            ruta hacia el hub B2B y refuerza la landing de aeropuerto, que no
            está entre las 4 cards de abajo. */}
        <Reveal className={styles.links} delay={0.1}>
          <TextCTA href="/for-business" tone="light">
            {tl("business")}
          </TextCTA>
          <TextCTA href="/airport" tone="light">
            {tl("airport")}
          </TextCTA>
        </Reveal>
      </div>
    </section>
  );
}
