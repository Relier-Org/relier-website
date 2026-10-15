import { useTranslations } from "next-intl";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import TextCTA from "@/components/ui/TextCTA";
import styles from "./ServiceCloser.module.css";

interface ServiceCloserProps {
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Link secundario (p. ej. child → hub), anchor del plan de internal linking. */
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Línea chica bajo el cuerpo, dirigida a un público puntual (p. ej. agentes). */
  note?: string;
}

export default function ServiceCloser({
  title,
  body,
  ctaLabel,
  ctaHref = "/#booking",
  secondaryHref,
  secondaryLabel,
  note,
}: ServiceCloserProps) {
  const t = useTranslations("common");

  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal className={styles.inner}>
          <div className={styles.text}>
            <h2 className={styles.h2}>{title}</h2>
            <p className={styles.body}>{body}</p>
            {note ? <p className={styles.note}>{note}</p> : null}
          </div>
          <div className={styles.actions}>
            <Button href={ctaHref} withArrow className={styles.cta}>
              {ctaLabel ?? t("bookOnline")}
            </Button>
            {secondaryHref && secondaryLabel ? (
              <TextCTA href={secondaryHref}>{secondaryLabel}</TextCTA>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
