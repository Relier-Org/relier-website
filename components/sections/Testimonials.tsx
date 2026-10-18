"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";
import Reveal from "@/components/effects/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import GoogleIcon from "@/components/icons/GoogleIcon";
import {
  HOME_TESTIMONIALS,
  GOOGLE_REVIEW_URL,
  GOOGLE_RATING,
  GOOGLE_REVIEW_COUNT,
  type Testimonial,
} from "@/lib/testimonials/data";
import { cn } from "@/lib/utils/cn";
import styles from "./Testimonials.module.css";

interface TestimonialsProps {
  testimonials?: Testimonial[];
  showHeader?: boolean;
  showRatingPill?: boolean; // top "G 5.0 · 412 Google reviews" pill
  reviewPillMode?: "inline" | "sticky" | "none"; // bottom "Leave a review" pill placement
  className?: string;
}

export default function Testimonials({
  testimonials = HOME_TESTIMONIALS,
  showHeader = true,
  showRatingPill = true,
  reviewPillMode = "inline",
  className,
}: TestimonialsProps = {}) {
  const t = useTranslations("home");
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [stickyRevealed, setStickyRevealed] = useState(false);

  useEffect(() => {
    if (reviewPillMode !== "sticky") return;
    const el = sectionRef.current;
    if (!el) return;
    // Trigger slightly BEFORE the section enters the viewport (positive
    // bottom rootMargin extends the root) so the fade/slide starts ahead of
    // the pill becoming sticky-visible and is fully perceivable.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStickyRevealed(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px 120px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reviewPillMode]);

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
    <section
      ref={sectionRef}
      className={cn(
        styles.testimonials,
        reviewPillMode === "none" && styles.testimonialsNoPill,
        className
      )}
      id="testimonials"
    >
      <div className="container">
        {showHeader && (
          <Reveal>
            <SectionHead
              title={
                <>
                  {t("testimonials.titleLine1")}
                  <br />
                  <span className="muted">{t("testimonials.titleLine2")}</span>
                </>
              }
              lead={t("testimonials.lead")}
            />
          </Reveal>
        )}

        {showRatingPill && (
          <div className={styles.ratingPillWrap}>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ratingPill}
              aria-label={t("testimonials.ratingAria", {
                rating: GOOGLE_RATING,
                count: GOOGLE_REVIEW_COUNT,
              })}
            >
              <GoogleIcon size={16} />
              <span className={styles.ratingValue}>{GOOGLE_RATING.toFixed(1)}</span>
              <span className={styles.ratingStars} aria-hidden="true">
                ★★★★★
              </span>
              <span className={styles.ratingDot} aria-hidden="true">·</span>
              <span className={styles.ratingCount}>
                {t("testimonials.ratingCount", { count: GOOGLE_REVIEW_COUNT })}
              </span>
            </a>
          </div>
        )}

        <div ref={gridRef} className={styles.grid}>
          {testimonials.map((item) => (
            <Reveal key={item.name} as="article" className={styles.card}>
              <span className={styles.cardGoogle} aria-hidden="true">
                <GoogleIcon size={18} />
              </span>
              <div
                className={styles.stars}
                aria-label={t("testimonials.starsAria")}
              >
                ★★★★★
              </div>
              {/* Reviews are verbatim customer quotes — never translated. */}
              <blockquote>“{item.quote}”</blockquote>
              <div className={styles.author}>
                <div className={styles.avatar} aria-hidden="true">
                  {item.initial}
                </div>
                <div>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.sub}>{t("testimonials.verified")}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        {reviewPillMode === "inline" && (
          <div className={styles.ctaRow}>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.reviewPill}
            >
              <span className={styles.reviewPillG}>
                <GoogleIcon size={20} />
              </span>
              <span>{t("testimonials.leaveReview")}</span>
            </a>
          </div>
        )}

        {reviewPillMode === "sticky" && (
          <div className={styles.stickyCtaWrap} data-revealed={stickyRevealed}>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.reviewPill}
            >
              <span className={styles.reviewPillG}>
                <GoogleIcon size={20} />
              </span>
              <span>{t("testimonials.leaveReview")}</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
