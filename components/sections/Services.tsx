import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/effects/Reveal";
import TextCTA from "@/components/ui/TextCTA";
import styles from "./Services.module.css";

// Versión B — "Disney+" layout (brief §2): every service is an equal-width
// vertical banner, all visible at once with no horizontal scroll. The user
// scans the whole row at a glance and clicks the one they need.
//
// Categorías finales (cliente 08-jul-2026): 4 categorías operativas en orden —
// Transfers, As directed/Hourly, Corporate, Events. Airport queda absorbido en
// Transfers (la page /airport sigue viva y linkeada desde el Nav).
// TODO (imágenes): provisorias de la web vieja; Andrés libera las del shooting.
const SERVICES = [
  {
    href: "/transfers",
    num: "01",
    key: "transfers",
    image: "/images/home/vehicle.webp",
  },
  {
    href: "/hourly",
    num: "02",
    key: "hourly",
    image: "/images/home/airport.webp",
  },
  {
    href: "/corporate",
    num: "03",
    key: "corporate",
    image: "/images/home/corporate.webp",
  },
  {
    href: "/events",
    num: "04",
    key: "events",
    image: "/images/home/events.webp",
  },
];

export default async function Services() {
  const t = await getTranslations("home");

  return (
    <section className={styles.services} id="services">
      <div className="container">
        <Reveal>
          <header className={styles.header}>
            <div className={styles.headText}>
              <p className={styles.kicker}>{t("services.kicker")}</p>
              <h2 className={styles.title}>
                {t("services.titleLine1")}
                <br />
                <span className="muted">{t("services.titleLine2")}</span>
              </h2>
              <p className={styles.lead}>{t("services.lead")}</p>
            </div>
            <div className={styles.headCta}>
              <TextCTA href="/services">{t("services.seeAll")}</TextCTA>
            </div>
          </header>
        </Reveal>

        <Reveal className={styles.row}>
          {SERVICES.map((s) => (
            <Link
              key={s.num}
              href={s.href}
              aria-label={t(`services.items.${s.key}.alt`)}
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
                <h3 className={styles.h3}>
                  {t(`services.items.${s.key}.title`)}
                </h3>
                <p className={styles.tagline}>
                  {t(`services.items.${s.key}.tagline`)}
                </p>
                <span className={styles.cta} aria-hidden="true">
                  {t("services.explore")}
                </span>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
