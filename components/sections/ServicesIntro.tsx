import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import styles from "./ServicesIntro.module.css";

/**
 * Franja crema de presentación ("Why Relier"). La usan /services y
 * /for-business; `namespace` elige el copy y los links salen sólo si el
 * namespace los trae.
 */
export default function ServicesIntro({
  namespace = "services.intro",
}: {
  namespace?: "services.intro" | "services.forBusiness.intro";
}) {
  const t = useTranslations(namespace);
  const tl = useTranslations("services.intro.links");
  const withLinks = namespace === "services.intro";

  return (
    <section className={styles.section}>
      <div className={cn("container", styles.container)}>
        <Reveal className={styles.eyebrowRow}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.eyebrow}>{t("eyebrow")}</span>
        </Reveal>
        <Reveal className={styles.body} delay={0.05}>
          {t("body")}
        </Reveal>
        {/* Internal linking (roadmap SEO sep-2026): el hub de servicios abre
            ruta hacia el hub B2B y refuerza la landing de aeropuerto, que no
            está entre las 4 cards de abajo. */}
        {withLinks ? (
        <Reveal className={styles.links} delay={0.1}>
          {/* Secundarios: el terciario queda para el "Learn more" de cada
              card y el primario para el cierre (jerarquía oct-2026). */}
          <Button href="/for-business" variant="secondary" tone="light">
            {tl("business")}
          </Button>
          <Button href="/airport" variant="secondary" tone="light">
            {tl("airport")}
          </Button>
        </Reveal>
        ) : null}
      </div>
    </section>
  );
}
