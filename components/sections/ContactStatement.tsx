import Reveal from "@/components/effects/Reveal";
import styles from "./ContactStatement.module.css";

export default function ContactStatement() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal>
          <div className={styles.content}>
            <span className={styles.rule} aria-hidden="true" />
            <p className={styles.statement}>
              We go above and beyond to ensure every travel experience is
              tailored to your preferences. Our team of dedicated professionals
              is highly experienced in navigating global routes and logistics,
              providing efficient and punctual transportation to any
              destination worldwide. Our goal is to exceed your
              expectations&nbsp;— ensuring you arrive on time, with comfort and
              in utmost luxury.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
