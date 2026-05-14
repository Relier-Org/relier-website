"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Reveal from "@/components/effects/Reveal";
import TextCTA from "@/components/ui/TextCTA";
import ChevronIcon from "@/components/icons/ChevronIcon";
import { useFleetCarousel } from "@/lib/hooks/useFleetCarousel";
import { cn } from "@/lib/utils/cn";
import styles from "./Fleet.module.css";

// TODO: client to provide editorial photos of each vehicle in setting (currently using product PNGs)
// TODO: client to decide if Minibus + Motorcoach show on home or only on /fleet page

const VEHICLES = [
  {
    tier: "Sedan",
    label: "Executive Sedan",
    year: "2024",
    name: "Cadillac Lyriq",
    image:
      "https://relier.com/wp-content/uploads/2024/11/Cadillac_Lyriq-removebg-preview-e1730493192439.png",
    passengers: 2,
    bags: 2,
  },
  {
    tier: "SUV",
    label: "Full-Size SUV",
    year: "2023",
    name: "Cadillac Escalade",
    image:
      "https://relier.com/wp-content/uploads/2023/06/cadillac-escalade-2023-590x590-1.png",
    passengers: 5,
    bags: 6,
  },
  {
    tier: "S Class",
    label: "Flagship Sedan",
    year: "2024",
    name: "Mercedes-Benz S-Class",
    image:
      "https://relier.com/wp-content/uploads/2024/11/sclass-e1730494326766.png",
    passengers: 2,
    bags: 2,
  },
  {
    tier: "Van",
    label: "Executive Van",
    year: "2023",
    name: "Mercedes-Benz Sprinter",
    image:
      "https://relier.com/wp-content/uploads/2023/06/mercedes-sprinter-luxury-590x590-1.png",
    passengers: 13,
    bags: 10,
  },
];

export default function Fleet() {
  const {
    emblaRef,
    scrollPrev,
    scrollNext,
    scrollTo,
    canPrev,
    canNext,
    currentIndex,
    slideCount,
  } = useFleetCarousel();

  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  // Per-card ambient animations (float, shadow breathe, active-only glow pulse + wave rings).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const isActive = i === currentIndex;

          const car = card.querySelector<HTMLElement>(`.${styles.car}`);
          const shadow = card.querySelector<HTMLElement>(`.${styles.shadow}`);
          const glow = card.querySelector<HTMLElement>(`.${styles.glow}`);
          const waves = card.querySelectorAll<SVGElement>(`.${styles.waveRing}`);

          if (car) {
            gsap.to(car, {
              y: isActive ? -14 : -8,
              duration: isActive ? 2.2 : 2.8,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              overwrite: "auto",
            });
          }

          if (shadow) {
            gsap.to(shadow, {
              scaleX: isActive ? 0.78 : 0.85,
              opacity: isActive ? 0.55 : 0.6,
              duration: isActive ? 2.2 : 2.8,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              overwrite: "auto",
            });
          }

          if (isActive) {
            if (glow) {
              gsap.to(glow, {
                scale: 1.08,
                opacity: 0.75,
                duration: 2.2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                overwrite: "auto",
              });
            }

            waves.forEach((ring, ringIdx) => {
              gsap.fromTo(
                ring,
                { scaleX: 0.6, scaleY: 0.6, opacity: 0.7 },
                {
                  scaleX: 2.6,
                  scaleY: 2.2,
                  opacity: 0,
                  duration: 2.4,
                  ease: "power1.out",
                  delay: ringIdx * 0.8,
                  repeat: -1,
                  overwrite: "auto",
                }
              );
            });
          } else {
            if (waves.length) gsap.set(waves, { opacity: 0 });
            if (glow) gsap.set(glow, { scale: 1, opacity: 1 });
          }
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [currentIndex] }
  );

  // Hover tilt on the active card only.
  useGSAP(
    () => {
      const activeCard = cardRefs.current[currentIndex];
      if (!activeCard) return;

      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      const onEnter = () => {
        gsap.to(activeCard, {
          y: -4,
          rotateX: 2,
          rotateY: -3,
          borderColor: "rgba(201, 169, 97, 0.32)",
          duration: 0.48,
          ease: "expo.out",
        });
      };
      const onLeave = () => {
        gsap.to(activeCard, {
          y: 0,
          rotateX: 0,
          rotateY: 0,
          borderColor: "rgba(197, 205, 213, 0.06)",
          duration: 0.48,
          ease: "expo.out",
        });
      };

      activeCard.addEventListener("mouseenter", onEnter);
      activeCard.addEventListener("mouseleave", onLeave);
      return () => {
        activeCard.removeEventListener("mouseenter", onEnter);
        activeCard.removeEventListener("mouseleave", onLeave);
      };
    },
    { dependencies: [currentIndex] }
  );

  return (
    <section className={styles.fleet} id="fleet" ref={sectionRef}>
      <div className="container">
        <Reveal className={styles.head}>
          <div className={styles.headText}>
            <h2 className={styles.title}>
              Our fleet,
              <br />
              <span className="muted">always at the ready.</span>
            </h2>
            <p>
              Explore our luxury vehicles on offer. Always punctual and offering
              maximum comfort.
            </p>
          </div>
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrow}
              onClick={scrollPrev}
              disabled={!canPrev}
              aria-label="Previous vehicle"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={scrollNext}
              disabled={!canNext}
              aria-label="Next vehicle"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>
        </Reveal>

        <div className={styles.trackWrap}>
          <div className={styles.viewport} ref={emblaRef}>
            <div className={styles.track}>
              {VEHICLES.map((v, index) => (
                <article
                  key={v.name}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={styles.card}
                >
                  <div className={styles.cardPhoto}>
                    <span className={styles.photoLabel}>{v.label}</span>
                    <span className={styles.photoYear}>{v.year}</span>

                    <div className={styles.glow} aria-hidden="true" />

                    <div className={styles.waves} aria-hidden="true">
                      <svg viewBox="0 0 400 100" preserveAspectRatio="none">
                        <ellipse
                          className={styles.waveRing}
                          cx="200"
                          cy="50"
                          rx="40"
                          ry="6"
                        />
                        <ellipse
                          className={styles.waveRing}
                          cx="200"
                          cy="50"
                          rx="40"
                          ry="6"
                        />
                        <ellipse
                          className={styles.waveRing}
                          cx="200"
                          cy="50"
                          rx="40"
                          ry="6"
                        />
                      </svg>
                    </div>

                    <div className={styles.shadow} aria-hidden="true" />

                    <div className={styles.car}>
                      <Image
                        src={v.image}
                        alt={v.name}
                        fill
                        sizes="(max-width: 720px) 78vw, (max-width: 1024px) 66vw, 45vw"
                        className={styles.photoImg}
                      />
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <p className={styles.tier}>{v.tier}</p>
                    <h3>{v.name}</h3>
                    <div className={styles.meta}>
                      <p className={styles.spec}>
                        <span>{v.passengers} passengers</span>
                        <span>·</span>
                        <span>{v.bags} bags</span>
                      </p>
                      <a href="#" className={styles.cardCta}>
                        Reserve
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className={styles.dots}>
            {Array.from({ length: slideCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={cn(styles.dot, i === currentIndex && styles.dotActive)}
                aria-label={`Go to vehicle ${i + 1}`}
                onClick={() => scrollTo(i)}
              />
            ))}
          </div>
        </div>

        <div className={styles.ctaRow}>
          <TextCTA href="#">Explore the full fleet</TextCTA>
        </div>
      </div>
    </section>
  );
}
