import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/effects/Reveal";
import TextCTA from "@/components/ui/TextCTA";
import EventsCarousel, {
  type EventsCarouselItem,
} from "@/components/sections/EventsCarousel";
import { EVENTS, HOME_EVENTS_LIMIT } from "@/lib/events/data";
import { cn } from "@/lib/utils/cn";
import styles from "./Events.module.css";

/**
 * Home teaser for the events operation, on the light band that breaks up the
 * top half of the page. Sits above Fleet on purpose (client, 05-aug-2026): the
 * service comes before the vehicles. Replaces the standalone World Cup section —
 * the cup is now the recap here, and everything upcoming routes to booking.
 *
 * Event copy is read from `services.events` so the dossier on /events and this
 * teaser never drift; only the section's own framing lives in `home.events`.
 */
export default async function Events() {
  const t = await getTranslations("home.events");
  const te = await getTranslations("services.signatureEvents");

  const featured = EVENTS.find((e) => e.featured);

  // Translated on the server and handed to the carousel as plain strings, so the
  // `services` namespace never has to be serialized to the client.
  const upcoming: EventsCarouselItem[] = EVENTS.filter((e) => !e.featured)
    .slice(0, HOME_EVENTS_LIMIT)
    .map((e) => ({
      id: e.id,
      status: te(`labels.status.${e.status}`),
      name: te(`items.${e.id}.name`),
      dates: te(`items.${e.id}.dates`),
      service: te.has(`items.${e.id}.service`)
        ? te(`items.${e.id}.service`)
        : undefined,
      cta: te(`items.${e.id}.cta`),
      href: "/online-reservation",
    }));

  return (
    <section className={styles.events} id="events">
      <div className="container">
        <Reveal className={styles.head}>
          <p className={styles.kicker}>{t("kicker")}</p>
          <h2 className={styles.title}>
            {t("titleLine1")}{" "}
            <span className={styles.muted}>{t("titleLine2")}</span>
          </h2>
          <p className={styles.lead}>{t("lead")}</p>
          <TextCTA
            href="/signature-events"
            tone="light"
            className={styles.headCta}
          >
            {t("seeAll")}
          </TextCTA>
        </Reveal>

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
                <span className={cn(styles.status, styles.statusOperated)}>
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
                  {featured.metrics.map((m) => (
                    <div key={m.id} className={styles.metric}>
                      <dt className={styles.metricLabel}>
                        {te(`items.${featured.id}.metrics.${m.id}.label`)}
                      </dt>
                      <dd className={styles.metricValue}>{m.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {featured.href && te.has(`items.${featured.id}.secondaryCta`) ? (
                <TextCTA
                  href={featured.href}
                  tone="light"
                  className={styles.cta}
                >
                  {te(`items.${featured.id}.secondaryCta`)}
                </TextCTA>
              ) : null}
            </div>
          </Reveal>
        ) : null}

        <Reveal delay={0.1}>
          <EventsCarousel items={upcoming} label={t("kicker")} />
        </Reveal>
      </div>
    </section>
  );
}
