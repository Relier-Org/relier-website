import { getImageProps } from "next/image";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils/cn";
import AmbientVideo from "@/components/ui/AmbientVideo";
import styles from "./Hero.module.css";

// Poster como imagen prioritaria debajo del video (perf oct-2026): es el LCP y
// tiene que pintarse en el primer frame, en AVIF/WebP y a la medida. En mobile
// va el vertical, el mismo encuadre que el video de mobile.
function posterProps() {
  // Calidad 50: el poster se ve atenuado bajo el degradé y sólo hasta que
  // arranca el video; en AVIF baja de 42 a 20 kB sin diferencia visible
  // (diferencia media 2,9/255 sin atenuar).
  const common = { alt: "", sizes: "100vw", quality: 50 };
  const mobile = getImageProps({
    ...common,
    src: "/videos/hero/vertical-poster.jpg",
    width: 720,
    height: 1280,
  }).props;
  const desktop = getImageProps({
    ...common,
    src: "/videos/hero/horizontal-poster.jpg",
    width: 1280,
    height: 720,
    priority: true,
  }).props;
  return { mobileSrcSet: mobile.srcSet, desktop };
}

export default async function Hero() {
  const t = await getTranslations("home");
  const { mobileSrcSet, desktop } = posterProps();

  return (
    <section className={styles.hero}>
      <AmbientVideo
        wrapClassName={styles.bg}
        className={styles.video}
        preload="none"
        deferUntilLoad
        mirrorPoster
        before={
          <picture className={styles.poster}>
            <source media="(max-width: 720px)" srcSet={mobileSrcSet} sizes="100vw" />
            {/* eslint-disable-next-line @next/next/no-img-element -- props de getImageProps (art direction) */}
            <img {...desktop} alt="" fetchPriority="high" className={styles.posterImg} />
          </picture>
        }
        toggle={{
          pauseLabel: t("hero.pauseVideo"),
          playLabel: t("hero.playVideo"),
          className: styles.videoToggle,
        }}
      >
        {/* Mobile portrait: vertical 720x1280 framing keeps the subject in view.
            Versión liviana (1,4 MB contra 3 MB, SSIM 0,98 a tamaño de pantalla). */}
        <source
          src="/videos/hero/vertical-light.mp4"
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
