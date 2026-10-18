import { useTranslations } from "next-intl";
import Reveal from "@/components/effects/Reveal";
import styles from "./ContactStatement.module.css";

export default function ContactStatement() {
  const t = useTranslations("pages");
  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal>
          <div className={styles.content}>
            <p className={styles.statement}>{t("contact.statement")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
