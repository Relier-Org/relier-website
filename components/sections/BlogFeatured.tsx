import Image from "next/image";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import TextCTA from "@/components/ui/TextCTA";
import Reveal from "@/components/effects/Reveal";
import type { Post } from "@/lib/blog/posts";
import { cardCoverAlt } from "@/components/blog/coverAlt";
import styles from "./BlogFeatured.module.css";

interface BlogFeaturedProps {
  post: Post;
}

export default function BlogFeatured({ post }: BlogFeaturedProps) {
  const t = useTranslations("blog");
  const format = useFormatter();
  const href = `/${post.slug}/`;
  // Posts solo en inglés, también listados bajo /es y /pt (3.1.2).
  const contentLang = useLocale() === "en" ? undefined : "en";
  return (
    <section className={styles.section}>
      <div className={cn("container", styles.container)}>
        <Reveal className={styles.eyebrowRow}>
          <span className={styles.sectionLabel}>{t("featured.label")}</span>
        </Reveal>
        <Reveal className={styles.card} delay={0.05}>
          <Link
            href={href}
            className={styles.imageWrap}
            aria-label={post.title}
            lang={contentLang}
          >
            {post.cover ? (
              <Image
                src={post.cover}
                alt={cardCoverAlt(post)}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className={styles.image}
              />
            ) : (
              <div className={styles.imagePlaceholder} aria-hidden="true" />
            )}
          </Link>
          <div className={styles.content}>
            <span className={styles.tag}>{t("tag")}</span>
            <h2 className={styles.title} lang={contentLang}>
              <Link href={href}>{post.title}</Link>
            </h2>
            <time className={styles.date} dateTime={post.date}>
              {format.dateTime(new Date(post.date), {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
            <p className={styles.excerpt} lang={contentLang}>
              {post.excerpt}
            </p>
            <TextCTA href={href} tone="light" className={styles.cta}>
              {t("readMore")}
            </TextCTA>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
