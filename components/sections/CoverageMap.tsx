"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import { ALL_CITIES, COVERAGE, project } from "@/lib/coverage/data";
import styles from "./CoverageMap.module.css";

export default function CoverageMap() {
  const t = useTranslations("home");
  const [showAll, setShowAll] = useState(false);

  return (
    <section className={styles.coverage} id="coverage">
      <div className="container">
        <Reveal>
          <header className={styles.header}>
            <p className={styles.kicker}>{t("coverage.kicker")}</p>
            <h2 className={styles.title}>
              {t("coverage.titleLine1")}
              <br />
              <span className="muted">{t("coverage.titleLine2")}</span>
            </h2>
            <p className={styles.lead}>{t("coverage.lead")}</p>
          </header>
        </Reveal>

        <Reveal>
          <div
            className={styles.map}
            role="img"
            aria-label={t("coverage.mapAria")}
          >
            <div className={styles.land} aria-hidden="true" />
            <div className={styles.dots} aria-hidden="true" />
            {ALL_CITIES.map((c) => {
              const { x, y } = project(c.lat, c.lon);
              return (
                <span
                  key={c.name}
                  className={`${styles.pin} ${c.hub ? styles.pinHub : ""} ${c.hub && c.lon < 0 ? styles.pinWest : ""}`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <span className={styles.pinDot} />
                  <span className={styles.pinLabel}>{c.name}</span>
                </span>
              );
            })}
          </div>

          <div className={styles.bar}>
            <p className={styles.caption}>{t("coverage.caption")}</p>
            {/* Figma oct-2026: el toggle pasa a botón primario, centrado. */}
            <Button
              className={styles.toggle}
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              aria-controls="coverage-full"
            >
              {showAll ? t("coverage.hide") : t("coverage.viewAll")}
            </Button>
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
                <h3 className={styles.fullRegionLabel}>
                  {t(`coverage.regions.${region.label}`)}
                </h3>
                <div className={styles.fullCountries}>
                  {region.countries.map((c) => (
                    <div key={c.country} className={styles.fullCountry}>
                      <p className={styles.fullCountryName}>
                        {t(`coverage.countries.${c.country}`)}
                      </p>
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
