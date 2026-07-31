import { useTranslations } from "next-intl";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import styles from "./ServiceCloser.module.css";

interface ServiceCloserProps {
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function ServiceCloser({
  title,
  body,
  ctaLabel,
  ctaHref = "/#booking",
}: ServiceCloserProps) {
  const t = useTranslations("common");

  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal className={styles.inner}>
          <div className={styles.text}>
            <h2 className={styles.h2}>{title}</h2>
            <p className={styles.body}>{body}</p>
          </div>
          <div className={styles.actions}>
            <Button href={ctaHref} withArrow className={styles.cta}>
              {ctaLabel ?? t("bookOnline")}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
