import Image from "next/image";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import Reveal from "@/components/effects/Reveal";
import { Markdown } from "@/lib/blog/markdown";
import PostShare from "@/components/sections/PostShare";
import type { Post } from "@/lib/blog/posts";
import styles from "./PostBody.module.css";

interface PostBodyProps {
  post: Post;
  siteUrl?: string;
}

export default function PostBody({ post, siteUrl }: PostBodyProps) {
  const t = useTranslations("blog");
  const format = useFormatter();
  const shareUrl = siteUrl ?? post.sourceUrl;
  // Los posts existen solo en inglés y se sirven también bajo /es y /pt
  // (3.1.2): el contenido del artículo se marca en inglés; la UI que lo rodea
  // (tag, fecha, compartir, volver) queda en el idioma de la página.
  const contentLang = useLocale() === "en" ? undefined : "en";

  return (
    <section className={styles.section}>
      <div className={cn("container", styles.container)}>
        <Reveal className={styles.head}>
          <div className={styles.meta}>
            <span className={styles.tag}>{t("tag")}</span>
            <time className={styles.date} dateTime={post.date}>
              {format.dateTime(new Date(post.date), {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
          </div>
          <h1 className={styles.title} lang={contentLang}>
            {post.title}
          </h1>
          {post.excerpt && (
            <p className={styles.lead} lang={contentLang}>
              {post.excerpt}
            </p>
          )}
        </Reveal>

        {post.cover && (
          <Reveal className={styles.coverWrap} delay={0.05}>
            <Image
              src={post.cover}
              alt={post.coverAlt ?? post.title}
              lang={contentLang}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className={styles.coverImg}
            />
          </Reveal>
        )}

        <Reveal className={styles.prose} as="article" delay={0.1}>
          <div lang={contentLang}>
            <Markdown source={post.body} />
          </div>
        </Reveal>

        <PostShare title={post.title} url={shareUrl} />

        <div className={styles.backRow}>
          <Link href="/blog/" className={styles.back}>
            <span aria-hidden="true">←</span>
            {t("post.back")}
          </Link>
        </div>
      </div>
    </section>
  );
}
