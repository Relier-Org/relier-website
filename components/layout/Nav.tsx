"use client";

import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent } from "react";
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
    // Los 4 segmentos del hub B2B van a sus landings (Nico, 18-oct-2026):
    // For Business tiene sus páginas y Services las suyas, sin repetir destino.
    children: [
      { href: "/travel-advisors", labelKey: "common.travelAdvisors" },
      { href: "/corporate-transportation", labelKey: "common.corporateAccounts" },
      { href: "/event-transportation", labelKey: "common.eventsProductions" },
      { href: "/affiliate-partners", labelKey: "common.affiliates" },
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

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const dropdownId = (labelKey: string) =>
  `nav-dropdown-${labelKey.split(".").pop()}`;

// Skip link (2.4.1). Las páginas tienen un <main> sin id: se enfoca por
// selector (con tabIndex=-1 si no es enfocable) y se scrollea. El href="#main"
// queda de fallback sin JS.
function skipToMain(e: MouseEvent<HTMLAnchorElement>) {
  const main = document.querySelector("main");
  if (!main) return;
  e.preventDefault();
  if (!main.hasAttribute("tabindex")) {
    main.setAttribute("tabindex", "-1");
    // Enfocado por programa: sin el outline global alrededor de toda la página.
    main.style.outline = "none";
  }
  main.focus({ preventScroll: true });
  main.scrollIntoView({ block: "start" });
}

export default function Nav() {
  const t = useTranslations();
  const isScrolled = useNavScroll(24);
  const pathname = usePathname() ?? "/";
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  // Dropdowns de desktop (disclosure): `openMenu` es el que abrió el teclado o
  // un click en el chevron. El hover de CSS sigue funcionando aparte;
  // `dismissed` lo esconde si se apretó Escape con el mouse encima (1.4.13),
  // hasta que el puntero sale del item.
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<string | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const groupRefs = useRef<Record<string, HTMLLIElement | null>>({});

  // Menú mobile (dialog modal): foco al cerrar (X) al abrir, trap de Tab
  // adentro y foco de vuelta al burger al cerrar por cualquier vía.
  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) burgerRef.current?.focus();
      wasOpenRef.current = false;
      return;
    }
    wasOpenRef.current = true;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const overlay = overlayRef.current;
      if (!overlay) return;
      const nodes = Array.from(
        overlay.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !overlay.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !overlay.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  // Escape en los dropdowns y click afuera (Safari no enfoca botones al hacer
  // click, así que el focusout no alcanza para cerrarlos).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openMenu) {
        const key = openMenu;
        setOpenMenu(null);
        triggerRefs.current[key]?.focus();
        return;
      }
      const hovered = Object.entries(groupRefs.current).find(([, li]) =>
        li?.matches(":hover")
      );
      if (hovered) setDismissed(hovered[0]);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!openMenu) return;
      const li = groupRefs.current[openMenu];
      if (li && !li.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openMenu]);

  const onTriggerKeyDown = (
    e: ReactKeyboardEvent<HTMLButtonElement>,
    key: string
  ) => {
    if (e.key !== "ArrowDown") return;
    e.preventDefault();
    setOpenMenu(key);
    setDismissed(null);
    // El dropdown pasa a visible en este render: se enfoca el primer link en
    // el siguiente frame, cuando ya no tiene visibility: hidden.
    requestAnimationFrame(() => {
      groupRefs.current[key]
        ?.querySelector<HTMLElement>(`#${dropdownId(key)} a`)
        ?.focus();
    });
  };

  const onDropdownKeyDown = (
    e: ReactKeyboardEvent<HTMLUListElement>,
    key: string
  ) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const links = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("a"));
    const i = links.indexOf(document.activeElement as HTMLElement);
    if (i === -1) return;
    e.preventDefault();
    if (e.key === "ArrowUp" && i === 0) {
      triggerRefs.current[key]?.focus();
      return;
    }
    const next = e.key === "ArrowDown" ? Math.min(i + 1, links.length - 1) : i - 1;
    links[next]?.focus();
  };

  const onGroupBlur = (e: FocusEvent<HTMLLIElement>, key: string) => {
    if (openMenu === key && !e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpenMenu(null);
    }
  };

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
      <a href="#main" className={styles.skipLink} onClick={skipToMain}>
        {t("nav.skipToMain")}
      </a>
      <nav className={cn(styles.nav, isScrolled && styles.isScrolled)}>
        <div className={cn("container", styles.inner)}>
          <Link href="/" className={styles.logo} aria-label={t("nav.aria.home")}>
            <Image
              src="/images/relier-logo-horizontal.png"
              alt="Relier"
              width={683}
              height={240}
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
                ref={
                  link.children
                    ? (el) => {
                        groupRefs.current[link.labelKey] = el;
                      }
                    : undefined
                }
                className={cn(
                  link.children && styles.hasDropdown,
                  openMenu === link.labelKey && styles.isOpen,
                  dismissed === link.labelKey && styles.isDismissed
                )}
                onMouseLeave={
                  link.children && dismissed === link.labelKey
                    ? () => setDismissed(null)
                    : undefined
                }
                onBlur={
                  link.children ? (e) => onGroupBlur(e, link.labelKey) : undefined
                }
              >
                <LinkTag
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    styles.linkItem,
                    link.children && styles.linkWithToggle,
                    active && styles.isActive
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {t(link.labelKey)}
                </LinkTag>
                {/* El label sigue siendo link al hub (/services, /for-business);
                    el chevron pasa a ser un botón propio que abre el submenú. */}
                {link.children && (
                  <button
                    type="button"
                    ref={(el) => {
                      triggerRefs.current[link.labelKey] = el;
                    }}
                    className={cn(styles.dropdownToggle, active && styles.isActive)}
                    aria-expanded={openMenu === link.labelKey}
                    aria-controls={dropdownId(link.labelKey)}
                    aria-label={t("nav.aria.submenu", { label: t(link.labelKey) })}
                    onClick={() => {
                      setDismissed(null);
                      setOpenMenu((k) => (k === link.labelKey ? null : link.labelKey));
                    }}
                    onKeyDown={(e) => onTriggerKeyDown(e, link.labelKey)}
                  >
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
                  </button>
                )}
                {link.children && (
                  <ul
                    id={dropdownId(link.labelKey)}
                    className={styles.dropdown}
                    onKeyDown={(e) => onDropdownKeyDown(e, link.labelKey)}
                  >
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
            <Button href="/online-reservation/" variant="primary" size="sm" className={styles.cta}>
              {/* "Reserve now" del Figma; entre 1025 y 1280 no entra (sobre todo
                  en ES/PT) y queda "Reserve". */}
              <span className={styles.ctaLong}>{t("common.reserve")}</span>
              <span className={styles.ctaShort}>{t("common.reserveShort")}</span>
            </Button>
            <button
              ref={burgerRef}
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
                src="/images/relier-logo-horizontal.png"
                alt="Relier"
                width={683}
                height={240}
                className={styles.logoImg}
              />
            </Link>
            <button
              ref={closeRef}
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
