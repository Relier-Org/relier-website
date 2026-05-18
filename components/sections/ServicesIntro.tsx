import { cn } from "@/lib/utils/cn";
import Reveal from "@/components/effects/Reveal";
import styles from "./ServicesIntro.module.css";

export default function ServicesIntro() {
  return (
    <section className={styles.section}>
      <div className={cn("container", styles.container)}>
        <Reveal className={styles.eyebrowRow}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.eyebrow}>Why Relier</span>
        </Reveal>
        <Reveal className={styles.body} delay={0.05}>
          Whether you’re a business traveler in need of a reliable airport transfer or
          a discerning tourist seeking to explore the city’s iconic landmarks, our
          transportation service is designed to cater to your specific needs. Our
          meticulously maintained fleet offers a range of high-end vehicles, ensuring
          both comfort and style throughout your ride.
        </Reveal>
      </div>
    </section>
  );
}
