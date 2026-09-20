import { getTranslations } from "next-intl/server";
import Reveal from "@/components/effects/Reveal";
import TextCTA from "@/components/ui/TextCTA";
import SegmentCards, {
  type SegmentCard,
} from "@/components/sections/SegmentCards";
import { B2B_SEGMENTS } from "@/lib/b2b/segments";
import styles from "./WorkWithRelier.module.css";

/**
 * Bloque "Work with Relier" del home (roadmap SEO sep-2026, R08): cuatro cards
 * que reparten la autoridad del home hacia el hub /for-business/ y sus cuatro
 * segmentos. Va después de la banda de credenciales y antes de Events, como
 * pide el roadmap ("después de Services y antes de Events").
 *
 * Los anchors de las cards y del link al hub son los del plan de internal
 * linking, por eso se leen desde `services.forBusiness.segments.*.anchor` en el
 * server y no se inventan acá. El namespace `services` no viaja al cliente.
 */
export default async function WorkWithRelier() {
  const t = await getTranslations("home.work");
  const ts = await getTranslations("services.forBusiness.segments");

  const items: SegmentCard[] = B2B_SEGMENTS.map((s) => ({
    id: s.id,
    href: s.href,
    title: ts(`${s.id}.title`),
    body: ts(`${s.id}.blurb`),
    cta: ts(`${s.id}.anchor`),
  }));

  return (
    <section className={styles.work} id="for-business">
      <div className="container">
        <Reveal>
          <header className={styles.header}>
            <div className={styles.headText}>
              <p className={styles.kicker}>{t("kicker")}</p>
              <h2 className={styles.title}>
                {t("titleLine1")}
                <br />
                <span className={styles.muted}>{t("titleLine2")}</span>
              </h2>
              <p className={styles.lead}>{t("lead")}</p>
            </div>
            <div className={styles.headCta}>
              <TextCTA href="/for-business">{t("hubCta")}</TextCTA>
            </div>
          </header>
        </Reveal>
        <SegmentCards items={items} />
      </div>
    </section>
  );
}
