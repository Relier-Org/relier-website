import { cn } from "@/lib/utils/cn";
import Reveal from "@/components/effects/Reveal";
import styles from "./TestimonialsIntro.module.css";

export default function TestimonialsIntro() {
  return (
    <section className={styles.section}>
      <div className={cn("container", styles.container)}>
        <Reveal className={styles.eyebrowRow}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.eyebrow}>On the road with us</span>
        </Reveal>
        <Reveal className={styles.body} delay={0.05}>
          Our clients consistently praise us for our impeccable service, professionalism,
          and reliability. Backed by expert chauffeurs with deep knowledge of each city,
          our worldwide transportation service ensures smooth, efficient, and personalized
          journeys—reflected in the many 5-star reviews we are proud to receive.
        </Reveal>
      </div>
    </section>
  );
}
