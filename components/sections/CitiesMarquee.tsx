import { getTranslations } from "next-intl/server";
import styles from "./CitiesMarquee.module.css";

const CITIES = [
  "New York",
  "Barcelona",
  "Madrid",
  "London",
  "Paris",
  "Milan",
  "Miami",
  "Los Angeles",
  "Dubai",
  "Doha",
];

export default async function CitiesMarquee() {
  const t = await getTranslations("home");
  // Duplicate inline so the marquee loops seamlessly without a visible gap.
  const items = [...CITIES, ...CITIES];

  return (
    <section className={styles.cities} id="cities">
      <p className={`section-label ${styles.label}`}>{t("marquee.label")}</p>
      <div className={styles.marquee}>
        {items.map((city, i) => (
          <span key={`${city}-${i}`} className={styles.row}>
            <span className={styles.city}>{city}</span>
            <span className={styles.dot} aria-hidden="true" />
          </span>
        ))}
      </div>
    </section>
  );
}
