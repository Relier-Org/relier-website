/**
 * Events Relier covers. Two states: `operated` (already run — the recap carries
 * the operation's real figures) and `upcoming` (drives to booking).
 *
 * All copy lives in `messages/<locale>/services.json` under
 * `events.items.<id>` — the /events dossier and the home teaser both read from
 * there, so an edition, a date or a venue is only written once. Values, images
 * and links live here.
 *
 * When an upcoming event finishes and the numbers are worth showing, flip
 * `status` and add its `metrics` (label + description go in the message files).
 */

export interface EventMetric {
  /** Copy keys: `items.<event>.metrics.<id>.label` and `.desc`. */
  id: string;
  value: string;
}

export interface EventEntry {
  /** Copy key: `events.items.<id>`. */
  id: string;
  status: "operated" | "upcoming";
  /** Rendered large on the home teaser. One at most. */
  featured?: boolean;
  image?: string;
  /** Secondary link, when the event has a page of its own. */
  href?: string;
  /** What Relier ran. Client figures — never estimates. */
  metrics?: EventMetric[];
  /**
   * ISO dates for the Event node in the JSON-LD (schema matrix, oct-2026). Same
   * range as the visible `items.<id>.dates` copy — keep both in sync.
   */
  startDate: string;
  endDate: string;
}

/**
 * Photography rule (client, 11-aug-2026): the **operated** event keeps a Relier
 * photo — it is our operation, the photo is the argument. The **upcoming** ones
 * carry a shot of the event itself.
 *
 * Those four come from Wikimedia Commons, CC0 or CC BY, built by
 * `scripts/make-event-photos.mjs`. **Three of them are CC BY and require visible
 * attribution** — see `docs/image-credits.md` and the credit line at the foot of
 * the upcoming band. Do not swap them for images off a stock site without
 * checking the licence: the "free preview" URLs those sites expose through the
 * Openverse API come watermarked.
 */
export const EVENTS: EventEntry[] = [
  {
    id: "world-cup",
    startDate: "2026-06-11",
    endDate: "2026-07-19",
    status: "operated",
    featured: true,
    image: "/images/services/world-cup/hero.webp",
    href: "/fifa-world-cup-2026-private-transportation",
    metrics: [
      { id: "trips", value: "1,081" },
      { id: "suv", value: "597" },
      { id: "final", value: "205" },
    ],
  },
  {
    id: "us-open",
    startDate: "2026-08-30",
    endDate: "2026-09-13",
    status: "upcoming",
    image: "/images/events/us-open.webp",
  },
  {
    id: "fashion-week",
    startDate: "2026-09-10",
    endDate: "2026-09-15",
    status: "upcoming",
    image: "/images/events/fashion-week.webp",
  },
  {
    id: "spanish-gp",
    startDate: "2026-09-11",
    endDate: "2026-09-13",
    status: "upcoming",
    image: "/images/events/spanish-gp.webp",
  },
  {
    id: "un-assembly",
    startDate: "2026-09-22",
    endDate: "2026-09-28",
    status: "upcoming",
    image: "/images/events/un-assembly.webp",
  },
];

/** Home teaser: the featured recap plus this many upcoming events. */
export const HOME_EVENTS_LIMIT = 4;
