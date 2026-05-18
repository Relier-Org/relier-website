import { cn } from "@/lib/utils/cn";
import Reveal from "@/components/effects/Reveal";
import ServiceCard from "@/components/services/ServiceCard";
import { SERVICES } from "@/lib/services/data";
import styles from "./ServicesGrid.module.css";

export default function ServicesGrid() {
  return (
    <section className={styles.section}>
      <div className={cn("container", styles.container)}>
        <Reveal className={styles.header}>
          <p className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            Core services
          </p>
          <h2 className={styles.title}>Built for every kind of journey.</h2>
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
