"use client";

import { useState } from "react";
import Reveal from "@/components/effects/Reveal";
import { ALL_CITIES, COVERAGE, project } from "@/lib/coverage/data";
import styles from "./CoverageMap.module.css";

export default function CoverageMap() {
  const [showAll, setShowAll] = useState(false);

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
              Headquartered in New York and Barcelona, with the same chauffeured
              standard across 500+ cities in Europe, the Americas, the Middle
              East, Africa and Asia.
            </p>
          </header>
        </Reveal>

        <Reveal>
          <div
            className={styles.map}
            role="img"
            aria-label="Map of Relier coverage across 500+ cities worldwide"
          >
            <div className={styles.land} aria-hidden="true" />
            <div className={styles.dots} aria-hidden="true" />
            {ALL_CITIES.map((c) => {
              const { x, y } = project(c.lat, c.lon);
              return (
                <span
                  key={c.name}
                  className={`${styles.pin} ${c.hub ? styles.pinHub : ""}`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <span className={styles.pinDot} />
                  <span className={styles.pinLabel}>{c.name}</span>
                </span>
              );
            })}
          </div>

          <div className={styles.bar}>
            <p className={styles.caption}>
              500+ cities across 40+ countries — hover the map to explore.
            </p>
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              aria-controls="coverage-full"
            >
              {showAll ? "Hide destinations" : "View all destinations"}
              <span className={styles.toggleIcon} aria-hidden="true">
                {showAll ? "−" : "+"}
              </span>
            </button>
          </div>
        </Reveal>

        <div
          id="coverage-full"
          className={styles.fullList}
          data-open={showAll}
          hidden={!showAll}
        >
          <div className={styles.fullGrid}>
            {COVERAGE.map((region) => (
              <div key={region.label} className={styles.fullRegion}>
                <h3 className={styles.fullRegionLabel}>{region.label}</h3>
                <div className={styles.fullCountries}>
                  {region.countries.map((c) => (
                    <div key={c.country} className={styles.fullCountry}>
                      <p className={styles.fullCountryName}>{c.country}</p>
                      <p className={styles.fullCities}>
                        {c.cities.map((city) => city.name).join(" · ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
