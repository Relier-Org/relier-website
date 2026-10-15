import { Fragment } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import styles from "./Services.module.css";

// Versión B — "Disney+" layout (brief §2): every service is an equal-width
// vertical banner, all visible at once with no horizontal scroll. The user
// scans the whole row at a glance and clicks the one they need.
//
// Categorías finales (cliente 08-jul-2026): 4 categorías operativas en orden —
// Transfers, As directed/Hourly, Corporate, Events. Airport queda absorbido en
// Transfers (la page /airport sigue viva y linkeada desde el Nav).
// TODO (imágenes): provisorias de la web vieja; Andrés libera las del shooting.
//
// En mobile la fila de 4 iguales se rompe en un bento asimétrico (pedido del
// cliente 13-ago-2026: "que no estén todas alineadas perfectas"). El `slot` de
// cada item es su celda en ese bento y respeta el orden de relevancia:
// 01 banner ancho arriba · 02 columna alta a la izquierda · 03 y 04 apilados a
// la derecha. De 721px para arriba el slot no hace nada y manda la grilla pareja.
const SERVICES = [
  {
    href: "/transfers",
    num: "01",
    key: "transfers",
    image: "/images/home/vehicle.webp",
    slot: "slotHero",
    sizes: "(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 25vw",
  },
  {
    href: "/hourly",
    num: "02",
    key: "hourly",
    image: "/images/home/airport.webp",
    slot: "slotTall",
    sizes: "(max-width: 1024px) 50vw, 25vw",
  },
  {
    href: "/corporate",
    num: "03",
    key: "corporate",
    image: "/images/home/corporate.webp",
    slot: "slotA",
    sizes: "(max-width: 1024px) 50vw, 25vw",
  },
  {
    href: "/events",
    num: "04",
    key: "events",
    image: "/images/home/events.webp",
    slot: "slotB",
    sizes: "(max-width: 1024px) 50vw, 25vw",
  },
] as const;

// Para el layout, "As directed/Hourly" (y sus traducciones) es una sola palabra
// larguísima: el browser no corta en la barra, así que en el tile angosto del
// bento mobile el título desbordaba o se partía a la mitad ("…Hourl / y").
// <wbr> le marca dónde puede cortar sin romper nada.
function breakAfterSlash(title: string) {
  const parts = title.split("/");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 && (
        <>
          /<wbr />
        </>
      )}
      {part}
    </Fragment>
  ));
}

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
          </header>
        </Reveal>

        <Reveal className={styles.row}>
          {SERVICES.map((s) => (
            <Link
              key={s.num}
              href={s.href}
              aria-label={t(`services.items.${s.key}.alt`)}
              className={`${styles.banner} ${styles[s.slot]}`}
            >
              <div className={styles.bannerImg}>
                <Image src={s.image} alt="" fill sizes={s.sizes} />
              </div>
              <div className={styles.bannerContent}>
                <h3 className={styles.h3}>
                  {breakAfterSlash(t(`services.items.${s.key}.title`))}
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

        <div className={styles.foot}>
          <Button href="/services" variant="secondary">
            {t("services.seeAll")}
          </Button>
        </div>
      </div>
    </section>
  );
}
