import Reveal from "@/components/effects/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import TextCTA from "@/components/ui/TextCTA";
import styles from "./Testimonials.module.css";

// TODO: client to approve final 3 testimonials selected for home

const TESTIMONIALS = [
  {
    initial: "A",
    name: "Aglaia Fataliev",
    quote:
      "Best service ever. Very reliable and very pleasant. I without doubt recommend Relier.",
  },
  {
    initial: "C",
    name: "Carla A. Suarez",
    quote:
      "We went yesterday to Six Flags from New York — a great experience. We travelled comfortably and they waited for us until we needed to get home. Recommend every time.",
  },
  {
    initial: "S",
    name: "Sebastián J. Peralta",
    quote:
      "Excellent service, prompt and clean limousine waiting for me at JFK on time. The chauffeur was very kind and professional. Top-tier in NY.",
  },
];

export default function Testimonials() {
  return (
    <section className={styles.testimonials} id="testimonials">
      <div className="container">
        <Reveal>
          <SectionHead
            title={
              <>
                Testimonials.
                <br />
                <span className="muted">What our travelers say.</span>
              </>
            }
            lead="Verified reviews from Google, collected via Endorsal. The full set — including reviews in Spanish, French, and Portuguese — lives on the testimonials page."
          />
        </Reveal>

        <div className={styles.grid}>
          {TESTIMONIALS.map((t) => (
            <Reveal key={t.name} as="article" className={styles.card}>
              <div className={styles.stars} aria-label="5 stars">
                ★★★★★
              </div>
              <blockquote>“{t.quote}”</blockquote>
              <div className={styles.author}>
                <div className={styles.avatar} aria-hidden="true">
                  {t.initial}
                </div>
                <div>
                  <p className={styles.name}>{t.name}</p>
                  <p className={styles.sub}>Verified Google review</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className={styles.ctaRow}>
          <TextCTA href="#" tone="light">
            See all testimonials
          </TextCTA>
        </div>
      </div>
    </section>
  );
}
