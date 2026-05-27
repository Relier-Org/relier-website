import Image from "next/image";
import Reveal from "@/components/effects/Reveal";
import TextCTA from "@/components/ui/TextCTA";
import styles from "./Services.module.css";

// Versión B — "Disney+" layout (brief §2): every service is an equal-width
// vertical banner, all visible at once with no horizontal scroll. The user
// scans the whole row at a glance and clicks the one they need.
//
// NOTE (blocked on Andres): final category names are pending. Current four are
// placeholders. Confirmed rules for when they land: do NOT merge corporate /
// roadshows / sales events / artists (each explicit); Airport + By the Hour go
// together; Sightseeing TBD. The grid below auto-fits 4–6 columns, so adding
// the confirmed categories later is a data-only change.
const SERVICES = [
  {
    href: "/corporate",
    num: "01",
    title: "Corporate",
    tagline: "Meetings, conventions, business travel.",
    image: "/images/home/corporate.webp",
    alt: "Corporate transportation",
  },
  {
    href: "/events",
    num: "02",
    title: "Events",
    tagline: "Freedom to go wherever the night leads.",
    image: "/images/home/events.webp",
    alt: "Events transportation",
  },
  {
    href: "/airport",
    num: "03",
    title: "Airport & By the Hour",
    tagline: "Safe, fast, on your schedule.",
    image: "/images/home/airport.webp",
    alt: "Airport transfers",
  },
  {
    href: "/transfers",
    num: "04",
    title: "Premium Transfers",
    tagline: "Point to point, in style.",
    image: "/images/home/vehicle.webp",
    alt: "Premium vehicle transfers",
  },
];

export default function Services() {
  return (
    <section className={styles.services} id="services">
      <div className="container">
        <Reveal>
          <header className={styles.header}>
            <div className={styles.headText}>
              <p className={styles.kicker}>Concierge on the Road</p>
              <h2 className={styles.title}>
                One standard of service,
                <br />
                <span className="muted">every kind of journey.</span>
              </h2>
              <p className={styles.lead}>
                From a single airport run to a season of corporate roadshows,
                every service below is run by the same team, to the same
                standard. Pick the one that fits your trip.
              </p>
            </div>
            <div className={styles.headCta}>
              <TextCTA href="/services">See all services</TextCTA>
            </div>
          </header>
        </Reveal>

        <Reveal className={styles.row}>
          {SERVICES.map((s) => (
            <a
              key={s.num}
              href={s.href}
              aria-label={s.alt}
              className={styles.banner}
            >
              <div className={styles.bannerImg}>
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="(max-width: 720px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className={styles.bannerContent}>
                <p className={styles.num}>{s.num}</p>
                <h3 className={styles.h3}>{s.title}</h3>
                <p className={styles.tagline}>{s.tagline}</p>
                <span className={styles.cta} aria-hidden="true">
                  Explore
                </span>
              </div>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
