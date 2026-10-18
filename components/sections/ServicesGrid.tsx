import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import Reveal from "@/components/effects/Reveal";
import ServiceCard from "@/components/services/ServiceCard";
import { SERVICES } from "@/lib/services/data";
import styles from "./ServicesGrid.module.css";

export default function ServicesGrid() {
  const t = useTranslations("services.grid");

  return (
    <section className={styles.section}>
      <div className={cn("container", styles.container)}>
        <Reveal className={styles.header}>
          <p className={styles.eyebrow}>
            {t("eyebrow")}
          </p>
          <h2 className={styles.title}>{t("title")}</h2>
        </Reveal>

        <div className={styles.grid}>
          {SERVICES.map((service, i) => (
            <Reveal key={service.slug} delay={Math.min(i * 0.06, 0.24)}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
