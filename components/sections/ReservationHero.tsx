import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import styles from "./ReservationHero.module.css";

export default function ReservationHero() {
  const t = useTranslations("services.reservation.hero");
  const tc = useTranslations("common");

  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <Image
          src="/images/online-reservation/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.img}
        />
      </div>
      <div className={cn("container", styles.inner)}>
        <p className={cn("eyebrow", styles.eyebrow)}>{t("eyebrow")}</p>
        <h1 className={styles.h1}>
          {t("titleLine1")}
          <br />
          <span className={styles.muted}>{t("titleLine2")}</span>
        </h1>
        <p className={styles.lead}>{tc("turnTripIntoExperience")}</p>
      </div>
    </section>
  );
}
