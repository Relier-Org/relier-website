import type { ComponentType } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import TextCTA from "@/components/ui/TextCTA";
import EventsUpcoming, {
  type UpcomingItem,
} from "@/components/sections/EventsUpcoming";
import { CarIcon } from "@/components/icons/SegmentIcons";
import { BallIcon, FlagIcon } from "@/components/icons/EventMetricIcons";
import type { IconProps } from "@/components/icons/types";
import { EVENTS } from "@/lib/events/data";
import styles from "./EventsDossier.module.css";

// Los mismos íconos que las cifras del banner del home (Events.tsx).
const METRIC_ICONS: Record<string, ComponentType<IconProps>> = {
  trips: BallIcon,
  suv: CarIcon,
  final: FlagIcon,
};

/**
 * Body of /signature-events, in two bands: the featured recap as a wide banner
 * on cream with the rest of the events (upcoming, or recent once they have all
 * been run) as light cards under it (Figma oct-2026), then the closer.
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
  // Operated with client figures first, the rest after, each in date order
  // (EVENTS is already chronological; the sort is stable). Nico, 22-oct-2026.
  const rest = EVENTS.filter((e) => e !== recap).sort(
    (a, b) => Number(!a.metrics) - Number(!b.metrics)
  );

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
    // before the event; once run, the card points to booking in general. The
    // oct-2026 upcoming cards carry no CTA of their own and use the generic one.
    cta:
      e.status === "upcoming" && t.has(`items.${e.id}.cta`)
        ? t(`items.${e.id}.cta`)
        : t("labels.ctaBook"),
    metrics: e.metrics?.map((m) => ({
      value: m.value,
      label: t(`items.${e.id}.metrics.${m.id}.label`),
    })),
    image: e.image,
    imageAlt: t(`items.${e.id}.imageAlt`),
  }));

  return (
    <>
      {/* Destacado como banner a lo ancho (Figma oct-2026): foto de fondo y
          el texto abajo a la izquierda sobre un degradé, con las cifras en una
          fila con íconos, como el banner del home. */}
      {recap ? (
        <section className={styles.recap}>
          <div className="container">
            <Reveal className={styles.banner}>
              {recap.image ? (
                <div className={styles.bannerMedia}>
                  <Image
                    src={recap.image}
                    alt={t(`items.${recap.id}.imageAlt`)}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1180px"
                  />
                </div>
              ) : null}
              <div className={styles.bannerBody}>
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

                {recap.metrics ? (
                  <dl className={styles.figures}>
                    {recap.metrics.map((m) => {
                      const Icon = METRIC_ICONS[m.id];
                      return (
                        <div key={m.id} className={styles.figure}>
                          {Icon ? (
                            <Icon className={styles.figureIcon} aria-hidden="true" />
                          ) : null}
                          <dd className={styles.figureValue}>{m.value}</dd>
                          <dt className={styles.figureLabel}>
                            {t(`items.${recap.id}.metrics.${m.id}.label`)}
                          </dt>
                        </div>
                      );
                    })}
                  </dl>
                ) : null}

                <div className={styles.ctaRow}>
                  <Button href="/online-reservation" withArrow>
                    {t(`items.${recap.id}.cta`)}
                  </Button>
                  {recap.href && t.has(`items.${recap.id}.secondaryCta`) ? (
                    <TextCTA href={recap.href}>
                      {t(`items.${recap.id}.secondaryCta`)}
                    </TextCTA>
                  ) : null}
                </div>
              </div>
            </Reveal>

            {/* El resto de los eventos sigue en la misma franja crema, debajo
                del banner, como cards claras (Figma oct-2026). */}
          <Reveal className={styles.upcomingList}>
            <EventsUpcoming
              items={upcoming}
              labels={{
                recent: t("labels.recent"),
                upcoming: t("labels.upcoming"),
                viewCards: t("labels.viewCards"),
                viewRows: t("labels.viewRows"),
                ctaShort: t("labels.ctaShort"),
              }}
            />
          </Reveal>
          </div>
        </section>
      ) : null}

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
