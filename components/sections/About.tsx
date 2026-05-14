import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/effects/Reveal";
import VirtuosoBadge from "@/components/ui/VirtuosoBadge";
import styles from "./About.module.css";

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className="container">
        <Reveal className={styles.grid}>
          <div className={styles.left}>
            <Eyebrow className={styles.eyebrow}>Who we are</Eyebrow>
            <h2 className={styles.heading}>
              Turn your trip
              <br />
              into an <em>experience.</em>
            </h2>
            <VirtuosoBadge />
          </div>

          <div className={styles.right}>
            <p>
              Relier was born with the objective and commitment to make your
              trip a wonderful experience, providing top-level luxury
              transportation solutions. From A to Z, all taken care by us.
            </p>
            <p>
              At our boutique service, we prioritize excellence in every aspect
              of your journey. From the moment you step into one of our sleek
              and sophisticated vehicles, you will be greeted by our
              professional and knowledgeable chauffeurs who are committed to
              delivering exceptional service with a touch of personalized
              attention.
            </p>
            <Button href="#" withArrow className={styles.btn}>
              About us
            </Button>
            <div className={styles.meta}>
              <span className={styles.metaDivider} aria-hidden="true" />
              <p className={styles.metaText}>
                <strong>New York</strong> &amp; <strong>Barcelona</strong> ·
                Americas, Europe &amp; the Middle East
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
