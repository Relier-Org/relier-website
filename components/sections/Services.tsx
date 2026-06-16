import Image from "next/image";
import Reveal from "@/components/effects/Reveal";
import TextCTA from "@/components/ui/TextCTA";
import styles from "./Services.module.css";

// Versión B — "Disney+" layout (brief §2): every service is an equal-width
// vertical banner, all visible at once with no horizontal scroll. The user
// scans the whole row at a glance and clicks the one they need.
//
// Categorías finales (PDF cliente 04-jun-2026): 4 categorías operativas en
// orden — Point to Point, By the Hour, Corporate, Events. Airport sale del set
// del home (la page /airport sigue viva y linkeada desde el Nav).
// TODO (imágenes): provisorias de la web vieja; Andrés libera las del shooting.
const SERVICES = [
  {
    href: "/transfers",
    num: "01",
    title: "Point to Point",
    tagline: "Transfers in style.",
    image: "/images/home/vehicle.webp",
    alt: "Point to point transfers",
  },
  {
    href: "/hourly",
    num: "02",
    title: "By the Hour",
    tagline: "Freedom to go wherever.",
    image: "/images/home/airport.webp",
    alt: "By the hour transportation",
  },
  {
    href: "/corporate",
    num: "03",
    title: "Corporate",
    tagline: "Meetings, conventions, business travel.",
    image: "/images/home/corporate.webp",
    alt: "Corporate transportation",
  },
  {
    href: "/events",
    num: "04",
    title: "Events",
    tagline: "Galas, weddings, productions.",
    image: "/images/home/events.webp",
    alt: "Events transportation",
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
