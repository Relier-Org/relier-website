import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import TextCTA from "@/components/ui/TextCTA";
import Reveal from "@/components/effects/Reveal";
import type { Post } from "@/lib/blog/posts";
import styles from "./BlogFeatured.module.css";

interface BlogFeaturedProps {
  post: Post;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function BlogFeatured({ post }: BlogFeaturedProps) {
  const href = `/${post.slug}/`;
  return (
    <section className={styles.section}>
      <div className={cn("container", styles.container)}>
        <Reveal className={styles.eyebrowRow}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.sectionLabel}>Latest article</span>
        </Reveal>
        <Reveal className={styles.card} delay={0.05}>
          <Link href={href} className={styles.imageWrap} aria-label={post.title}>
            {post.cover ? (
              <Image
                src={post.cover}
                alt={post.coverAlt ?? post.title}
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
            <span className={styles.tag}>News</span>
            <h2 className={styles.title}>
              <Link href={href}>{post.title}</Link>
            </h2>
            <time className={styles.date} dateTime={post.date}>
              {formatDate(post.date)}
            </time>
            <p className={styles.excerpt}>{post.excerpt}</p>
            <TextCTA href={href} tone="light" className={styles.cta}>
              Read more
            </TextCTA>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
