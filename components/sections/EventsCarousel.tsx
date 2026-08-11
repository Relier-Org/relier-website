"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import TextCTA from "@/components/ui/TextCTA";
import ChevronIcon from "@/components/icons/ChevronIcon";
import { cn } from "@/lib/utils/cn";
import styles from "./EventsCarousel.module.css";

export interface EventsCarouselItem {
  id: string;
  /** Already-translated strings: the parent is a server component, so no
      message namespace has to be shipped to the client for this. */
  status: string;
  name: string;
  dates: string;
  service?: string;
  cta: string;
  href: string;
}

/**
 * The upcoming events, as a carousel rather than a grid: the list grows every
 * season and a 2×2 grid would keep stretching the home page (client, 06-aug).
 * No autoplay on purpose — every card holds a link, and moving targets are
 * hostile to click.
 *
 * Native scroll snapping, not Embla (11-aug). The client wants every card to land
 * on the container's left edge and the last one to end on its right edge — the
 * max-width, not the screen. Embla measures the track as the viewport width and
 * infers the content size from the slides, which put the last card 16-24px off
 * no matter how the gutter was expressed. A scroll container's own limit is
 * `content - viewport` by definition, so both edges land exactly, and drag and
 * momentum come free from the platform.
 */
export default function EventsCarousel({
  items,
  label,
}: {
  items: EventsCarouselItem[];
  label: string;
}) {
  const t = useTranslations("common");
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // 2px of slack: sub-pixel widths mean scrollLeft never hits the bound exactly.
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  const step = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const slides = el.children;
    // One card plus one gutter, read off the layout instead of hard-coded.
    const stride =
      slides.length > 1
        ? (slides[1] as HTMLElement).offsetLeft -
          (slides[0] as HTMLElement).offsetLeft
        : el.clientWidth;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * stride, behavior: reduced ? "auto" : "smooth" });
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => step(-1)}
          disabled={!canPrev}
          aria-label={t("previous")}
        >
          <ChevronIcon direction="left" size={15} />
        </button>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => step(1)}
          disabled={!canNext}
          aria-label={t("next")}
        >
          <ChevronIcon direction="right" size={15} />
        </button>
      </div>

      <ul
        className={styles.track}
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {items.map((e) => (
          <li key={e.id} className={styles.slide}>
            <article className={styles.card}>
              <p className={styles.meta}>
                <span className={cn(styles.status, styles.statusUpcoming)}>
                  {e.status}
                </span>
              </p>
              <h3 className={styles.name}>{e.name}</h3>
              <p className={styles.dates}>{e.dates}</p>
              {e.service ? <p className={styles.service}>{e.service}</p> : null}
              <TextCTA href={e.href} tone="light" className={styles.cta}>
                {e.cta}
              </TextCTA>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
