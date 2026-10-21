import { useTranslations } from "next-intl";
import styles from "./VirtuosoBadge.module.css";

interface VirtuosoBadgeProps {
  href?: string;
}

export default function VirtuosoBadge({
  href = "https://www.virtuoso.com/",
}: VirtuosoBadgeProps) {
  const t = useTranslations("common.virtuoso");
  // Un solo nombre accesible: aria-label (contiene el texto visible, 2.5.3) y
  // sin title, que lo repetía en los lectores que leen ambos.
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.badge}
      aria-label={`${t("label")} ${t("newTab")}`}
    >
      <p className={styles.text}>{t("badge")}</p>
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
