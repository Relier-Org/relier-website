import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import Reveal from "@/components/effects/Reveal";
import BlogCard from "@/components/blog/BlogCard";
import type { Post } from "@/lib/blog/posts";
import styles from "./BlogGrid.module.css";

interface BlogGridProps {
  posts: Post[];
  page: number;
  pageCount: number;
  perPage: number;
  showLead?: boolean;
}

const GRID_ANCHOR = "journal";
const buildHref = (page: number) =>
  page <= 1 ? `/blog/#${GRID_ANCHOR}` : `/blog/?page=${page}#${GRID_ANCHOR}`;

export default function BlogGrid({
  posts,
  page,
  pageCount,
  perPage,
  showLead = true,
}: BlogGridProps) {
  const t = useTranslations("blog");
  const start = (page - 1) * perPage;
  const slice = posts.slice(start, start + perPage);

  return (
    <section id={GRID_ANCHOR} className={styles.section}>
      <div className={cn("container", styles.container)}>
        {showLead && (
          <Reveal className={styles.header}>
            <p className={styles.eyebrow}>
              <span className={styles.dot} aria-hidden="true" />
              {t("listing.eyebrow")}
            </p>
            <h2 className={styles.title}>{t("listing.title")}</h2>
          </Reveal>
        )}

        <div className={styles.grid}>
          {slice.map((post, i) => (
            <Reveal key={post.slug} delay={Math.min(i * 0.05, 0.3)}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>

        {pageCount > 1 && (
          <Pagination page={page} pageCount={pageCount} />
        )}
      </div>
    </section>
  );
}

function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  const t = useTranslations("blog");
  const prev = page > 1 ? buildHref(page - 1) : null;
  const next = page < pageCount ? buildHref(page + 1) : null;
  const numbers = pageNumbers(page, pageCount);

  return (
    <nav className={styles.pagination} aria-label={t("pagination.label")}>
      {prev ? (
        <Link href={prev} className={styles.navLink} aria-label={t("pagination.previousPage")}>
          <span aria-hidden="true">←</span>
          <span className={styles.navLabel}>{t("pagination.previous")}</span>
        </Link>
      ) : (
        <span className={cn(styles.navLink, styles.navDisabled)} aria-hidden="true">
          <span>←</span>
          <span className={styles.navLabel}>{t("pagination.previous")}</span>
        </span>
      )}

      <ol className={styles.numbers}>
        {numbers.map((n, i) =>
          n === "..." ? (
            <li key={`gap-${i}`} className={styles.gap} aria-hidden="true">
              …
            </li>
          ) : n === page ? (
            <li key={n}>
              <span className={cn(styles.number, styles.numberActive)} aria-current="page">
                {n}
              </span>
            </li>
          ) : (
            <li key={n}>
              <Link href={buildHref(n)} className={styles.number}>
                {n}
              </Link>
            </li>
          )
        )}
      </ol>

      {next ? (
        <Link href={next} className={styles.navLink} aria-label={t("pagination.nextPage")}>
          <span className={styles.navLabel}>{t("pagination.next")}</span>
          <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span className={cn(styles.navLink, styles.navDisabled)} aria-hidden="true">
          <span className={styles.navLabel}>{t("pagination.next")}</span>
          <span>→</span>
        </span>
      )}
    </nav>
  );
}

// Render a windowed page list: 1 … n-1 n n+1 … last
function pageNumbers(current: number, total: number): Array<number | "..."> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const out: Array<number | "..."> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push("...");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("...");
  out.push(total);
  return out;
}
