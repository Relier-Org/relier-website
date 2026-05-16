"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useNavScroll } from "@/lib/hooks/useNavScroll";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import styles from "./Nav.module.css";

// TODO: client to deliver SVG logo
// TODO: phase 2 — add Spanish locale (Nav has EN switcher placeholder)

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#fleet", label: "Fleet" },
  { href: "#wc", label: "World Cup '26" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#", label: "Relier Europe" },
];

export default function Nav() {
  const isScrolled = useNavScroll(24);
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  useGSAP(
    () => {
      if (!isOpen) return;
      const overlay = overlayRef.current;
      const items = itemsRef.current;
      if (!overlay || !items) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const animatables = items.querySelectorAll(
        `.${styles.overlayLinks} li, .${styles.overlayFooter}`
      );
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: reduced ? 0 : 0.35, ease: "expo.out" }
      );
      gsap.fromTo(
        animatables,
        { opacity: 0, y: reduced ? 0 : 18 },
        {
          opacity: 1,
          y: 0,
          duration: reduced ? 0 : 0.6,
          stagger: reduced ? 0 : 0.06,
          delay: reduced ? 0 : 0.1,
          ease: "expo.out",
        }
      );
    },
    { dependencies: [isOpen] }
  );

  return (
    <>
      <nav className={cn(styles.nav, isScrolled && styles.isScrolled)}>
        <div className={cn("container", styles.inner)}>
          <a href="#" className={styles.logo} aria-label="Relier home">
            <Image
              src="/images/relier-logo.png"
              alt="Relier"
              width={140}
              height={32}
              priority
              className={styles.logoImg}
            />
          </a>
          <ul className={styles.links}>
            {LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <div className={styles.right}>
            <span className={styles.lang} role="button" tabIndex={0}>
              EN ⌄
            </span>
            <Button href="#booking" variant="primary" className={styles.cta}>
              Reserve
            </Button>
            <button
              type="button"
              className={cn(styles.burger, isOpen && styles.burgerOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsOpen((o) => !o)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div
          ref={overlayRef}
          id="mobile-menu"
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className={styles.overlayHeader}>
            <a
              href="#"
              className={styles.overlayLogo}
              aria-label="Relier home"
              onClick={() => setIsOpen(false)}
            >
              <Image
                src="/images/relier-logo.png"
                alt="Relier"
                width={140}
                height={32}
                className={styles.logoImg}
              />
            </a>
            <button
              type="button"
              className={styles.overlayClose}
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
            >
              <span />
              <span />
            </button>
          </div>
          <div className={styles.overlayInner} ref={itemsRef}>
            <ul className={styles.overlayLinks}>
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} onClick={() => setIsOpen(false)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className={styles.overlayFooter}>
              <Button
                href="#booking"
                variant="primary"
                className={styles.overlayCta}
                onClick={() => setIsOpen(false)}
              >
                Reserve
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
