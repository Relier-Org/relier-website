import Reveal from "@/components/effects/Reveal";
import styles from "./AboutIntro.module.css";

export default function AboutIntro() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal className={styles.content}>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.lead}>
            Looking for a seamless way to travel anywhere in the world?{" "}
            <span className={styles.accent}>You&apos;re in the right place.</span>
          </p>
          <p className={styles.support}>
            Relier is your premier global transportation solution — offering
            comfort, convenience, luxury, and so much more in one place.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
