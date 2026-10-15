import { getTranslations } from "next-intl/server";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import {
  BusIcon,
  CarIcon,
  RouteIcon,
  TruckIcon,
} from "@/components/icons/SegmentIcons";
import SegmentCards, {
  type SegmentCard,
} from "@/components/sections/SegmentCards";
import { B2B_SEGMENTS, type B2BSegmentId } from "@/lib/b2b/segments";
import styles from "./WorkWithRelier.module.css";

const SEGMENT_ICONS: Record<B2BSegmentId, SegmentCard["icon"]> = {
  advisors: BusIcon,
  accounts: CarIcon,
  events: TruckIcon,
  affiliates: RouteIcon,
};

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
export default async function WorkWithRelier({
  variant = "home",
}: {
  /** about = "Who we serve" de /about: su propio título, sin lead, y los
      anchors del plan de internal linking de esa página (T17). */
  variant?: "home" | "about";
} = {}) {
  const t = await getTranslations("home.work");
  const ts = await getTranslations("services.forBusiness.segments");
  const ta = await getTranslations("pages.about.serve");
  const isAbout = variant === "about";

  const items: SegmentCard[] = B2B_SEGMENTS.map((s) => ({
    id: s.id,
    href: s.href,
    title: ts(`${s.id}.title`),
    body: ts(`${s.id}.blurb`),
    cta: isAbout
      ? ta(s.id === "accounts" ? "corporate" : s.id)
      : ts(`${s.id}.anchor`),
    icon: SEGMENT_ICONS[s.id],
  }));

  if (isAbout) {
    const [first, ...rest] = ta("title").split(", ");
    const aboutLine1 = rest.length ? `${first},` : first;
    const aboutLine2 = rest.join(", ");
    return (
      <section className={styles.work}>
        <div className="container">
          <Reveal>
            <header className={styles.header}>
              <div className={`${styles.headText} ${styles.headTextWide}`}>
                <p className={styles.kicker}>{ta("eyebrow")}</p>
                {/* Corta en la coma, misma gramática de dos líneas que el
                    título del home ("…transportation / for business."). */}
                <h2 className={styles.title}>
                  {aboutLine1}
                  <br />
                  <span className={styles.muted}>{aboutLine2}</span>
                </h2>
              </div>
            </header>
          </Reveal>
          <SegmentCards items={items} />
          {/* Secundario: en About la acción principal no es el hub B2B. */}
          <div className={styles.foot}>
            <Button href="/for-business" variant="secondary">
              {t("hubCta")}
            </Button>
          </div>
        </div>
      </section>
    );
  }

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
            </div>
            {/* Título a la izquierda, descripción a la derecha (Figma oct-2026). */}
            <p className={styles.lead}>{t("lead")}</p>
          </header>
        </Reveal>
        <SegmentCards items={items} />
        <div className={styles.foot}>
          <Button href="/for-business">{t("hubCta")}</Button>
        </div>
      </div>
    </section>
  );
}
