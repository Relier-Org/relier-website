"use client";

import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/Button";
import {
  OPEN_PREFERENCES_EVENT,
  onConsentChange,
  readConsent,
  writeConsent,
  type ConsentCategory,
  type ConsentChoice,
} from "@/lib/consent/state";
import { COOKIES, type CookieCategory } from "@/lib/legal/cookies";
import styles from "./CookieBanner.module.css";

// Estado del banner leído de la cookie. En el server (y en la hidratación) es
// "server" y no se renderiza nada: el banner se decide recién en el cliente,
// sin flash para quien ya eligió.
type Status = "server" | "pending" | "decided";
const subscribe = (cb: () => void) => onConsentChange(cb);
const getStatus = (): Status => (readConsent() ? "decided" : "pending");
const getServerStatus = (): Status => "server";

const CATEGORIES: CookieCategory[] = ["necessary", "analytics", "marketing"];

const COOKIE_NAMES = Object.fromEntries(
  CATEGORIES.map((cat) => [
    cat,
    COOKIES.filter((c) => c.category === cat)
      .map((c) => c.name)
      .join(", "),
  ])
) as Record<CookieCategory, string>;

const NONE: ConsentChoice = { analytics: false, marketing: false };
const ALL: ConsentChoice = { analytics: true, marketing: true };

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function CookieBanner() {
  const t = useTranslations("consent");
  const status = useSyncExternalStore(subscribe, getStatus, getServerStatus);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [draft, setDraft] = useState<ConsentChoice>(NONE);
  const id = useId();

  const openPreferences = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const current = readConsent();
    setDraft(current ? { analytics: current.analytics, marketing: current.marketing } : NONE);
    dialog.showModal();
  }, []);

  useEffect(() => {
    window.addEventListener(OPEN_PREFERENCES_EVENT, openPreferences);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, openPreferences);
  }, [openPreferences]);

  // `close` cubre los tres caminos (X, Escape, Guardar): el foco vuelve a quien
  // abrió el panel, si sigue en la página.
  const handleClose = () => {
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    if (target?.isConnected) target.focus();
  };

  const closePreferences = () => dialogRef.current?.close();

  // showModal() ya vuelve inerte la página, pero Tab desde el último control
  // salta a la UI del navegador. Se cierra el ciclo dentro del panel.
  const trapTab = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== "Tab") return;
    const focusables = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled)'
      )
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // Cerrar antes de escribir: si el cambio retira un consentimiento, ConsentTags
  // recarga la página en el mismo tick.
  const decide = (choice: ConsentChoice) => {
    closePreferences();
    writeConsent(choice);
  };

  const toggle = (cat: ConsentCategory) =>
    setDraft((d) => ({ ...d, [cat]: !d[cat] }));

  // Mientras el banner está abierto, el botón de WhatsApp se oculta en mobile y
  // tablet (ver WhatsAppButton). El script inline lo marca antes de pintar; acá
  // se mantiene sincronizado y se libera al decidir.
  useEffect(() => {
    if (status === "server") return;
    const root = document.documentElement;
    if (status === "pending") root.dataset.consentBanner = "open";
    else delete root.dataset.consentBanner;
  }, [status]);

  if (status === "server") return null;

  const bannerTitle = `${id}-title`;
  const bannerBody = `${id}-body`;
  const prefsTitle = `${id}-prefs-title`;
  const prefsIntro = `${id}-prefs-intro`;

  return (
    <>
      {status === "pending" && (
        <section
          role="dialog"
          aria-labelledby={bannerTitle}
          aria-describedby={bannerBody}
          className={styles.banner}
        >
          <div className={styles.copy}>
            <h2 id={bannerTitle} className={styles.title}>
              {t("banner.title")}
            </h2>
            <p id={bannerBody} className={styles.body}>
              {t("banner.body")}
            </p>
            <p className={styles.links}>
              {t.rich("banner.policies", {
                cookies: (chunks) => <Link href="/cookie-policy">{chunks}</Link>,
                privacy: (chunks) => <Link href="/privacy-policy">{chunks}</Link>,
              })}
            </p>
          </div>
          <div className={styles.actions}>
            <Button
              variant="quiet"
              className={`${styles.action} ${styles.customize}`}
              onClick={openPreferences}
              aria-haspopup="dialog"
            >
              {t("banner.customize")}
            </Button>
            <Button
              variant="secondary"
              className={styles.action}
              onClick={() => decide(NONE)}
            >
              <span className={styles.labelLong}>{t("banner.rejectAll")}</span>
              <span className={styles.labelShort}>{t("banner.rejectShort")}</span>
            </Button>
            <Button
              variant="secondary"
              className={styles.action}
              onClick={() => decide(ALL)}
            >
              <span className={styles.labelLong}>{t("banner.acceptAll")}</span>
              <span className={styles.labelShort}>{t("banner.acceptShort")}</span>
            </Button>
          </div>
        </section>
      )}

      {/* Modal nativo: showModal() vuelve inerte el resto de la página (foco
          atrapado), Escape dispara `close` y aria-modal va implícito. */}
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={prefsTitle}
        aria-describedby={prefsIntro}
        aria-modal="true"
        onClose={handleClose}
        onKeyDown={trapTab}
      >
        <div className={styles.dialogInner}>
          <div className={styles.dialogHead}>
            <h2 id={prefsTitle} className={styles.dialogTitle}>
              {t("preferences.title")}
            </h2>
            <button
              type="button"
              className={styles.close}
              onClick={closePreferences}
              aria-label={t("preferences.close")}
            >
              <CloseIcon />
            </button>
          </div>
          <p id={prefsIntro} className={styles.intro}>
            {t("preferences.intro")}
          </p>

          <ul className={styles.categories}>
            {CATEGORIES.map((cat) => {
              const inputId = `${id}-${cat}`;
              const descId = `${inputId}-desc`;
              const fixed = cat === "necessary";
              return (
                <li key={cat} className={styles.category}>
                  <label htmlFor={inputId} className={styles.row}>
                    <span className={styles.catTitle}>
                      {t(`preferences.categories.${cat}.title`)}
                    </span>
                    {fixed && (
                      <span className={styles.always}>{t("preferences.alwaysActive")}</span>
                    )}
                    <input
                      id={inputId}
                      type="checkbox"
                      role="switch"
                      className={styles.switch}
                      aria-describedby={descId}
                      checked={fixed ? true : draft[cat]}
                      disabled={fixed}
                      onChange={fixed ? undefined : () => toggle(cat)}
                    />
                  </label>
                  <p id={descId} className={styles.catDesc}>
                    {t(`preferences.categories.${cat}.description`)}
                  </p>
                  <p className={styles.cookieNames}>
                    <span>{t("preferences.cookiesLabel")}</span> {COOKIE_NAMES[cat]}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className={styles.dialogFoot}>
            <Link href="/cookie-policy" className={styles.policyLink} onClick={closePreferences}>
              {t("preferences.policyLink")}
            </Link>
            <Button variant="primary" className={styles.save} onClick={() => decide(draft)}>
              {t("preferences.save")}
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
