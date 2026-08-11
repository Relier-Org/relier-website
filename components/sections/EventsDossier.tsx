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
 * Body of /signature-events, in three bands: the operated recap on cream, the
 * upcoming events on obsidian, the closer on cream.
 *
 * Rebuilt 11-aug-2026. The first version was five identical full-width rows —
 * 5,692px of unbroken obsidian, 6.3 screens. The client asked for shorter, less
 * loaded, and for cream to break the dark run. Nothing was cut from the data:
 * what went is the chrome (numbered headers with rules, three-column spec
 * strips, 84px of padding per row). One anchored case plus a grid instead.
 */
export default async function EventsDossier() {
  const t = await getTranslations("services.signatureEvents");
  const recap = EVENTS.find((e) => e.status === "operated");

  // Translated here and handed down as plain strings: the switch below needs
  // client state, but the `services` namespace stays off the wire.
  const upcoming: UpcomingItem[] = EVENTS.filter(
    (e) => e.status === "upcoming"
  ).map((e) => ({
    id: e.id,
    name: t(`items.${e.id}.name`),
    edition: t(`items.${e.id}.edition`),
    dates: t(`items.${e.id}.dates`),
    datesShort: t(`items.${e.id}.datesShort`),
    venue: t(`items.${e.id}.venue`),
    note: t.has(`items.${e.id}.note`) ? t(`items.${e.id}.note`) : undefined,
    service: t.has(`items.${e.id}.service`)
      ? t(`items.${e.id}.service`)
      : undefined,
    cta: t(`items.${e.id}.cta`),
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
                kicker: t("labels.upcoming"),
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
            <h2 className={styles.closerTitle}>{t("closer.title")}</h2>
            <p className={styles.closerBody}>{t("closer.body")}</p>
            <TextCTA href="/contact">{t("closer.cta")}</TextCTA>
          </Reveal>
        </div>
      </section>
    </>
  );
}
