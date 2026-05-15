import styles from "./VirtuosoBadge.module.css";

interface VirtuosoBadgeProps {
  href?: string;
}

export default function VirtuosoBadge({
  href = "https://www.virtuoso.com/",
}: VirtuosoBadgeProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.badge}
      aria-label="Virtuoso Preferred Partner"
      title="Virtuoso Preferred Partner"
    >
      <p className={styles.text}>Preferred Partner</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/partners/virtuoso.svg"
        alt=""
        aria-hidden="true"
        className={styles.logo}
        loading="lazy"
      />
    </a>
  );
}
