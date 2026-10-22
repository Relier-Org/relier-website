import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/effects/Reveal";
import AmbientVideo from "@/components/ui/AmbientVideo";
import { SOCIAL_PROFILES } from "@/lib/social/profiles";
import { REELS } from "@/lib/social/reels";
import styles from "./Social.module.css";

/** Ícono de Reels de Instagram (claqueta con play), decorativo. */
function ReelsGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <path d="M2.5 8h19M9 2.5 12 8M15 2.5 18 8" />
      <path d="M10 11.2v6l5-3-5-3Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Sección social del home (Nico, 22-oct-2026, referencia: "We're loud on
 * socials" de Rreal Tacos): cabecera centrada con los perfiles y abajo tres
 * reels propios de @relier en vertical, el del medio más grande, con la pinta
 * de un reel (ícono, perfil y caption). Los videos
 * corren mudos y sólo en pantalla (`playInView`), con pausa por card (WCAG
 * 2.2.2). La card no es un link entera: adentro está el botón de pausa, y un
 * control no puede ir dentro de otro.
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
          <ul className={styles.reels}>
            {REELS.map((r) => (
              <li key={r.id} className={styles.reel}>
                <AmbientVideo
                  src={r.video}
                  poster={r.poster}
                  preload="none"
                  playInView
                  wrapClassName={styles.media}
                  className={
                    r.focus === "bottom"
                      ? `${styles.video} ${styles.focusBottom}`
                      : styles.video
                  }
                  toggle={{
                    pauseLabel: t("pause", { reel: t(`reels.${r.id}.caption`) }),
                    playLabel: t("play", { reel: t(`reels.${r.id}.caption`) }),
                    className: styles.toggle,
                  }}
                />
                <ReelsGlyph className={styles.glyph} />
                {/* Pie de reel: perfil (link al reel en Instagram) y caption. */}
                <div className={styles.caption}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.author}
                  >
                    <Image
                      src="/images/socials/avatar.webp"
                      alt=""
                      width={30}
                      height={30}
                      className={styles.avatar}
                    />
                    <span className={styles.handle}>relier</span>
                    <span className={styles.srOnly}>
                      {" "}
                      {t("watch")}: {t(`reels.${r.id}.caption`)} {t("newTab")}
                    </span>
                  </a>
                  <p className={styles.captionText} aria-hidden="true">
                    {t(`reels.${r.id}.caption`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

      </div>
    </section>
  );
}
