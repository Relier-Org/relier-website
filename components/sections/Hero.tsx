import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils/cn";
import AmbientVideo from "@/components/ui/AmbientVideo";
import styles from "./Hero.module.css";

export default async function Hero() {
  const t = await getTranslations("home");

  return (
    <section className={styles.hero}>
      <AmbientVideo
        wrapClassName={styles.bg}
        className={styles.video}
        poster="/videos/hero/horizontal-poster.jpg"
        toggle={{
          pauseLabel: t("hero.pauseVideo"),
          playLabel: t("hero.playVideo"),
          className: styles.videoToggle,
        }}
      >
        {/* Mobile portrait: vertical 720x1280 framing keeps the subject in view. */}
        <source
          src="/videos/hero/vertical.mp4"
          type="video/mp4"
          media="(max-width: 720px)"
        />
        <source src="/videos/hero/horizontal.mp4" type="video/mp4" />
      </AmbientVideo>
      <div className={cn("container", styles.inner)}>
        <p className={cn("eyebrow", styles.eyebrow)}>{t("hero.eyebrow")}</p>
        <h1 className={styles.h1}>
          {t("hero.titleLine1")}
          <br />
          <span className={styles.muted}>{t("hero.titleLine2")}</span>
        </h1>
        <p className={styles.subtitle}>{t("hero.subtitle")}</p>
      </div>
    </section>
  );
}
