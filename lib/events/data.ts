/**
 * Events Relier covers. Two states: `operated` (already run — the recap carries
 * the operation's real figures) and `upcoming` (drives to booking).
 *
 * All copy lives in `messages/<locale>/services.json` under
 * `events.items.<id>` — the /events dossier and the home teaser both read from
 * there, so an edition, a date or a venue is only written once. Values, images
 * and links live here.
 *
 * When an upcoming event finishes, flip `status` to `operated` (client, 05-oct-2026:
 * the four September events were run by Relier). Add `metrics` only with client
 * figures; on the /signature-events cards only the label shows, the `desc` is
 * for the recap banner. With nothing upcoming, the /signature-events grid reads "Recent events"
 * and each card's CTA switches to the generic booking one.
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
  /**
   * Licence attribution for `image`, when the licence asks for it (see
   * `docs/image-credits.md`). Any surface that shows the photo shows this too.
   */
  photoCredit?: { author: string; licence: string };
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
  /** City for the Service's `areaServed` in the JSON-LD. Defaults to the business area. */
  city?: string;
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
  // Upcoming, oct-2026 to jun-2027 (Andrés, 21-oct-2026): US first, then
  // Europe, ahead of the operated ones. Photos from Wikimedia Commons (22-oct,
  // see docs/image-credits.md) until Andrés sends the client's own.
  {
    id: "nyc-marathon",
    startDate: "2026-11-01",
    endDate: "2026-11-01",
    status: "upcoming",
    city: "New York",
    image: "/images/events/nyc-marathon.webp",
    photoCredit: { author: "Metropolitan Transportation Authority of the State of New York", licence: "CC BY 2.0" },
  },
  {
    id: "holidays-new-york",
    startDate: "2026-11-04",
    endDate: "2027-01-04",
    status: "upcoming",
    city: "New York",
    image: "/images/events/holidays-new-york.webp",
    photoCredit: { author: "Mack Male", licence: "CC BY-SA 2.0" },
  },
  {
    id: "las-vegas-grand-prix",
    startDate: "2026-11-19",
    endDate: "2026-11-21",
    status: "upcoming",
    city: "Las Vegas",
    image: "/images/events/las-vegas-grand-prix.webp",
    photoCredit: { author: "YosemiteYamper", licence: "CC BY-SA 4.0" },
  },
  {
    id: "thanksgiving-parade",
    startDate: "2026-11-26",
    endDate: "2026-11-26",
    status: "upcoming",
    city: "New York",
    image: "/images/events/thanksgiving-parade.webp",
    photoCredit: { author: "Phil Roeder", licence: "CC BY 2.0" },
  },
  {
    id: "art-basel-miami-beach",
    startDate: "2026-12-02",
    endDate: "2026-12-06",
    status: "upcoming",
    city: "Miami Beach",
    image: "/images/events/art-basel-miami-beach.webp",
    photoCredit: { author: "Jennifer 8. Lee", licence: "CC BY-SA 4.0" },
  },
  {
    id: "new-years-eve-nyc",
    startDate: "2026-12-31",
    endDate: "2026-12-31",
    status: "upcoming",
    city: "New York",
    image: "/images/events/new-years-eve-nyc.webp",
    photoCredit: { author: "Anthony Quintano", licence: "CC BY 2.0" },
  },
  {
    id: "super-bowl-lxi",
    startDate: "2027-02-14",
    endDate: "2027-02-14",
    status: "upcoming",
    city: "Los Angeles",
    image: "/images/events/super-bowl-lxi.webp",
    photoCredit: { author: "Don Norris", licence: "CC BY 2.0" },
  },
  {
    id: "champions-league-madrid",
    startDate: "2026-11-03",
    endDate: "2027-01-27",
    status: "upcoming",
    city: "Madrid",
    image: "/images/events/champions-league-madrid.webp",
    photoCredit: { author: "miguelangelgc", licence: "CC BY-SA 3.0" },
  },
  {
    id: "champions-league-barcelona",
    startDate: "2026-11-03",
    endDate: "2027-01-27",
    status: "upcoming",
    city: "Barcelona",
    image: "/images/events/champions-league-barcelona.webp",
    photoCredit: { author: "Niels Elgaard Larsen", licence: "CC BY-SA 3.0" },
  },
  {
    id: "champions-league-final-2027",
    startDate: "2027-06-05",
    endDate: "2027-06-05",
    status: "upcoming",
    city: "Madrid",
    image: "/images/events/champions-league-final-2027.webp",
  },
  {
    id: "us-open",
    startDate: "2026-08-30",
    endDate: "2026-09-13",
    status: "operated",
    image: "/images/events/us-open.webp",
    photoCredit: { author: "slgckgc", licence: "CC BY 2.0" },
    // Client figures (22-oct-2026): services in New York, mostly Escalades.
    metrics: [{ id: "services", value: "168" }],
  },
  {
    id: "fashion-week",
    startDate: "2026-09-10",
    endDate: "2026-09-15",
    status: "operated",
    image: "/images/events/fashion-week.webp",
    photoCredit: { author: "Michiel", licence: "CC BY 2.0" },
  },
  {
    id: "spanish-gp",
    startDate: "2026-09-11",
    endDate: "2026-09-13",
    status: "operated",
    image: "/images/events/spanish-gp.webp",
    photoCredit: { author: "Mypoorbrain", licence: "CC BY 2.0" },
    // Client figures (22-oct-2026): every trip of the weekend, V-Class and E-Class.
    metrics: [{ id: "trips", value: "387" }],
  },
  {
    id: "un-assembly",
    startDate: "2026-09-22",
    endDate: "2026-09-28",
    status: "operated",
    image: "/images/events/un-assembly.webp",
  },
];

/** Home teaser: the featured recap plus this many events in the list beside it. */
export const HOME_EVENTS_LIMIT = 2;

/**
 * The events beside the recap on the home: the next upcoming ones that have not
 * ended yet, soonest first, so the list rolls forward on its own as events pass
 * (Nico, 22-oct-2026). The home revalidates daily for that. If fewer are left
 * than the limit, the most recent operated ones fill in.
 */
export function homeEvents(now = new Date()): EventEntry[] {
  const today = now.toISOString().slice(0, 10);
  const next = EVENTS.filter(
    (e) => !e.featured && e.status === "upcoming" && e.endDate >= today
  ).sort((a, b) => a.startDate.localeCompare(b.startDate));
  const recent = EVENTS.filter(
    (e) => !e.featured && e.status === "operated"
  ).sort((a, b) => b.endDate.localeCompare(a.endDate));
  return [...next, ...recent].slice(0, HOME_EVENTS_LIMIT);
}
