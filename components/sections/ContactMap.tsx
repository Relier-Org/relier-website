"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/effects/Reveal";
import { LocationIcon } from "@/components/icons/ContactIcons";
import Button from "@/components/ui/Button";
import styles from "./ContactMap.module.css";

const EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.0458762121543!2d-73.96827318826371!3d40.717006571273544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2595ddd389e8f%3A0xb9f239ab0e1fa901!2sRelier%20Worldwide%20Chauffeured%20Services!5e0!3m2!1ses-419!2sar!4v1779041976661!5m2!1ses-419!2sar";

// Maps URL API: sin key, y en mobile abre la app nativa. No carga nada de
// Google en esta página.
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=240%20Kent%20Ave%2C%20Brooklyn%2C%20NY%2011249";

// Estable a nivel módulo: un callback ref inline se volvería a llamar en cada
// render y robaría el foco.
const focusOnMount = (el: HTMLIFrameElement | null) => el?.focus();

/**
 * El embed de Google Maps fija cookies de Google apenas carga, así que va
 * click-to-load (oct-2026): placeholder del mismo tamaño y el iframe sólo tras
 * el click. La elección no se guarda: cada visita vuelve a preguntar.
 */
export default function ContactMap() {
  const t = useTranslations("pages");
  const tm = useTranslations("consent.map");
  const [loaded, setLoaded] = useState(false);

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
          {loaded ? (
            <iframe
              ref={focusOnMount}
              src={EMBED_URL}
              title={t("contact.map.iframeTitle")}
              referrerPolicy="no-referrer-when-downgrade"
              className={styles.frame}
            />
          ) : (
            <div className={styles.placeholder} role="group" aria-label={tm("placeholderLabel")}>
              <div className={styles.placeholderBody}>
                <span className={styles.pin} aria-hidden="true">
                  <LocationIcon />
                </span>
                <p className={styles.address}>{tm("address")}</p>
                <p className={styles.notice}>
                  {tm.rich("notice", {
                    link: (chunks) => (
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {chunks}
                        <span className={styles.srOnly}> {tm("newTab")}</span>
                      </a>
                    ),
                  })}
                </p>
                <div className={styles.actions}>
                  <Button variant="secondary" onClick={() => setLoaded(true)}>
                    {tm("load")}
                  </Button>
                  <Button
                    variant="quiet"
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tm("open")}
                    <span className={styles.srOnly}> {tm("newTab")}</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
