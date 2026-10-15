"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { onEmbedReady } from "@/lib/booking/embedReady";
import styles from "./Preloader.module.css";

/** Floor, so a warm cache doesn't turn the curtain into a flash. */
const MIN_VISIBLE_MS = 1100;
/** Ceiling. The reservation embed is third-party: it can 403, hang, or crawl. */
const MAX_VISIBLE_MS = 4200;
/** Last resort, handled by the inline script: React never hydrated. */
const FAILSAFE_MS = 7000;

/**
 * Curtain over the first screen that lifts once the Limo Anywhere reservation
 * embed has painted (or the ceiling above is hit, whichever comes first), so
 * the home page never shows a hero with a hollow booking bar under it.
 *
 * Rendered server-side on purpose: it has to cover the page from the very first
 * frame, not after hydration. Everything it needs before React wakes up — the
 * once-per-session skip and the failsafe — lives in the inline script below.
 * The page itself renders underneath, in the flow, visible to crawlers: this is
 * an overlay, never `display: none` on the content. That also matters for the
 * embed, which measures 0px (and so never reports ready) inside a hidden tree.
 */
export default function Preloader({
  // Once per session in production, so a repeat visit isn't made to wait twice.
  // Always in dev, otherwise iterating on the animation means clearing storage.
  once = process.env.NODE_ENV === "production",
}: { once?: boolean }) {
  const t = useTranslations("common");
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"up" | "lifting" | "gone">("up");

  useEffect(() => {
    const html = document.documentElement;
    // Set by the inline script: "skip" (already seen this session) or "failed".
    if (html.dataset.preloader !== "running") {
      setPhase("gone");
      return;
    }

    let liftTimer = 0;
    let lifted = false;

    const lift = () => {
      if (lifted) return;
      lifted = true;
      setPhase("lifting");
    };

    // Both budgets run from navigation start, not from hydration: the curtain
    // has been on screen since the first paint. `performance.now()` is already
    // relative to navigation start, so it is the elapsed time.
    const remaining = (budget: number) =>
      Math.max(0, budget - performance.now());

    const liftWhenIntroDone = () => {
      if (lifted) return;
      liftTimer = window.setTimeout(lift, remaining(MIN_VISIBLE_MS));
    };

    const off = onEmbedReady(liftWhenIntroDone);
    const ceiling = window.setTimeout(lift, remaining(MAX_VISIBLE_MS));

    return () => {
      off();
      window.clearTimeout(ceiling);
      window.clearTimeout(liftTimer);
    };
  }, []);

  useGSAP(
    () => {
      if (phase !== "lifting") return;
      const root = rootRef.current;
      if (!root) return;

      // Releases the paused first-screen entrance animations, so the hero rises
      // *with* the curtain instead of having played out behind it.
      document.documentElement.dataset.preloader = "lifting";

      const finish = () => {
        try {
          window.sessionStorage.setItem("relier:curtain", "1");
        } catch {
          /* private mode — the curtain simply plays again next load */
        }
        delete document.documentElement.dataset.preloader;
        setPhase("gone");
      };

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;

      if (reduced) {
        gsap.to(root, { autoAlpha: 0, duration: 0.3, onComplete: finish });
        return;
      }

      gsap
        .timeline({ onComplete: finish })
        .to(contentRef.current, {
          autoAlpha: 0,
          y: -12,
          filter: "blur(6px)",
          duration: 0.35,
          ease: "power2.out",
        })
        .to(
          root,
          { yPercent: -100, duration: 0.8, ease: "expo.inOut" },
          "-=0.12"
        );
    },
    { dependencies: [phase] }
  );

  useEffect(() => {
    if (phase === "gone") return;
    // `!important` in the stylesheet, because the expander script sets an inline
    // `overflow-y: scroll` on <html> 200ms and 2s after it boots.
    document.documentElement.classList.add("curtainUp");
    return () => document.documentElement.classList.remove("curtainUp");
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <>
      <script
        // Runs at parse time, before hydration: decides whether the curtain
        // plays at all, and guarantees it lifts even if React never boots.
        dangerouslySetInnerHTML={{
          __html: `(function(){var d=document.documentElement;try{if(${
            once ? "true" : "false"
          }&&sessionStorage.getItem("relier:curtain")==="1"){d.dataset.preloader="skip";return}}catch(e){}d.dataset.preloader="running";setTimeout(function(){if(d.dataset.preloader==="running"){d.dataset.preloader="failed";d.classList.remove("curtainUp")}},${FAILSAFE_MS})})()`,
        }}
      />
      <noscript>
        <style>{`.${styles.root}{display:none!important}`}</style>
      </noscript>
      <div
        ref={rootRef}
        className={styles.root}
        role="status"
        aria-live="polite"
        aria-label={t("preloader.label")}
      >
        <div ref={contentRef} className={styles.content}>
          <div className={styles.logo}>
            {/* Intrinsic dimensions declared, scaled down in CSS — passing the
                display size instead makes next/image flag the aspect ratio. */}
            <Image
              src="/images/relier-logo-horizontal.png"
              alt="Relier"
              width={683}
              height={240}
              priority
              className={styles.logoImg}
            />
            <span className={styles.sheen} aria-hidden="true">
              <span className={styles.sheenBar} />
            </span>
          </div>
          <span className={styles.track} aria-hidden="true">
            <span className={styles.beam} />
          </span>
          <p className={styles.label}>{t("preloader.label")}</p>
        </div>
        <span className={styles.edge} aria-hidden="true" />
      </div>
    </>
  );
}
