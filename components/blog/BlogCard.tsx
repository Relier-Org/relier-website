import Image from "next/image";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import TextCTA from "@/components/ui/TextCTA";
import type { Post } from "@/lib/blog/posts";
import { cardCoverAlt } from "@/components/blog/coverAlt";
import styles from "./BlogCard.module.css";

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  const t = useTranslations("blog");
  const format = useFormatter();
  const href = `/${post.slug}/`;
  // Posts solo en inglés, también listados bajo /es y /pt (3.1.2).
  const contentLang = useLocale() === "en" ? undefined : "en";
  return (
    <article className={styles.card}>
      <Link
        href={href}
        className={styles.imageWrap}
        aria-label={post.title}
        lang={contentLang}
        tabIndex={-1}
      >
        {post.cover ? (
          <Image
            src={post.cover}
            alt={cardCoverAlt(post)}
            fill
            sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true" />
        )}
      </Link>
      <div className={styles.meta}>
        <span className={styles.tag}>{t("tag")}</span>
        <time className={styles.date} dateTime={post.date}>
          {format.dateTime(new Date(post.date), {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
          })}
        </time>
      </div>
      <h3 className={styles.title} lang={contentLang}>
        <Link href={href}>{post.title}</Link>
      </h3>
      <p className={styles.excerpt} lang={contentLang}>
        {post.excerpt}
      </p>
      <TextCTA href={href} tone="light" className={styles.cta}>
        {t("readMore")}
      </TextCTA>
    </article>
  );
}
