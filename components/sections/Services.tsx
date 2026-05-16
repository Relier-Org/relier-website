import Image from "next/image";
import Reveal from "@/components/effects/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import TextCTA from "@/components/ui/TextCTA";
import { cn } from "@/lib/utils/cn";
import styles from "./Services.module.css";

const SERVICES = [
  {
    href: "#",
    num: "01 / Corporate",
    title: <>Corporate Transportation</>,
    tagline: "Meetings, conventions, business travel.",
    image:
      "https://relier.com/wp-content/uploads/2025/10/CORPORATE-e1759429705849.webp",
    alt: "Corporate transportation",
    variant: "feature" as const,
    cta: "Learn more",
  },
  {
    href: "#",
    num: "02 / Events",
    title: <>Events Transportation</>,
    tagline: "Freedom to go wherever.",
    image:
      "https://relier.com/wp-content/uploads/2025/02/EVENTS-TRANSPORTATION-scaled.jpeg",
    alt: "Events transportation",
    variant: "tall" as const,
  },
  {
    href: "#",
    num: "03 / Airport",
    title: (
      <>
        Airport
        <br />
        Transfers
      </>
    ),
    tagline: "Safe and fast.",
    image:
      "https://relier.com/wp-content/uploads/2025/10/AIRPORT-e1759429455173.webp",
    alt: "Airport transfers",
    variant: "square" as const,
  },
  {
    href: "#",
    num: "04 / Vehicle",
    title: (
      <>
        Luxury Vehicle
        <br />
        Transfers
      </>
    ),
    tagline: "Travel in style.",
    image:
      "https://relier.com/wp-content/uploads/2025/02/LUXURY-VEHICLE-TRF-scaled.jpeg",
    alt: "Luxury vehicle transfers",
    variant: "square" as const,
  },
];

export default function Services() {
  return (
    <section className={styles.services} id="services">
      <div className="container">
        <Reveal>
          <SectionHead
            title={
              <>
                What we drive,
                <br />
                <span className="muted">we drive with care.</span>
              </>
            }
            lead="Four core services, each shaped around a different rhythm of travel. From a single airport transfer to a season of corporate roadshows — the standard does not change."
          />
        </Reveal>

        <div className={cn(styles.ctaRow, styles.ctaRowTop)}>
          <TextCTA href="#">See all services</TextCTA>
        </div>

        <Reveal className={styles.bento}>
          {SERVICES.map((s) => (
            <a
              key={s.num}
              href={s.href}
              aria-label={s.alt}
              className={cn(
                styles.tile,
                styles.image,
                s.variant === "feature" && styles.feature,
                s.variant === "tall" && styles.tall,
                s.variant === "square" && styles.square
              )}
            >
              <div className={styles.img}>
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className={styles.content}>
                <p className={styles.num}>{s.num}</p>
                <h3 className={styles.h3}>{s.title}</h3>
                <p className={styles.tagline}>{s.tagline}</p>
                {s.variant === "feature" && s.cta ? (
                  <span className={styles.ctaInline}>{s.cta}</span>
                ) : null}
              </div>
            </a>
          ))}
        </Reveal>

        <div className={cn(styles.ctaRow, styles.ctaRowBottom)}>
          <TextCTA href="#">See all services</TextCTA>
        </div>
      </div>
    </section>
  );
}
