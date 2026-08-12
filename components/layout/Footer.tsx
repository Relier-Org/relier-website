import Image from "next/image";
import type { SVGProps } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
} from "@/components/icons/SocialIcons";
import { LocationIcon, PhoneIcon, MailIcon } from "@/components/icons/ContactIcons";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import styles from "./Footer.module.css";

// TODO: client to deliver SVG logo
// TODO: client to confirm Barcelona HQ address

const SERVICE_LINKS = [
  { href: "/transfers", labelKey: "common.transfers" },
  { href: "/hourly", labelKey: "common.asDirectedHourly" },
  { href: "/corporate", labelKey: "common.corporate" },
  { href: "/events", labelKey: "common.events" },
  { href: "/airport", labelKey: "footer.links.airportTransfers" },
];

const COMPANY_LINKS = [
  { href: "/about", labelKey: "footer.links.about" },
  { href: "/fleet", labelKey: "footer.links.fleet" },
  { href: "/signature-events", labelKey: "common.signatureEvents" },
  { href: "/testimonials", labelKey: "common.testimonials" },
  { href: "/blog", labelKey: "common.news" },
  { href: "https://relier.es", labelKey: "footer.links.relierEurope", external: true },
];

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
    value: "240 Kent Ave, 3rd Floor B14, Brooklyn, NY 11249",
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

const SOCIALS = [
  { href: "#", label: "Instagram", Icon: InstagramIcon },
  { href: "#", label: "Facebook", Icon: FacebookIcon },
  { href: "#", label: "LinkedIn", Icon: LinkedInIcon },
  { href: "#", label: "WhatsApp", Icon: WhatsAppIcon },
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
                src="/images/relier-logo.png"
                alt="Relier"
                width={140}
                height={32}
                className={styles.logoImg}
              />
            </Link>
            <p>{t("footer.brand")}</p>
            <div className={styles.socialsMobile}>
              {SOCIALS.map(({ href, label, Icon }) => (
                <a key={label} href={href} aria-label={label}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className={styles.col}>
            <h4>{t("footer.headings.service")}</h4>
            <ul>
              {SERVICE_LINKS.map((l) => (
                <li key={l.labelKey}>
                  <Link href={l.href}>{t(l.labelKey)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4>{t("footer.headings.company")}</h4>
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
            <h4>{t("footer.headings.reach")}</h4>
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
                  <ChevronRight className={styles.contactChevron} />
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
              withArrow
              className={styles.ctaBtn}
            >
              {t("common.bookYourRide")}
            </Button>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>{t("footer.copyright")}</p>
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
