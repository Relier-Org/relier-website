import Image from "next/image";
import Link from "next/link";
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

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function PostBody({ post, siteUrl }: PostBodyProps) {
  const shareUrl = siteUrl ?? post.sourceUrl;

  return (
    <section className={styles.section}>
      <div className={cn("container", styles.container)}>
        <Reveal className={styles.head}>
          <div className={styles.meta}>
            <span className={styles.tag}>News</span>
            <time className={styles.date} dateTime={post.date}>
              {formatDate(post.date)}
            </time>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          {post.excerpt && <p className={styles.lead}>{post.excerpt}</p>}
        </Reveal>

        {post.cover && (
          <Reveal className={styles.coverWrap} delay={0.05}>
            <Image
              src={post.cover}
              alt={post.coverAlt ?? post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className={styles.coverImg}
            />
          </Reveal>
        )}

        <Reveal className={styles.prose} as="article" delay={0.1}>
          <Markdown source={post.body} />
        </Reveal>

        <PostShare title={post.title} url={shareUrl} />

        <div className={styles.backRow}>
          <Link href="/blog/" className={styles.back}>
            <span aria-hidden="true">←</span>
            Back to Journal
          </Link>
        </div>
      </div>
    </section>
  );
}
