import { getTranslations } from "next-intl/server";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/effects/Reveal";
import ReelsCarousel from "@/components/sections/ReelsCarousel";
import { SOCIAL_PROFILES } from "@/lib/social/profiles";
import { INITIAL_REEL, REELS } from "@/lib/social/reels";
import styles from "./Social.module.css";

/**
 * Sección social del home (Nico, 22-oct-2026, referencia: "We're loud on
 * socials" de Rreal Tacos): cabecera centrada con los perfiles y abajo los
 * reels propios de @relier en un carrusel selector (ReelsCarousel, 26-oct-2026).
 */
export default async function Social() {
  const t = await getTranslations("home.social");
  // WhatsApp es un chat, no un perfil: acá van sólo las redes.
  const profiles = SOCIAL_PROFILES.filter((p) => p.label !== "WhatsApp");

  return (
    <section className={styles.social} id="social">
      <div className="container">
        <Reveal className={styles.head}>
          <Eyebrow className={styles.eyebrow}>{t("eyebrow")}</Eyebrow>
          <h2 className={styles.title}>
            {t.rich("title", { em: (c) => <em>{c}</em> })}
          </h2>
          <p className={styles.lead}>{t("lead")}</p>
          <ul className={styles.profiles}>
            {profiles.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.profile}
                  aria-label={t("profileLabel", { network: label })}
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className={styles.reelsWrap} delay={0.08}>
          <ReelsCarousel
            initial={INITIAL_REEL}
            reels={REELS.map((r) => ({ ...r, caption: t(`reels.${r.id}.caption`) }))}
            labels={{
              prev: t("prev"),
              next: t("next"),
              select: t.raw("select") as string,
              carousel: t("carousel"),
              watch: t("watch"),
              newTab: t("newTab"),
              pause: t.raw("pause") as string,
              play: t.raw("play") as string,
            }}
          />
        </Reveal>

      </div>
    </section>
  );
}
