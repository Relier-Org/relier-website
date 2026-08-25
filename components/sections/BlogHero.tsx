import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import styles from "./BlogHero.module.css";

// `as` existe por el audit de SEO (ago-2026): este hero se reusa en /blog/ y en
// cada post, así que los 39 artículos × 3 locales salían con dos H1 — el título
// genérico del hero y el título real del artículo (PostBody). En los posts el
// hero pasa a <p>: mismo estilo, sin competir por el H1.
interface BlogHeroProps {
  as?: "h1" | "p";
}

export default function BlogHero({ as: Title = "h1" }: BlogHeroProps) {
  const t = useTranslations("blog");
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <Image
          src="/images/blog/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.img}
        />
      </div>
      <div className={cn("container", styles.inner)}>
        <p className={cn("eyebrow", styles.eyebrow)}>{t("hero.eyebrow")}</p>
        <Title className={styles.h1}>
          {t("hero.titleLine1")}
          <br />
          <span className={styles.muted}>{t("hero.titleLine2")}</span>
        </Title>
        <p className={styles.lead}>{t("hero.lead")}</p>
      </div>
    </section>
  );
}
