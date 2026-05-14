import styles from "./VirtuosoBadge.module.css";

interface VirtuosoBadgeProps {
  href?: string;
}

export default function VirtuosoBadge({ href = "#" }: VirtuosoBadgeProps) {
  return (
    <a href={href} className={styles.badge}>
      <span className={styles.mark} aria-hidden="true" />
      <p className={styles.text}>
        <strong>Virtuoso</strong>
        <span className={styles.sep}>&nbsp;·&nbsp;</span>
        Preferred Partner
      </p>
    </a>
  );
}
