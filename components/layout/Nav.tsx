"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useNavScroll } from "@/lib/hooks/useNavScroll";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import styles from "./Nav.module.css";

// TODO: client to deliver SVG logo
// TODO: phase 2 — add Spanish locale (Nav has EN switcher placeholder)

type NavLink = {
  href: string;
  label: string;
  external?: boolean;
  children?: { href: string; label: string }[];
};

const LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  {
    href: "/#services",
    label: "Services",
    children: [
      {
        href: "/fifa-world-cup-2026-private-transportation",
        label: "FIFA World Cup 2026",
      },
      { href: "/transfers", label: "Luxury Vehicle Transfers" },
      { href: "/events", label: "Events Transportation" },
      { href: "/airport", label: "Airport Transportation" },
      { href: "/corporate", label: "Corporate Transportation" },
    ],
  },
  { href: "/fleet", label: "Fleet" },
  { href: "https://relier.es", label: "Relier Europe", external: true },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function stripHash(href: string) {
  const i = href.indexOf("#");
  return i === -1 ? href : href.slice(0, i);
}

function isLinkActive(pathname: string, link: NavLink): boolean {
  if (link.children?.length) {
    return link.children.some((c) => {
      const cb = stripHash(c.href);
      if (!cb || cb === "#" || cb === "/") return false;
      return pathname === cb || pathname.startsWith(cb + "/");
    });
  }
  const base = stripHash(link.href);
  if (!base || base === "#") return false;
  if (base === "/") return pathname === "/";
  return pathname === base || pathname.startsWith(base + "/");
}

export default function Nav() {
  const isScrolled = useNavScroll(24);
  const pathname = usePathname() ?? "/";
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
          <Link href="/" className={styles.logo} aria-label="Relier home">
            <Image
              src="/images/relier-logo.png"
              alt="Relier"
              width={140}
              height={32}
              priority
              className={styles.logoImg}
            />
          </Link>
          <ul className={styles.links}>
            {LINKS.map((link) => {
              const active = isLinkActive(pathname, link);
              return (
              <li
                key={link.label}
                className={cn(link.children && styles.hasDropdown)}
              >
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={cn(styles.linkItem, active && styles.isActive)}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                  {link.children && (
                    <svg
                      className={styles.caret}
                      width="8"
                      height="6"
                      viewBox="0 0 8 6"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 1L4 4L7 1"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </a>
                {link.children && (
                  <ul className={styles.dropdown}>
                    {link.children.map((child) => {
                      const childActive =
                        pathname === stripHash(child.href) ||
                        pathname.startsWith(stripHash(child.href) + "/");
                      return (
                        <li key={child.label}>
                          <a
                            href={child.href}
                            className={cn(childActive && styles.isActive)}
                            aria-current={childActive ? "page" : undefined}
                          >
                            {child.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
              );
            })}
          </ul>
          <div className={styles.right}>
            <span className={styles.lang} role="button" tabIndex={0}>
              EN ⌄
            </span>
            <Button href="/#booking" variant="primary" className={styles.cta}>
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
            <Link
              href="/"
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
            </Link>
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
              {LINKS.map((link) => {
                const active = isLinkActive(pathname, link);
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className={cn(active && styles.isActive)}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </a>
                    {link.children && (
                      <ul className={styles.overlaySublinks}>
                        {link.children.map((child) => {
                          const childActive =
                            pathname === stripHash(child.href) ||
                            pathname.startsWith(stripHash(child.href) + "/");
                          return (
                            <li key={child.label}>
                              <a
                                href={child.href}
                                className={cn(childActive && styles.isActive)}
                                aria-current={childActive ? "page" : undefined}
                                onClick={() => setIsOpen(false)}
                              >
                                {child.label}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className={styles.overlayFooter}>
              <Button
                href="/#booking"
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
