import { cn } from "@/lib/utils/cn";
import styles from "./TrustBar.module.css";

const BADGES: {
  name: string;
  src: string;
  href: string;
  modifier?: keyof typeof styles;
}[] = [
  {
    name: "Virtuoso Preferred Partner",
    src: "/images/partners/virtuoso.svg",
    href: "https://www.virtuoso.com/",
  },
  {
    name: "National Limousine Association",
    src: "/images/partners/nla.webp",
    href: "https://www.limo.org/",
    modifier: "logoFlip",
  },
  {
    name: "Brooklyn Chamber of Commerce",
    src: "/images/partners/brooklyn-chamber.webp",
    href: "https://www.brooklynchamber.com/",
  },
  {
    name: "NYC Association of Hotel Concierges",
    src: "/images/partners/nycahc.webp",
    href: "https://nycahc.org/",
    modifier: "logoFlip",
  },
];

export default function TrustBar() {
  return (
    <section className={styles.trust}>
      <div className={cn("container", styles.inner)}>
        <span className={styles.label}>In service of</span>
        {BADGES.map(({ name, src, href, modifier }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.badge}
            aria-label={name}
            title={name}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={name}
              className={cn(styles.logo, modifier && styles[modifier])}
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
