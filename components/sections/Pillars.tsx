import { getTranslations } from "next-intl/server";
import Reveal from "@/components/effects/Reveal";
import {
  CalendarIcon,
  GlobeIcon,
  ShieldTickIcon,
} from "@/components/icons/PillarIcons";
import styles from "./Pillars.module.css";

const PILLARS = [
  { icon: ShieldTickIcon, key: "safe" },
  { icon: GlobeIcon, key: "solutions" },
  { icon: CalendarIcon, key: "book" },
];

export default async function Pillars() {
  const t = await getTranslations("home");

  return (
    <section className={styles.pillars}>
      <div className="container">
        {/* Figma oct-2026: título a la izquierda, lead a la derecha. */}
        <Reveal className={styles.head}>
          <div>
            <p className={styles.kicker}>{t("pillars.kicker")}</p>
            <h2 className={styles.title}>
              {t.rich("pillars.title", {
                muted: (c) => <span className="muted">{c}</span>,
              })}
            </h2>
          </div>
          <p className={styles.lead}>{t("pillars.lead")}</p>
        </Reveal>

        <Reveal className={styles.cols}>
          {PILLARS.map(({ icon: Icon, key }) => (
            <div key={key} className={styles.col}>
              <Icon className={styles.icon} />
              <h3>{t(`pillars.items.${key}.title`)}</h3>
              <p>{t(`pillars.items.${key}.body`)}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
