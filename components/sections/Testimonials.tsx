"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Reveal from "@/components/effects/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import GoogleIcon from "@/components/icons/GoogleIcon";
import styles from "./Testimonials.module.css";

// TODO: client to confirm Google Business write-review URL (placeid-based)
const GOOGLE_REVIEW_URL = "https://www.google.com/search?q=Relier+Worldwide+Chauffeured+Services";
const GOOGLE_RATING = 5.0;
const GOOGLE_REVIEW_COUNT = 412;

// TODO: client to approve final 3 testimonials selected for home

const TESTIMONIALS = [
  {
    initial: "A",
    name: "Aglaia Fataliev",
    quote:
      "Best service ever. Very reliable and very pleasant. I without doubt recommend Relier.",
  },
  {
    initial: "A",
    name: "Aaron Collins",
    quote:
      "The car was spotless, luxurious, and incredibly comfortable, making the entire ride a smooth and relaxing experience. The driver was professional, punctual, and very courteous.",
  },
  {
    initial: "C",
    name: "Carla A. Suarez",
    quote:
      "We went yesterday to Six Flags from New York — a great experience. We travelled comfortably and they waited for us until we needed to get home. Recommend every time.",
  },
  {
    initial: "M",
    name: "Marquitos L.",
    quote:
      "Always 10 minutes before the pick up time the car is waiting for you, the service is another level. Apart from car service they cover a big range of travel services.",
  },
  {
    initial: "S",
    name: "Sebastián J. Peralta",
    quote:
      "Excellent service, prompt and clean limousine waiting for me at JFK on time. The chauffeur was very kind and professional. Top-tier in NY.",
  },
  {
    initial: "F",
    name: "Fabri P.",
    quote:
      "Good service and treatment from Chris. He helped us with all our luggage, and was very punctual with the pick-up time.",
  },
];

export default function Testimonials() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) return;

      const cards = Array.from(
        grid.querySelectorAll<HTMLElement>(`.${styles.card}`)
      );
      const cleanups: Array<() => void> = [];

      cards.forEach((card) => {
        const onMove = (e: PointerEvent) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          gsap.to(card, {
            rotationY: x * 5,
            rotationX: -y * 5,
            duration: 0.5,
            ease: "expo.out",
            overwrite: "auto",
          });
        };

        const onLeave = () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.6,
            ease: "expo.out",
            overwrite: "auto",
          });
        };

        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        });
      });

      return () => {
        cleanups.forEach((fn) => fn());
      };
    },
    { scope: gridRef }
  );

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
            lead="Verified reviews from Google. Real travelers, real journeys, real results across the Americas, Europe, and the Middle East."
          />
        </Reveal>

        <div className={styles.ratingPillWrap}>
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ratingPill}
            aria-label={`${GOOGLE_RATING} out of 5 from ${GOOGLE_REVIEW_COUNT} Google reviews`}
          >
            <GoogleIcon size={16} />
            <span className={styles.ratingValue}>{GOOGLE_RATING.toFixed(1)}</span>
            <span className={styles.ratingStars} aria-hidden="true">
              ★★★★★
            </span>
            <span className={styles.ratingDot} aria-hidden="true">·</span>
            <span className={styles.ratingCount}>
              {GOOGLE_REVIEW_COUNT} Google reviews
            </span>
          </a>
        </div>

        <div ref={gridRef} className={styles.grid}>
          {TESTIMONIALS.map((t) => (
            <Reveal key={t.name} as="article" className={styles.card}>
              <span className={styles.cardGoogle} aria-hidden="true">
                <GoogleIcon size={18} />
              </span>
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
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.reviewPill}
          >
            <GoogleIcon size={18} />
            <span>Leave us a Google review</span>
            <span className={styles.reviewPillArrow} aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
