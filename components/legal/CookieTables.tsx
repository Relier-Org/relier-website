import { getTranslations } from "next-intl/server";
import { COOKIES, type CookieCategory } from "@/lib/legal/cookies";
import styles from "./CookieTables.module.css";

const CATEGORIES: CookieCategory[] = ["necessary", "analytics", "marketing"];

/** Una tabla por categoría, generada desde el inventario de lib/legal/cookies.ts. */
export default async function CookieTables({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "legal.cookies" });

  return (
    <div className={styles.tables}>
      {CATEGORIES.map((category) => {
        const rows = COOKIES.filter((c) => c.category === category);
        if (rows.length === 0) return null;
        const captionId = `cookies-${category}`;
        return (
          <div
            key={category}
            className={styles.scroller}
            role="region"
            aria-labelledby={captionId}
            tabIndex={0}
          >
            <table className={styles.table}>
              <caption id={captionId} className={styles.caption}>
                {t(`table.category.${category}`)}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{t("table.name")}</th>
                  <th scope="col">{t("table.provider")}</th>
                  <th scope="col">{t("table.purpose")}</th>
                  <th scope="col">{t("table.duration")}</th>
                  <th scope="col">{t("table.type")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.name}>
                    <th scope="row">
                      <code>{c.name}</code>
                    </th>
                    <td>{c.provider}</td>
                    <td>{t(`purpose.${c.purposeKey}`)}</td>
                    <td>{t(`duration.${c.durationKey}`)}</td>
                    <td>{t(`table.kind.${c.kind}`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
