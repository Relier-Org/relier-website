import Image from "next/image";
import type { SVGProps } from "react";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
} from "@/components/icons/SocialIcons";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import styles from "./Footer.module.css";

// TODO: client to deliver SVG logo
// TODO: client to confirm Barcelona HQ address

const SERVICE_LINKS = [
  { href: "#", label: "Luxury vehicle transfers" },
  { href: "#", label: "Airport transfers" },
  { href: "#", label: "Events transportation" },
  { href: "#", label: "Corporate transportation" },
  { href: "#", label: "FIFA World Cup 2026" },
];

const COMPANY_LINKS = [
  { href: "#about", label: "About" },
  { href: "#fleet", label: "Fleet" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#", label: "News" },
  { href: "#", label: "Relier Europe" },
  { href: "#", label: "Careers" },
];

function LocationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

const CONTACT_ITEMS = [
  {
    icon: LocationIcon,
    label: "New York · HQ",
    value: "240 Kent Ave, 3rd Floor B14, Brooklyn, NY 11249",
    href: undefined,
  },
  {
    icon: LocationIcon,
    label: "Barcelona · Europe HQ",
    value: "[VERIFY address]",
    href: undefined,
  },
  {
    icon: PhoneIcon,
    label: "Concierge · 24/7",
    value: "+1 (844) 735-4371",
    href: "tel:+18447354371",
  },
];

const SOCIALS = [
  { href: "#", label: "Instagram", Icon: InstagramIcon },
  { href: "#", label: "Facebook", Icon: FacebookIcon },
  { href: "#", label: "LinkedIn", Icon: LinkedInIcon },
  { href: "#", label: "WhatsApp", Icon: WhatsAppIcon },
];

export default function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <a href="#" className={styles.logo} aria-label="Relier home">
              <Image
                src="/images/relier-logo.png"
                alt="Relier"
                width={140}
                height={32}
                className={styles.logoImg}
              />
            </a>
            <p>
              Personal mobility concierge. Based in New York and Barcelona. In
              service across the Americas, Europe, and the Middle East since
              2012.
            </p>
            <div className={styles.socialsMobile}>
              {SOCIALS.map(({ href, label, Icon }) => (
                <a key={label} href={href} aria-label={label}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className={styles.col}>
            <h4>Service</h4>
            <ul>
              {SERVICE_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4>Company</h4>
            <ul>
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className={cn(styles.col, styles.reachCol)}>
            <h4>Reach us</h4>
            {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => {
              const inner = (
                <>
                  <span className={styles.contactIcon} aria-hidden="true">
                    <Icon />
                  </span>
                  <span className={styles.contactBody}>
                    <span className={styles.contactLabel}>{label}</span>
                    <span className={styles.contactValue}>{value}</span>
                  </span>
                  <ChevronRight className={styles.contactChevron} />
                </>
              );
              return href ? (
                <a key={label} href={href} className={styles.contactItem}>
                  {inner}
                </a>
              ) : (
                <div key={label} className={styles.contactItem}>
                  {inner}
                </div>
              );
            })}
            <Button
              href="#booking"
              variant="primary"
              withArrow
              className={styles.ctaBtn}
            >
              Book your ride
            </Button>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 Relier · All rights reserved</p>
          <div className={styles.socials}>
            {SOCIALS.map(({ href, label, Icon }) => (
              <a key={label} href={href} aria-label={label}>
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
