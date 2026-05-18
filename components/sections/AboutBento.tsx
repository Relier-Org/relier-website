import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import Reveal from "@/components/effects/Reveal";
import styles from "./AboutBento.module.css";

export default function AboutBento() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <Reveal className={styles.bento}>
            <div className={cn(styles.tile, styles.photoTile)}>
              <Image
                src="/images/about-2.webp"
                alt="Relier chauffeur opening the door for a client"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={styles.photo}
              />
            </div>
            <div className={cn(styles.tile, styles.videoTile)}>
              <video
                className={styles.video}
                src="/videos/reel-1.mp4"
                poster="/videos/reel-1-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
            </div>
            <div className={cn(styles.tile, styles.videoTile)}>
              <video
                className={styles.video}
                src="/videos/reel-3.mp4"
                poster="/videos/reel-3-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
            </div>
          </Reveal>

          <Reveal className={styles.text}>
            <p className={cn("eyebrow", styles.eyebrow)}>Who we are</p>
            <h2 className={styles.h2}>
              Just tell us what you need,
              <br />
              <span className="muted">we&apos;ll make it happen.</span>
            </h2>
            <div className={styles.body}>
              <p>
                Relier is a leading worldwide transportation company. With years
                of experience in the industry, our team of professionals provides
                top-notch service tailored to any unique travel requirement.
                Whether you&apos;re traveling alone for an important event or
                coordinating transportation for a group vacation, corporate
                outing, or international trip, we&apos;ve got you covered.
              </p>
              <p>
                At Relier, our clients&apos; satisfaction is always our top
                priority. We take every detail into consideration to ensure a
                seamless travel experience — wherever in the world your journey
                takes you. With us, you are in good hands and will always receive
                the high-quality service you deserve.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
