"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  as?: ElementType;
}

/**
 * Fade-up on entering the viewport, used to wrap the main block of nearly every
 * section on the site.
 *
 * The trigger is an IntersectionObserver, not ScrollTrigger (fixed 11-aug-2026).
 * ScrollTrigger caches each trigger's start/end when it is created and only
 * recomputes on a refresh, which nothing in the app ever called. Any layout that
 * settled afterwards left those positions stale, and a trigger that never fires
 * leaves its content at `opacity: 0` **forever** — the section simply never
 * appears. Two reproducible cases before the fix, both from the same root cause:
 * the preloader holds `overflow: hidden` on <html> while these mount, so the
 * scroller is not scrollable and every position is computed against a zero-height
 * scroll range.
 *
 *   · reload while scrolled halfway down  → 9 blocks invisible
 *   · land on /#fleet directly            → 11 blocks invisible
 *
 * IntersectionObserver reads live layout every time, so a locked scroll, restored
 * scroll position, anchor jump or late-loading image cannot desynchronise it. It
 * also reports the initial state on observe, so anything already on screen plays
 * immediately instead of waiting for a scroll event that may never come.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 1.2,
  className,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // No observer, or motion turned off: show the content. Never leave the
      // hidden state applied when there is nothing that can undo it.
      if (reduce || typeof IntersectionObserver === "undefined") {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(el, { opacity: 0, y });

      let watchdog = 0;
      const play = (fast = false) => {
        io.disconnect();
        window.clearInterval(watchdog);
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: fast ? 0.4 : duration,
          delay: fast ? 0 : delay,
          ease: "expo.out",
          overwrite: "auto",
        });
      };

      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) play();
        },
        // Bottom edge pulled in 12%, so the block starts moving just before it
        // reaches the fold — the same feel as ScrollTrigger's "top 88%".
        { rootMargin: "0px 0px -12% 0px" }
      );
      io.observe(el);

      // Watchdog. Invisible content is a far worse failure than a skipped
      // animation, so the one state that must never persist is "on screen and
      // still hidden" — whatever the cause. Checked against live layout, and only
      // for a block actually inside the viewport, so it never pre-reveals what is
      // still further down the page.
      watchdog = window.setInterval(() => {
        if (parseFloat(getComputedStyle(el).opacity) > 0.05) {
          window.clearInterval(watchdog);
          return;
        }
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.9 && r.bottom > 0) play(true);
      }, 2000);

      return () => {
        io.disconnect();
        window.clearInterval(watchdog);
      };
    },
    { scope: ref, dependencies: [delay, y, duration] }
  );

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={className}>
      {children}
    </Tag>
  );
}
