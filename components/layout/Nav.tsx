"use client";

import Image from "next/image";
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

  return (
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
        </div>
      </div>
    </nav>
  );
}
