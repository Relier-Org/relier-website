"use client";

import { useRef } from "react";
import Image from "next/image";
import Reveal from "@/components/effects/Reveal";
import TextCTA from "@/components/ui/TextCTA";
import ChevronIcon from "@/components/icons/ChevronIcon";
import { useFleetCarousel } from "@/lib/hooks/useFleetCarousel";
import { cn } from "@/lib/utils/cn";
import styles from "./Fleet.module.css";

// TODO: client to decide if Minibus + Motorcoach show on home or only on /fleet page

const VEHICLES = [
  {
    tier: "Sedan",
    label: "Executive Sedan",
    year: "2024",
    name: "Cadillac Lyriq",
    image: "/images/fleet/lyriq.webp",
    passengers: 2,
    bags: 2,
  },
  {
    tier: "SUV",
    label: "Full-Size SUV",
    year: "2023",
    name: "Cadillac Escalade",
    image: "/images/fleet/escalade.webp",
    passengers: 5,
    bags: 6,
  },
  {
    tier: "S Class",
    label: "Flagship Sedan",
    year: "2024",
    name: "Mercedes-Benz S-Class",
    image: "/images/fleet/s-class.webp",
    passengers: 2,
    bags: 2,
  },
  {
    tier: "Van",
    label: "Executive Van",
    year: "2023",
    name: "Mercedes-Benz Sprinter",
    image: "/images/fleet/sprinter.webp",
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
    currentIndex,
    slideCount,
  } = useFleetCarousel();

  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent, i: number) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = Math.abs(e.clientX - start.x);
    const dy = Math.abs(e.clientY - start.y);
    if (dx < 6 && dy < 6) scrollTo(i);
  };

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
              Explore our luxury vehicles on offer. Always punctual and offering
              maximum comfort.
            </p>
          </div>
          <div className={styles.headCta}>
            <TextCTA href="/fleet">Explore the full fleet</TextCTA>
          </div>
        </Reveal>

        <div className={styles.trackWrap}>
          <button
            type="button"
            className={cn(styles.arrow, styles.arrowPrev)}
            onClick={scrollPrev}
            aria-label="Previous vehicle"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            className={cn(styles.arrow, styles.arrowNext)}
            onClick={scrollNext}
            aria-label="Next vehicle"
          >
            <ChevronIcon direction="right" />
          </button>
          <div className={styles.viewport} ref={emblaRef}>
            <div className={styles.track}>
              {VEHICLES.map((v, i) => (
                <article
                  key={v.name}
                  className={styles.card}
                  onPointerDown={handlePointerDown}
                  onPointerUp={(e) => handlePointerUp(e, i)}
                >
                  <div className={styles.cardInner}>
                    <div className={styles.cardPhoto}>
                      <Image
                        src={v.image}
                        alt={v.name}
                        fill
                        sizes="(max-width: 720px) 78vw, (max-width: 1024px) 42vw, 360px"
                        className={styles.photoImg}
                      />

                      <span className={styles.photoLabel}>{v.label}</span>

                      <div className={styles.glow} aria-hidden="true" />
                    </div>
                    <div className={styles.cardContent}>
                      <p className={styles.tier}>{v.tier}</p>
                      <h3>{v.name}</h3>
                      <p className={styles.spec}>
                        <span>{v.passengers} passengers</span>
                        <span>·</span>
                        <span>{v.bags} bags</span>
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
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
    </section>
  );
}
