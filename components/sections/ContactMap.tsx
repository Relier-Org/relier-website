import { useTranslations } from "next-intl";
import Reveal from "@/components/effects/Reveal";
import { LocationIcon } from "@/components/icons/ContactIcons";
import styles from "./ContactMap.module.css";

const EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.0458762121543!2d-73.96827318826371!3d40.717006571273544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2595ddd389e8f%3A0xb9f239ab0e1fa901!2sRelier%20Worldwide%20Chauffeured%20Services!5e0!3m2!1ses-419!2sar!4v1779041976661!5m2!1ses-419!2sar";

export default function ContactMap() {
  const t = useTranslations("pages");
  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal>
          <header className={styles.header}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowIcon} aria-hidden="true">
                <LocationIcon />
              </span>
              <p className="section-label">{t("contact.map.eyebrow")}</p>
            </div>
            <h2 className={styles.h2}>
              {t("contact.map.titleLine1")}
              <br />
              <span className="muted">{t("contact.map.titleLine2")}</span>
            </h2>
          </header>
        </Reveal>

        <Reveal className={styles.frameWrap}>
          <iframe
            src={EMBED_URL}
            title={t("contact.map.iframeTitle")}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={styles.frame}
          />
        </Reveal>
      </div>
    </section>
  );
}
