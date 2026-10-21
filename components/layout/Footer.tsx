import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocationIcon, PhoneIcon, MailIcon } from "@/components/icons/ContactIcons";
import Button from "@/components/ui/Button";
import CookieSettingsButton from "@/components/consent/CookieSettingsButton";
import { SOCIAL_PROFILES } from "@/lib/social/profiles";
import { cn } from "@/lib/utils/cn";
import styles from "./Footer.module.css";

// Logo vertical (aro arriba, RELIER abajo) en todos los breakpoints y en la
// pantalla de carga (Nico, 18-oct-2026; el Figma lo pedía horizontal).
// TODO: pedir SVG; hoy es PNG blanco con transparencia.
// TODO: client to confirm Barcelona HQ address

const SERVICE_LINKS = [
  { href: "/transfers", labelKey: "common.transfers" },
  { href: "/hourly", labelKey: "common.asDirectedHourly" },
  { href: "/corporate", labelKey: "common.corporate" },
  { href: "/events", labelKey: "common.events" },
  { href: "/airport", labelKey: "footer.links.airportTransfers" },
  { href: "/concierge", labelKey: "common.concierge" },
];

const COMPANY_LINKS = [
  { href: "/about", labelKey: "footer.links.about" },
  { href: "/fleet", labelKey: "footer.links.fleet" },
  { href: "/for-business", labelKey: "nav.links.forBusiness" },
  { href: "/travel-advisors", labelKey: "common.travelAdvisors" },
  { href: "/affiliate-partners", labelKey: "common.affiliates" },
  { href: "/signature-events", labelKey: "common.signatureEvents" },
  { href: "/testimonials", labelKey: "common.testimonials" },
  { href: "/blog", labelKey: "common.news" },
  { href: "https://relier.es", labelKey: "footer.links.relierEurope", external: true },
];

// Rutas legales (oct-2026). Las páginas viven en app/[locale]/(legal).
const LEGAL_LINKS = [
  { href: "/privacy-policy", labelKey: "footer.legal.privacy" },
  { href: "/terms-and-conditions", labelKey: "footer.legal.terms" },
  { href: "/cookie-policy", labelKey: "footer.legal.cookies" },
  { href: "/refund-policy", labelKey: "footer.legal.refund" },
  { href: "/accessibility", labelKey: "footer.legal.accessibility" },
];

const CONTACT_ITEMS: {
  icon: typeof LocationIcon;
  labelKey: string;
  value: string;
  href: string;
  external?: boolean;
}[] = [
  {
    icon: LocationIcon,
    labelKey: "footer.contact.hq",
    value: "240 Kent Ave, Brooklyn, NY 11249",
    // Maps URL API: no key, and it hands off to the native app on mobile. The
    // query drops the floor and suite on purpose — they only confuse geocoding.
    href: "https://www.google.com/maps/search/?api=1&query=240%20Kent%20Ave%2C%20Brooklyn%2C%20NY%2011249",
    external: true,
  },
  {
    icon: MailIcon,
    labelKey: "footer.contact.email",
    value: "info@relier.com",
    href: "mailto:info@relier.com",
  },
  {
    icon: PhoneIcon,
    labelKey: "footer.contact.phone",
    value: "+1 (844) 735-4371",
    href: "tel:+18447354371",
  },
];

export default async function Footer() {
  const t = await getTranslations();

  return (
    <footer className={styles.footer} id="contact">
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo} aria-label={t("footer.aria.home")}>
              <Image
                src="/images/relier-logo-stacked.png"
                alt="Relier"
                width={256}
                height={240}
                className={styles.logoImg}
              />
            </Link>
            <p>{t("footer.brand")}</p>
            <div className={styles.socialsMobile}>
              {SOCIAL_PROFILES.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className={styles.col}>
            <h3>{t("footer.headings.service")}</h3>
            <ul>
              {SERVICE_LINKS.map((l) => (
                <li key={l.labelKey}>
                  <Link href={l.href}>{t(l.labelKey)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h3>{t("footer.headings.company")}</h3>
            <ul>
              {COMPANY_LINKS.map((l) => (
                <li key={l.labelKey}>
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer">
                      {t(l.labelKey)}
                    </a>
                  ) : (
                    <Link href={l.href}>{t(l.labelKey)}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={cn(styles.col, styles.reachCol)}>
            <h3>{t("footer.headings.reach")}</h3>
            {CONTACT_ITEMS.map(({ icon: Icon, labelKey, value, href, external }) => {
              const inner = (
                <>
                  <span className={styles.contactIcon} aria-hidden="true">
                    <Icon />
                  </span>
                  <span className={styles.contactBody}>
                    <span className={styles.contactLabel}>{t(labelKey)}</span>
                    <span className={styles.contactValue}>{value}</span>
                  </span>
                  {/* Figma oct-2026: la misma flecha que el resto del sitio. */}
                  <span className={styles.contactArrow} aria-hidden="true">
                    →
                  </span>
                </>
              );
              return (
                <a
                  key={labelKey}
                  href={href}
                  className={styles.contactItem}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {inner}
                </a>
              );
            })}
            <Button
              href="/online-reservation/"
              variant="primary"
              className={styles.ctaBtn}
            >
              {t("common.bookYourRide")}
            </Button>
          </div>
        </div>

        <div className={styles.bottom}>
          {/* Año del server: en las páginas estáticas es el del último build. */}
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <nav aria-label={t("footer.legal.aria")}>
            <ul className={styles.legal}>
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{t(l.labelKey)}</Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton
                  label={t("footer.legal.settings")}
                  className={styles.legalButton}
                />
              </li>
            </ul>
          </nav>
          <div className={styles.socials}>
            {SOCIAL_PROFILES.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
