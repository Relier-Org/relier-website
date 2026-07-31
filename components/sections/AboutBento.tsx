import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import Reveal from "@/components/effects/Reveal";
import styles from "./AboutBento.module.css";

export default function AboutBento() {
  const t = useTranslations("pages");
  const tc = useTranslations("common");
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <Reveal className={styles.bento}>
            <div className={cn(styles.tile, styles.photoTile)}>
              <Image
                src="/images/about-2.webp"
                alt={t("about.bento.photoAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={styles.photo}
              />
            </div>
            <div className={cn(styles.tile, styles.videoTile)}>
              <video
                className={styles.video}
                src="/videos/reel-1.mp4"
                poster="/videos/reel-1-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
            </div>
            <div className={cn(styles.tile, styles.videoTile)}>
              <video
                className={styles.video}
                src="/videos/reel-3.mp4"
                poster="/videos/reel-3-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
            </div>
          </Reveal>

          <Reveal className={styles.text}>
            <p className={cn("eyebrow", styles.eyebrow)}>{tc("whoWeAre")}</p>
            <h2 className={styles.h2}>
              {t("about.bento.titleLine1")}
              <br />
              <span className="muted">{t("about.bento.titleLine2")}</span>
            </h2>
            <div className={styles.body}>
              <p>{t("about.bento.body1")}</p>
              <p>{t("about.bento.body2")}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
