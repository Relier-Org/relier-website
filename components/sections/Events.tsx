import type { ComponentType } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import TextCTA from "@/components/ui/TextCTA";
import { CarIcon } from "@/components/icons/SegmentIcons";
import { BallIcon, FlagIcon } from "@/components/icons/EventMetricIcons";
import type { IconProps } from "@/components/icons/types";
import { EVENTS, HOME_EVENTS_LIMIT } from "@/lib/events/data";
import { cn } from "@/lib/utils/cn";
import styles from "./Events.module.css";

const METRIC_ICONS: Record<string, ComponentType<IconProps>> = {
  trips: BallIcon,
  suv: CarIcon,
  final: FlagIcon,
};

/**
 * Home teaser for the events operation, on the light band that breaks up the
 * top half of the page. Sits above Fleet on purpose (client, 05-aug-2026): the
 * service comes before the vehicles.
 *
 * Layout from the oct-2026 redesign: the operated recap as a dark photo card on
 * the left, a short list of events beside it, and "See all events" closing that
 * list. The list replaced the carousel: each row leads with the date so it reads
 * as an event at a glance, and the CTA is the short "Book transport" (designer's
 * note — the long one did not add anything).
 *
 * Event copy is read from `services.signatureEvents` so the dossier and this
 * teaser never drift; only the section's own framing lives in `home.events`.
 */
export default async function Events() {
  const t = await getTranslations("home.events");
  const te = await getTranslations("services.signatureEvents");

  const featured = EVENTS.find((e) => e.featured);
  const list = EVENTS.filter((e) => !e.featured).slice(0, HOME_EVENTS_LIMIT);
  const anyUpcoming = list.some((e) => e.status === "upcoming");

  return (
    <section className={styles.events} id="events">
      <div className="container">
        <Reveal className={styles.head}>
          <div>
            <p className={styles.kicker}>{t("kicker")}</p>
            <h2 className={styles.title}>
              {t("titleLine1")}{" "}
              <span className={styles.muted}>{t("titleLine2")}</span>
            </h2>
          </div>
          <p className={styles.lead}>{t("lead")}</p>
        </Reveal>

        <div className={styles.layout}>
          {featured ? (
            <Reveal className={styles.featured}>
              {featured.image ? (
                <div className={styles.media}>
                  <Image
                    src={featured.image}
                    alt={te(`items.${featured.id}.imageAlt`)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 46vw"
                  />
                </div>
              ) : null}
              <div className={styles.body}>
                <p className={styles.meta}>
                  <span className={styles.status}>
                    {te(`labels.status.${featured.status}`)}
                  </span>
                  <span>{te(`items.${featured.id}.dates`)}</span>
                </p>
                <h3 className={styles.name}>
                  {te(`items.${featured.id}.name`)}
                </h3>
                {te.has(`items.${featured.id}.title`) ? (
                  <p className={styles.headline}>
                    {te(`items.${featured.id}.title`)}
                  </p>
                ) : null}

                {featured.metrics ? (
                  <dl className={styles.metrics}>
                    {featured.metrics.map((m) => {
                      const Icon = METRIC_ICONS[m.id];
                      return (
                        <div key={m.id} className={styles.metric}>
                          {Icon ? <Icon className={styles.metricIcon} /> : null}
                          <dd className={styles.metricValue}>{m.value}</dd>
                          <dt className={styles.metricLabel}>
                            {te(`items.${featured.id}.metrics.${m.id}.label`)}
                          </dt>
                        </div>
                      );
                    })}
                  </dl>
                ) : null}

                {featured.href &&
                te.has(`items.${featured.id}.secondaryCta`) ? (
                  <TextCTA href={featured.href} className={styles.cta}>
                    {te(`items.${featured.id}.secondaryCta`)}
                  </TextCTA>
                ) : null}
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.1} className={styles.side}>
            <h3 className={styles.listTitle}>
              {anyUpcoming ? t("listUpcoming") : t("listRecent")}
            </h3>
            <ul className={styles.list}>
              {list.map((e) => {
                // "Aug 30 to Sep 13, 2026 · Fan Week and qualifying from Aug 23":
                // the range is the lead line, the tail goes under it.
                const [range, ...rest] = te(`items.${e.id}.dates`).split(" · ");
                return (
                  <li key={e.id} className={styles.item}>
                    {e.image ? (
                      <div className={styles.thumb}>
                        <Image
                          src={e.image}
                          alt={te(`items.${e.id}.imageAlt`)}
                          fill
                          sizes="120px"
                        />
                      </div>
                    ) : null}
                    <div className={styles.itemBody}>
                      <span
                        className={cn(
                          styles.status,
                          styles.statusOnLight,
                          e.status === "upcoming" && styles.statusUpcoming
                        )}
                      >
                        {te(`labels.status.${e.status}`)}
                      </span>
                      <p className={styles.itemDates}>
                        <span>{range}</span>
                        {rest.length ? <span>{rest.join(" · ")}</span> : null}
                      </p>
                      <h4 className={styles.itemName}>
                        {te(`items.${e.id}.name`)}
                      </h4>
                      {te.has(`items.${e.id}.service`) ? (
                        <p className={styles.itemService}>
                          {te(`items.${e.id}.service`)}
                        </p>
                      ) : null}
                      <TextCTA
                        href="/online-reservation"
                        tone="light"
                        className={styles.itemCta}
                      >
                        {e.status === "operated"
                          ? te("labels.ctaBook")
                          : te(`items.${e.id}.cta`)}
                      </TextCTA>
                    </div>
                  </li>
                );
              })}
            </ul>
            {/* Closes the list it belongs to rather than floating at the foot
                of the section (client, 11-aug): primario desde el Figma. */}
            <Button href="/signature-events" className={styles.seeAll}>
              {t("seeAll")}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
