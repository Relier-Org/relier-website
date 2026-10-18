import { getTranslations } from "next-intl/server";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/effects/Reveal";
import VirtuosoBadge from "@/components/ui/VirtuosoBadge";
import styles from "./About.module.css";

export default async function About() {
  const t = await getTranslations("home");

  return (
    <section className={styles.about} id="about">
      <div className="container">
        <Reveal className={styles.grid}>
          <div className={styles.left}>
            <Eyebrow className={styles.eyebrow}>{t("about.eyebrow")}</Eyebrow>
            <h2 className={styles.heading}>
              {t("about.titleLine1")}
              <br />
              {t.rich("about.titleLine2", { em: (c) => <em>{c}</em> })}
            </h2>
            <VirtuosoBadge />
          </div>

          <div className={styles.right}>
            <p>{t("about.p1")}</p>
            <p>{t("about.p2")}</p>
            <Button href="/about" className={styles.btn}>
              {t("about.cta")}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
