import { getTranslations } from "next-intl/server";
import Reveal from "@/components/effects/Reveal";
import ShieldIcon from "@/components/icons/ShieldIcon";
import ClockIcon from "@/components/icons/ClockIcon";
import CalendarCheckIcon from "@/components/icons/CalendarCheckIcon";
import styles from "./Pillars.module.css";

const PILLARS = [
  { icon: ShieldIcon, key: "safe" },
  { icon: ClockIcon, key: "solutions" },
  { icon: CalendarCheckIcon, key: "book" },
];

export default async function Pillars() {
  const t = await getTranslations("home");

  return (
    <section className={styles.pillars}>
      <div className="container">
        <Reveal className={styles.head}>
          <p className={styles.kicker}>{t("pillars.kicker")}</p>
          <h2 className={styles.title}>
            {t.rich("pillars.title", {
              muted: (c) => <span className="muted">{c}</span>,
            })}
          </h2>
          <p className={styles.lead}>{t("pillars.lead")}</p>
        </Reveal>

        <Reveal className={styles.cols}>
          {PILLARS.map(({ icon: Icon, key }) => (
            <div key={key} className={styles.col}>
              <div className={styles.icon}>
                <Icon size="100%" />
              </div>
              <h3>{t(`pillars.items.${key}.title`)}</h3>
              <p>{t(`pillars.items.${key}.body`)}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
