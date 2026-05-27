import Reveal from "@/components/effects/Reveal";
import styles from "./CoverageMap.module.css";

// New section (brief §6). Visual reference: Rolso's coverage map. This is a
// PLACEHOLDER built from the cities we already know — the owners confirm the
// final country list, after which we can drop in a proper world-map asset.
//
// Pins are % positions over /images/world-map.svg (viewBox 1010×666, longitude
// linear over 360°, latitude trimmed ~83°N→-58°S). The panel keeps the SVG's
// aspect ratio so these % land on the right continents.
type Pin = { name: string; x: number; y: number; hub?: boolean };

const PINS: Pin[] = [
  { name: "Los Angeles", x: 17.2, y: 34.8 },
  { name: "New York", x: 29.4, y: 30.0, hub: true },
  { name: "Miami", x: 27.8, y: 40.6 },
  { name: "Madrid", x: 49.0, y: 30.2 },
  { name: "Barcelona", x: 50.6, y: 29.5, hub: true },
  { name: "London", x: 50.0, y: 22.3 },
  { name: "Paris", x: 50.7, y: 24.2 },
  { name: "Milan", x: 52.5, y: 26.6 },
  { name: "Doha", x: 64.3, y: 40.9 },
  { name: "Dubai", x: 65.4, y: 41.0 },
];

const REGIONS: { label: string; places: string[] }[] = [
  { label: "Americas", places: ["New York", "Miami", "Los Angeles"] },
  {
    label: "Europe",
    places: ["Barcelona", "Madrid", "London", "Paris", "Milan"],
  },
  { label: "Middle East", places: ["Dubai", "Doha"] },
];

export default function CoverageMap() {
  return (
    <section className={styles.coverage} id="coverage">
      <div className="container">
        <Reveal>
          <header className={styles.header}>
            <p className={styles.kicker}>Global coverage</p>
            <h2 className={styles.title}>
              Two homes,
              <br />
              <span className="muted">one network worldwide.</span>
            </h2>
            <p className={styles.lead}>
              Headquartered in New York and Barcelona, operating across the
              Americas, Europe and the Middle East — with the same chauffeured
              standard in every city.
            </p>
          </header>
        </Reveal>

        <Reveal className={styles.split}>
          <div className={styles.mapWrap}>
            <div className={styles.map} role="img" aria-label="Map of Relier coverage across the Americas, Europe and the Middle East">
              <div className={styles.land} aria-hidden="true" />
              <div className={styles.dots} aria-hidden="true" />
              {PINS.map((p) => (
                <span
                  key={p.name}
                  className={`${styles.pin} ${p.hub ? styles.pinHub : ""}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <span className={styles.pinDot} />
                  <span className={styles.pinLabel}>{p.name}</span>
                </span>
              ))}
            </div>
            <p className={styles.caption}>
              Indicative coverage — full destination list confirmed soon.
            </p>
          </div>

          <div className={styles.legend}>
            {REGIONS.map((r) => (
              <div key={r.label} className={styles.region}>
                <h3 className={styles.regionLabel}>{r.label}</h3>
                <ul className={styles.regionList}>
                  {r.places.map((place) => (
                    <li key={place}>{place}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
