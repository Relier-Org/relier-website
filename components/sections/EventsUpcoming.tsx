"use client";

import { useState } from "react";
import Image from "next/image";
import TextCTA from "@/components/ui/TextCTA";
import { GridViewIcon, RowsViewIcon } from "@/components/icons/ViewToggleIcons";
import { cn } from "@/lib/utils/cn";
import styles from "./EventsUpcoming.module.css";

export interface UpcomingItem {
  id: string;
  /** Translated status label ("Operated", "Upcoming"). */
  status: string;
  operated: boolean;
  /** Already-translated strings: the parent is a server component, so the
      `services` namespace never has to be serialized to the client. */
  name: string;
  edition: string;
  dates: string;
  /** Trimmed to just the range: the compact mobile row has no room for the tail. */
  datesShort: string;
  venue: string;
  note?: string;
  service?: string;
  cta: string;
  image?: string;
  imageAlt: string;
}

export interface UpcomingLabels {
  kicker: string;
  viewCards: string;
  viewRows: string;
  /** Stands in for each event's own CTA in the compact mobile row. */
  ctaShort: string;
}

type View = "cards" | "rows";

/**
 * The events below the recap (upcoming, or recent once run), on the cream band
 * under the banner as light cards (Figma oct-2026), switchable between the card grid and full-width rows
 * (client, 11-aug-2026). Cards are the default: the grid is what keeps the page
 * short. Rows give the same content more room to breathe for anyone who wants to
 * read it end to end.
 */
export default function EventsUpcoming({
  items,
  labels,
}: {
  items: UpcomingItem[];
  labels: UpcomingLabels;
}) {
  const [view, setView] = useState<View>("cards");

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h2 className={styles.kicker}>{labels.kicker}</h2>
        <div className={styles.toggle} role="group" aria-label={labels.kicker}>
          <button
            type="button"
            className={cn(styles.toggleBtn, view === "cards" && styles.active)}
            onClick={() => setView("cards")}
            aria-pressed={view === "cards"}
            aria-label={labels.viewCards}
          >
            <GridViewIcon size={13} />
          </button>
          <button
            type="button"
            className={cn(styles.toggleBtn, view === "rows" && styles.active)}
            onClick={() => setView("rows")}
            aria-pressed={view === "rows"}
            aria-label={labels.viewRows}
          >
            <RowsViewIcon size={13} />
          </button>
        </div>
      </div>

      <ul className={cn(styles.list, view === "rows" && styles.listRows)}>
        {items.map((e) => (
          <li key={e.id} className={styles.card}>
            {e.image ? (
              <div className={styles.photo}>
                <Image
                  src={e.image}
                  alt={e.imageAlt}
                  fill
                  /* One stable `sizes` for both views on purpose. Switching it
                     with the view made the browser re-evaluate the srcset of an
                     image that had not loaded yet, and it fell back to the
                     largest candidate (w=3840). A single string also means the
                     same variant serves both views — one fetch, not two. */
                  sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 46vw"
                />
              </div>
            ) : null}
            <div className={styles.body}>
              <p
                className={cn(
                  styles.status,
                  e.operated ? styles.statusOperated : styles.statusUpcoming
                )}
              >
                {e.status}
              </p>
              {/* The date leads, before the name: it is what tells events
                  apart at a glance (designer's note, oct-2026). Both strings
                  ship and CSS picks one: the compact mobile row shows the
                  short range, everything else the full line. */}
              <p className={styles.dates}>
                <span className={styles.long}>{e.dates}</span>
                <span className={styles.short}>{e.datesShort}</span>
              </p>
              <h3 className={styles.name}>{e.name}</h3>
              <p className={styles.edition}>{e.edition}</p>
              <p className={styles.venue}>{e.venue}</p>
              {e.note ? <p className={styles.note}>{e.note}</p> : null}
              {e.service ? <p className={styles.service}>{e.service}</p> : null}
              <TextCTA href="/online-reservation" tone="light" className={styles.cta}>
                <span className={styles.long}>{e.cta}</span>
                <span className={styles.short}>{labels.ctaShort}</span>
              </TextCTA>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
