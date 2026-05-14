import Image from "next/image";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
} from "@/components/icons/SocialIcons";
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
            <div className={styles.affiliations}>
              <span>
                <strong>Virtuoso</strong> · Preferred Partner
              </span>
              <span>
                <strong>NLA</strong> · National Limousine Association
              </span>
              <span>
                <strong>Brooklyn Chamber</strong> · Member
              </span>
              <span>
                <strong>NYC Concierge Association</strong> · Member
              </span>
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

          <div className={styles.col}>
            <h4>Reach us</h4>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>New York · HQ</span>
              <span className={styles.contactValue}>
                240 Kent Ave, 3rd Floor B14
                <br />
                Brooklyn, NY 11249
              </span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Barcelona · Europe HQ</span>
              <span className={styles.contactValue}>[VERIFY address]</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Concierge · 24/7</span>
              <a
                href="tel:+18447354371"
                className={styles.contactValue}
              >
                +1 (844) 735-4371
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 Relier · All rights reserved</p>
          <div className={styles.socials}>
            <a href="#" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="#" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a href="#" aria-label="WhatsApp">
              <WhatsAppIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
