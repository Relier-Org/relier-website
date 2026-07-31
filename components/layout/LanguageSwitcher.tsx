"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils/cn";
import styles from "./LanguageSwitcher.module.css";

interface LanguageSwitcherProps {
  variant?: "dropdown" | "inline";
  className?: string;
  onNavigate?: () => void;
}

export default function LanguageSwitcher({
  variant = "dropdown",
  className,
  onNavigate,
}: LanguageSwitcherProps) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname() ?? "/";
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Plain anchors: switching locale is a full document load anyway, and this
  // keeps the default locale unprefixed (`/fleet/`, not `/en/fleet/`) to match
  // the hreflang set in lib/i18n/seo.ts. next-intl's <Link locale> would force
  // an `/en/` prefix and a 307 hop. Safe while routing.localeDetection is off.
  // Trailing slash is normalized here because getPathname("/") returns a bare
  // "/es", which would 308 under next.config trailingSlash.
  const hrefFor = (l: Locale) => {
    const href = getPathname({ href: pathname, locale: l });
    return href.endsWith("/") ? href : `${href}/`;
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  if (variant === "inline") {
    return (
      <div
        className={cn(styles.inline, className)}
        role="group"
        aria-label={t("lang.label")}
      >
        {routing.locales.map((l) => (
          <a
            key={l}
            href={hrefFor(l)}
            hrefLang={l}
            className={cn(styles.inlineItem, l === locale && styles.isActive)}
            aria-current={l === locale ? "true" : undefined}
            onClick={onNavigate}
          >
            {t(`lang.${l}`)}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={cn(styles.root, className)}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="language-menu"
        onClick={() => setIsOpen((o) => !o)}
      >
        <span className={styles.srOnly}>{t("lang.label")}</span>
        {locale.toUpperCase()}
        <svg
          className={cn(styles.caret, isOpen && styles.caretOpen)}
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
      <ul id="language-menu" className={cn(styles.menu, isOpen && styles.isOpen)}>
        {routing.locales.map((l) => (
          <li key={l}>
            <a
              href={hrefFor(l)}
              hrefLang={l}
              className={cn(l === locale && styles.isActive)}
              aria-current={l === locale ? "true" : undefined}
              onClick={() => {
                setIsOpen(false);
                onNavigate?.();
              }}
            >
              {t(`lang.${l}`)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
