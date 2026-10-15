import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import TextCTA from "@/components/ui/TextCTA";
import EventsUpcoming, {
  type UpcomingItem,
} from "@/components/sections/EventsUpcoming";
import { EVENTS } from "@/lib/events/data";
import styles from "./EventsDossier.module.css";

/**
 * Body of /signature-events, in three bands: the featured recap on cream, the
 * rest of the events on obsidian (upcoming, or recent once they have all been
 * run), the closer on cream.
 *
 * Rebuilt 11-aug-2026. The first version was five identical full-width rows —
 * 5,692px of unbroken obsidian, 6.3 screens. The client asked for shorter, less
 * loaded, and for cream to break the dark run. Nothing was cut from the data:
 * what went is the chrome (numbered headers with rules, three-column spec
 * strips, 84px of padding per row). One anchored case plus a grid instead.
 */
export default async function EventsDossier() {
  const t = await getTranslations("services.signatureEvents");
  const recap =
    EVENTS.find((e) => e.featured) ??
    EVENTS.find((e) => e.status === "operated");
  const rest = EVENTS.filter((e) => e !== recap);
  const anyUpcoming = rest.some((e) => e.status === "upcoming");

  // Translated here and handed down as plain strings: the switch below needs
  // client state, but the `services` namespace stays off the wire.
  const upcoming: UpcomingItem[] = rest.map((e) => ({
    id: e.id,
    status: t(`labels.status.${e.status}`),
    operated: e.status === "operated",
    name: t(`items.${e.id}.name`),
    edition: t(`items.${e.id}.edition`),
    dates: t(`items.${e.id}.dates`),
    datesShort: t(`items.${e.id}.datesShort`),
    venue: t(`items.${e.id}.venue`),
    note: t.has(`items.${e.id}.note`) ? t(`items.${e.id}.note`) : undefined,
    service: t.has(`items.${e.id}.service`)
      ? t(`items.${e.id}.service`)
      : undefined,
    // The per-event CTA ("Plan your US Open transport") only makes sense
    // before the event; once run, the card points to booking in general.
    cta:
      e.status === "operated"
        ? t("labels.ctaBook")
        : t(`items.${e.id}.cta`),
    image: e.image,
    imageAlt: t(`items.${e.id}.imageAlt`),
  }));

  return (
    <>
      {recap ? (
        <section className={styles.recap}>
          <div className="container">
            <Reveal className={styles.recapGrid}>
              {recap.image ? (
                <div className={styles.recapPhoto}>
                  <Image
                    src={recap.image}
                    alt={t(`items.${recap.id}.imageAlt`)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 44vw"
                  />
                </div>
              ) : null}

              {/* Split in two so the photo can sit between them on mobile
                  (client, 11-aug): grid areas reorder head / photo / data
                  without duplicating the image. */}
              <div className={styles.recapHead}>
                <p className={styles.meta}>
                  <span className={styles.statusOperated}>
                    {t(`labels.status.${recap.status}`)}
                  </span>
                  <span>{t(`items.${recap.id}.edition`)}</span>
                </p>
                <h2 className={styles.recapName}>
                  {t(`items.${recap.id}.name`)}
                </h2>
                <p className={styles.where}>
                  {t(`items.${recap.id}.venue`)} ·{" "}
                  {t(`items.${recap.id}.dates`)}
                </p>
                {t.has(`items.${recap.id}.title`) ? (
                  <p className={styles.headline}>
                    {t(`items.${recap.id}.title`)}
                  </p>
                ) : null}
              </div>

              <div className={styles.recapData}>
                {recap.metrics ? (
                  <dl className={styles.figures}>
                    {recap.metrics.map((m) => (
                      <div key={m.id} className={styles.figure}>
                        <dd className={styles.figureValue}>{m.value}</dd>
                        <dt className={styles.figureLabel}>
                          {t(`items.${recap.id}.metrics.${m.id}.label`)}
                        </dt>
                        <dd className={styles.figureDesc}>
                          {t(`items.${recap.id}.metrics.${m.id}.desc`)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                <div className={styles.ctaRow}>
                  <Button href="/online-reservation" withArrow>
                    {t(`items.${recap.id}.cta`)}
                  </Button>
                  {recap.href && t.has(`items.${recap.id}.secondaryCta`) ? (
                    <TextCTA href={recap.href} tone="light">
                      {t(`items.${recap.id}.secondaryCta`)}
                    </TextCTA>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className={styles.upcoming}>
        <div className="container">
          <Reveal>
            <EventsUpcoming
              items={upcoming}
              labels={{
                kicker: anyUpcoming ? t("labels.upcoming") : t("labels.recent"),
                viewCards: t("labels.viewCards"),
                viewRows: t("labels.viewRows"),
                ctaShort: t("labels.ctaShort"),
              }}
            />
          </Reveal>
        </div>
      </section>

      <section className={styles.closer}>
        <div className="container">
          <Reveal className={styles.closerInner}>
            <div>
              <h2 className={styles.closerTitle}>{t("closer.title")}</h2>
              <p className={styles.closerBody}>{t("closer.body")}</p>
            </div>
            {/* Texto a la izquierda, acciones a la derecha, como ServiceCloser.
                Primario = hablar con el equipo; secundario = la landing del
                servicio (proof → money page, roadmap SEO sep-2026). */}
            <div className={styles.closerLinks}>
              <Button href="mailto:events@relier.com" withArrow>
                {t("closer.cta")}
              </Button>
              <Button href="/events" variant="secondary">
                {t("closer.secondaryCta")}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
