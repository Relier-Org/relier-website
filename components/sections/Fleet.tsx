import Image from "next/image";
import Reveal from "@/components/effects/Reveal";
import TextCTA from "@/components/ui/TextCTA";
import styles from "./Fleet.module.css";

// Versión B — horizontal fleet banner (brief §4): the whole fleet is visible at
// once, no carousel to scroll through to discover there are more cars. Cars are
// smaller but all on screen together; hover enlarges one to inspect it.
//
// Home shows name + photo only. Specs (passengers, bags, interiors) live on the
// /fleet page — they're not finalized yet (blocked on Andres / the owners).
// NOTE (content dependency): final photos should be PROFILE (side) shots, not
// front. Swapping the webp files is enough; layout already frames them centered.
const VEHICLES = [
  { tier: "Executive Sedan", name: "Cadillac Lyriq", image: "/images/fleet/lyriq.webp", orSimilar: true },
  { tier: "Flagship Sedan", name: "Mercedes-Benz S-Class", image: "/images/fleet/s-class.webp", orSimilar: true },
  { tier: "Full-Size SUV", name: "Cadillac Escalade", image: "/images/fleet/escalade.webp", orSimilar: true },
  { tier: "Executive Van", name: "Mercedes-Benz Sprinter", image: "/images/fleet/sprinter.webp", orSimilar: true },
];
// Minibus + Motorcoach (larger vehicles) live only on /fleet — not on home.

export default function Fleet() {
  return (
    <section className={styles.fleet} id="fleet">
      <div className="container">
        <Reveal className={styles.head}>
          <div className={styles.headText}>
            <h2 className={styles.title}>
              Our fleet,
              <br />
              <span className="muted">always at the ready.</span>
            </h2>
            <p>
              The full lineup, at a glance. Always punctual, always immaculate —
              hover any vehicle to take a closer look.
            </p>
          </div>
          <div className={styles.headCta}>
            <TextCTA href="/fleet">Explore the full fleet</TextCTA>
          </div>
        </Reveal>

        <Reveal className={styles.banner}>
          {VEHICLES.map((v) => (
            <article key={v.name} className={styles.card}>
              <div className={styles.cardPhoto}>
                <Image
                  src={v.image}
                  alt={v.name}
                  fill
                  sizes="(max-width: 720px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className={styles.photoImg}
                />
                <div className={styles.glow} aria-hidden="true" />
              </div>
              <div className={styles.cardContent}>
                <p className={styles.tier}>{v.tier}</p>
                <h3>
                  {v.name}
                  {v.orSimilar && (
                    <span className={styles.orSimilar}>or similar</span>
                  )}
                </h3>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
