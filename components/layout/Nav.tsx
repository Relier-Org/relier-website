"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useNavScroll } from "@/lib/hooks/useNavScroll";
import Button from "@/components/ui/Button";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { cn } from "@/lib/utils/cn";
import styles from "./Nav.module.css";

// TODO: client to deliver SVG logo

type NavLink = {
  href: string;
  labelKey: string;
  external?: boolean;
  children?: { href: string; labelKey: string }[];
};

const LINKS: NavLink[] = [
  { href: "/", labelKey: "nav.links.home" },
  {
    href: "/services",
    labelKey: "nav.links.services",
    children: [
      { href: "/transfers", labelKey: "common.transfers" },
      { href: "/hourly", labelKey: "common.asDirectedHourly" },
      { href: "/corporate", labelKey: "common.corporate" },
      { href: "/events", labelKey: "common.events" },
      { href: "/airport", labelKey: "common.airportTransfers" },
    ],
  },
  { href: "/fleet", labelKey: "nav.links.fleet" },
  {
    href: "/for-business",
    labelKey: "nav.links.forBusiness",
    // Los 4 segmentos del hub B2B (roadmap SEO sep-2026, R05). Corporate y
    // Events repiten destino con el dropdown de Services a propósito: son las
    // URLs que ya rankean y el roadmap pide no abrir paralelas.
    children: [
      { href: "/for-business/travel-advisors", labelKey: "common.travelAdvisors" },
      { href: "/corporate", labelKey: "common.corporateAccounts" },
      { href: "/events", labelKey: "common.eventsProductions" },
      { href: "/affiliates", labelKey: "common.affiliates" },
    ],
  },
  // The dossier, not the service page — the Services dropdown already holds
  // /events. Two different pages, so two different labels.
  { href: "/signature-events", labelKey: "common.signatureEvents" },
  { href: "/about", labelKey: "nav.links.about" },
  { href: "/contact", labelKey: "nav.links.contact" },
];

function stripHash(href: string) {
  const i = href.indexOf("#");
  return i === -1 ? href : href.slice(0, i);
}

function isLinkActive(pathname: string, link: NavLink): boolean {
  const matches = (rawHref: string) => {
    const base = stripHash(rawHref);
    if (!base || base === "#") return false;
    if (base === "/") return pathname === "/";
    if (/^https?:\/\//.test(base)) return false;
    return pathname === base || pathname.startsWith(base + "/");
  };

  if (link.children?.length) {
    // Parent matches if its own href matches OR any child does.
    if (matches(link.href)) return true;
    return link.children.some((c) => matches(c.href));
  }
  return matches(link.href);
}

export default function Nav() {
  const t = useTranslations();
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
          <Link href="/" className={styles.logo} aria-label={t("nav.aria.home")}>
            <Image
              src="/images/relier-logo.png"
              alt="Relier"
              width={200}
              height={46}
              priority
              className={styles.logoImg}
            />
          </Link>
          <ul className={styles.links}>
            {LINKS.map((link) => {
              const active = isLinkActive(pathname, link);
              const LinkTag = link.external ? "a" : Link;
              return (
              <li
                key={link.labelKey}
                className={cn(link.children && styles.hasDropdown)}
              >
                <LinkTag
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={cn(styles.linkItem, active && styles.isActive)}
                  aria-current={active ? "page" : undefined}
                >
                  {t(link.labelKey)}
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
                </LinkTag>
                {link.children && (
                  <ul className={styles.dropdown}>
                    {link.children.map((child) => {
                      const childActive =
                        pathname === stripHash(child.href) ||
                        pathname.startsWith(stripHash(child.href) + "/");
                      return (
                        <li key={child.labelKey}>
                          <Link
                            href={child.href}
                            className={cn(childActive && styles.isActive)}
                            aria-current={childActive ? "page" : undefined}
                          >
                            {t(child.labelKey)}
                          </Link>
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
            <LanguageSwitcher className={styles.lang} />
            <Button href="/online-reservation/" variant="primary" className={styles.cta}>
              {t("common.reserve")}
            </Button>
            <button
              type="button"
              className={cn(styles.burger, isOpen && styles.burgerOpen)}
              aria-label={isOpen ? t("nav.aria.closeMenu") : t("nav.aria.openMenu")}
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
          aria-label={t("nav.aria.menu")}
        >
          <div className={styles.overlayHeader}>
            <Link
              href="/"
              className={styles.overlayLogo}
              aria-label={t("nav.aria.home")}
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
              aria-label={t("nav.aria.closeMenu")}
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
                const LinkTag = link.external ? "a" : Link;
                return (
                  <li key={link.labelKey}>
                    <LinkTag
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className={cn(active && styles.isActive)}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setIsOpen(false)}
                    >
                      {t(link.labelKey)}
                    </LinkTag>
                    {link.children && (
                      <ul className={styles.overlaySublinks}>
                        {link.children.map((child) => {
                          const childActive =
                            pathname === stripHash(child.href) ||
                            pathname.startsWith(stripHash(child.href) + "/");
                          return (
                            <li key={child.labelKey}>
                              <Link
                                href={child.href}
                                className={cn(childActive && styles.isActive)}
                                aria-current={childActive ? "page" : undefined}
                                onClick={() => setIsOpen(false)}
                              >
                                {t(child.labelKey)}
                              </Link>
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
              <LanguageSwitcher
                variant="inline"
                className={styles.overlayLang}
                onNavigate={() => setIsOpen(false)}
              />
              <Button
                href="/online-reservation/"
                variant="primary"
                className={styles.overlayCta}
                onClick={() => setIsOpen(false)}
              >
                {t("common.reserve")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
