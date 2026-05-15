import Image from "next/image";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/effects/Reveal";
import TrophyIcon from "@/components/icons/TrophyIcon";
import StadiumIcon from "@/components/icons/StadiumIcon";
import WorldCupConfetti from "@/components/icons/WorldCupConfetti";
import { cn } from "@/lib/utils/cn";
import styles from "./WorldCup.module.css";

// TODO: client to confirm match dates, venues, package details

const FEATURES = [
  "Coverage in all host cities · New York, Toronto, Mexico City, Los Angeles, and beyond",
  "Airport, hotel-to-stadium, and full-day service tailored to your schedule",
  "Multi-day packages for delegations, sponsors, and broadcast crews",
  "Bilingual chauffeurs (EN · ES · FR · PT) · Dedicated concierge during match windows",
];

export default function WorldCup() {
  return (
    <section className={styles.wc} id="wc">
      <div className={styles.crowdBg} aria-hidden="true">
        <Image
          src="/images/worldcup/aficion.webp"
          alt=""
          fill
          sizes="100vw"
          priority={false}
        />
      </div>
      <WorldCupConfetti className={styles.confetti} />
      <div className={cn("container", styles.inner)}>
        <Reveal className={styles.content}>
          <h2 className={styles.h2}>
            When the world
            <br />
            comes to <em>your city.</em>
          </h2>
          <p className={styles.lead}>
            Private ground transportation across every host city of the FIFA
            World Cup 2026. Door-to-door service across the United States,
            Mexico, and Canada — airport, hotel, and stadium transfers for every
            match.
          </p>
          <div className={styles.flagBar} aria-hidden="true">
            <span className={cn(styles.flagChip, styles.flagUsa)}>
              <span className={styles.flagDot} />
              <span className={styles.flagDot} />
              <span className={styles.flagDot} />
              USA
            </span>
            <span className={cn(styles.flagChip, styles.flagMex)}>
              <span className={styles.flagDot} />
              <span className={styles.flagDot} />
              <span className={styles.flagDot} />
              Mexico
            </span>
            <span className={cn(styles.flagChip, styles.flagCan)}>
              <span className={styles.flagDot} />
              <span className={styles.flagDot} />
              <span className={styles.flagDot} />
              Canada
            </span>
          </div>
          <ul className={styles.features}>
            {FEATURES.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <Button href="#" withArrow>
            Plan your World Cup transport
          </Button>
        </Reveal>

        <Reveal className={styles.bento}>
          <div className={styles.photo}>
            <Image
              src="https://relier.com/wp-content/uploads/2025/09/FIFA-26-private-transportation.png"
              alt="Relier private transportation for FIFA World Cup 2026"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className={styles.photoLabel}>
              <Eyebrow className={styles.photoEyebrow}>The journey</Eyebrow>
              <p className={styles.photoLabelMain}>USA · Mexico · Canada</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <TrophyIcon className={styles.infoIcon} />
            <p className={styles.infoLabel}>Tournament window</p>
            <div>
              <p className={styles.infoValue}>
                Jun 11 — <em>Jul 19</em>
              </p>
              <p className={styles.infoSub}>39 days · 60 days of operations</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <StadiumIcon className={styles.infoIcon} />
            <p className={styles.infoLabel}>Host coverage</p>
            <div>
              <p className={styles.infoValue}>
                16 cities
                <br />
                <em>3 nations</em>
              </p>
              <p className={styles.infoSub}>USA · Mexico · Canada</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
