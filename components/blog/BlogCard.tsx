import Image from "next/image";
import Link from "next/link";
import TextCTA from "@/components/ui/TextCTA";
import type { Post } from "@/lib/blog/posts";
import styles from "./BlogCard.module.css";

interface BlogCardProps {
  post: Post;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function BlogCard({ post }: BlogCardProps) {
  const href = `/${post.slug}/`;
  return (
    <article className={styles.card}>
      <Link href={href} className={styles.imageWrap} aria-label={post.title} tabIndex={-1}>
        {post.cover ? (
          <Image
            src={post.cover}
            alt={post.coverAlt ?? post.title}
            fill
            sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true" />
        )}
      </Link>
      <div className={styles.meta}>
        <span className={styles.tag}>News</span>
        <time className={styles.date} dateTime={post.date}>
          {formatDate(post.date)}
        </time>
      </div>
      <h3 className={styles.title}>
        <Link href={href}>{post.title}</Link>
      </h3>
      <p className={styles.excerpt}>{post.excerpt}</p>
      <TextCTA href={href} tone="light" className={styles.cta}>
        Read more
      </TextCTA>
    </article>
  );
}
