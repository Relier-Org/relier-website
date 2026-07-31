import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/effects/Reveal";
import TrophyIcon from "@/components/icons/TrophyIcon";
import StadiumIcon from "@/components/icons/StadiumIcon";
import WorldCupConfetti from "@/components/icons/WorldCupConfetti";
import { cn } from "@/lib/utils/cn";
import styles from "./WorldCup.module.css";

// TODO: client to confirm match dates, venues, package details

const FEATURES = ["coverage", "service", "packages", "chauffeurs"];

export default async function WorldCup() {
  const t = await getTranslations("home");

  return (
    <section className={styles.wc} id="wc">
      <div className={styles.crowdBg} aria-hidden="true">
        <Image
          src="/images/worldcup/aficion.webp"
          alt=""
          fill
          sizes="100vw"
          priority={false}
        />
      </div>
      <WorldCupConfetti className={styles.confetti} />
      <div className={cn("container", styles.inner)}>
        <Reveal className={styles.content}>
          <h2 className={styles.h2}>
            {t("wc.titleLine1")}
            <br />
            {t.rich("wc.titleLine2", { em: (c) => <em>{c}</em> })}
          </h2>
          <p className={styles.lead}>{t("wc.lead")}</p>
          <div className={styles.flagBar} aria-hidden="true">
            <span className={cn(styles.flagChip, styles.flagUsa)}>
              <span className={styles.flagDot} />
              <span className={styles.flagDot} />
              <span className={styles.flagDot} />
              {t("wc.flags.usa")}
            </span>
            <span className={cn(styles.flagChip, styles.flagMex)}>
              <span className={styles.flagDot} />
              <span className={styles.flagDot} />
              <span className={styles.flagDot} />
              {t("wc.flags.mexico")}
            </span>
            <span className={cn(styles.flagChip, styles.flagCan)}>
              <span className={styles.flagDot} />
              <span className={styles.flagDot} />
              <span className={styles.flagDot} />
              {t("wc.flags.canada")}
            </span>
          </div>
          <ul className={styles.features}>
            {FEATURES.map((f) => (
              <li key={f}>{t(`wc.features.${f}`)}</li>
            ))}
          </ul>
          <Button
            href="/fifa-world-cup-2026-private-transportation"
            withArrow
            className={styles.planBtn}
          >
            {t("wc.cta")}
          </Button>
        </Reveal>

        <Reveal className={styles.bento}>
          <div className={styles.photo}>
            <Image
              src="/images/services/world-cup/hero.webp"
              alt={t("wc.photoAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className={styles.photoLabel}>
              <Eyebrow className={styles.photoEyebrow}>
                {t("wc.photoEyebrow")}
              </Eyebrow>
              <p className={styles.photoLabelMain}>{t("wc.nations")}</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <TrophyIcon className={styles.infoIcon} />
            <p className={styles.infoLabel}>{t("wc.window.label")}</p>
            <div>
              <p className={styles.infoValue}>
                {t.rich("wc.window.value", { em: (c) => <em>{c}</em> })}
              </p>
              <p className={styles.infoSub}>{t("wc.window.sub")}</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <StadiumIcon className={styles.infoIcon} />
            <p className={styles.infoLabel}>{t("wc.host.label")}</p>
            <div>
              <p className={styles.infoValue}>
                {t("wc.host.valueLine1")}
                <br />
                <em>{t("wc.host.valueLine2")}</em>
              </p>
              <p className={styles.infoSub}>{t("wc.nations")}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
