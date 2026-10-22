"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { ContactApiError, sendContactMessage } from "@/lib/contact/api";
import { captureAttribution, currentAttribution } from "@/lib/contact/attribution";
import { SUCCESS_CLASS, successId, trackLead } from "@/lib/analytics/conversion";
import {
  CONTACT_LIMITS,
  INITIAL_CONTACT_VALUES,
  validateContact,
  type ContactFieldErrors,
  type ContactSegment,
  type ContactTextField,
  type ContactValues,
} from "@/lib/contact/schema";
import styles from "./LandingForm.module.css";

type Status = "idle" | "sending" | "sent";
type SendError = "generic" | "rateLimited";

/** Orden visual de los campos con validación: el foco va al primero con error. */
const FIELD_ORDER: (keyof ContactValues)[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "message",
  "privacyConsent",
];

/**
 * Formulario al principio de cada landing de For Business (checklist de cierre,
 * oct-2026). Manda por el mismo /api/contact que /contact, con el `segment`
 * de la landing: el endpoint lo rutea al departamento y lo marca en el asunto,
 * y va con la atribución de campaña de la sesión.
 *
 * Los textos propios de cada landing (título, lead, placeholder) llegan
 * traducidos desde el server; los del formulario salen de `pages.contact.form`,
 * los mismos que /contact.
 */
export default function LandingForm({
  id = "contact-form",
  segment,
  eyebrow,
  title,
  lead,
  messagePlaceholder,
  companyLabel,
  directLabel,
  directEmail,
}: {
  id?: string;
  segment: ContactSegment;
  eyebrow: string;
  title: string;
  lead: string;
  messagePlaceholder: string;
  companyLabel: string;
  /** "Or write to us directly": se muestra con el mail del departamento. */
  directLabel: string;
  directEmail: string;
}) {
  const t = useTranslations("pages");
  const locale = useLocale();
  const [values, setValues] = useState<ContactValues>(INITIAL_CONTACT_VALUES);
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sendError, setSendError] = useState<SendError | null>(null);
  const [referral, setReferral] = useState("");
  const successRef = useRef<HTMLHeadingElement>(null);

  // captureAttribution no escribe nada sin consentimiento `marketing`.
  useEffect(() => captureAttribution(), []);

  // El form se reemplaza por el estado de éxito: el foco va a su título para
  // que no caiga en <body> y el lector lo anuncie.
  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  const fid = (name: string) => `${segment}-${name}`;

  const focusFirstError = (errs: ContactFieldErrors) => {
    const first = FIELD_ORDER.find((key) => errs[key]);
    if (first) document.getElementById(fid(first))?.focus();
  };

  const errorText = (key: keyof ContactValues) => {
    const code = errors[key];
    return code ? t(`contact.form.errors.${code}`) : undefined;
  };

  const update =
    (key: ContactTextField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
      if (sendError) setSendError(null);
    };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validateContact(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      focusFirstError(nextErrors);
      return;
    }
    setSendError(null);
    setStatus("sending");
    try {
      await sendContactMessage({
        ...values,
        company,
        segment,
        locale,
        referral,
        attribution: currentAttribution(),
      });
      setStatus("sent");
      trackLead(segment, locale);
      setValues(INITIAL_CONTACT_VALUES);
      setCompany("");
    } catch (error) {
      setStatus("idle");
      if (error instanceof ContactApiError) {
        if (error.reason === "rate_limited") return setSendError("rateLimited");
        if (error.reason === "validation" && error.fields) {
          setErrors(error.fields);
          focusFirstError(error.fields);
          return;
        }
      }
      setSendError("generic");
    }
  }

  return (
    <section className={styles.section} id={id}>
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.intro}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.lead}>{lead}</p>
          <p className={styles.direct}>
            {directLabel}{" "}
            <a href={`mailto:${directEmail}`}>{directEmail}</a>
          </p>
        </Reveal>

        <Reveal className={styles.card} delay={0.05}>
          {status === "sent" ? (
            <div
              id={successId(segment)}
              className={`${styles.success} ${SUCCESS_CLASS}`}
              data-form={segment}
              role="status"
            >
              <h3 ref={successRef} tabIndex={-1} className={styles.successTitle}>
                {t("contact.form.success.title")}
              </h3>
              <p>{t("contact.form.success.body")}</p>
              <button type="button" className={styles.again} onClick={() => setStatus("idle")}>
                {t("contact.form.success.again")}
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.row}>
                <Field label={t("contact.form.firstName")} htmlFor={fid("firstName")} required error={errorText("firstName")}>
                  <Input
                    id={fid("firstName")}
                    name="firstName"
                    autoComplete="given-name"
                    maxLength={CONTACT_LIMITS.firstName}
                    aria-required="true"
                    value={values.firstName}
                    onChange={update("firstName")}
                    invalid={Boolean(errors.firstName)}
                    placeholder={t("contact.form.placeholders.firstName")}
                  />
                </Field>
                <Field label={t("contact.form.lastName")} htmlFor={fid("lastName")} required error={errorText("lastName")}>
                  <Input
                    id={fid("lastName")}
                    name="lastName"
                    autoComplete="family-name"
                    maxLength={CONTACT_LIMITS.lastName}
                    aria-required="true"
                    value={values.lastName}
                    onChange={update("lastName")}
                    invalid={Boolean(errors.lastName)}
                    placeholder={t("contact.form.placeholders.lastName")}
                  />
                </Field>
              </div>
              <div className={styles.row}>
                <Field label={t("contact.form.email")} htmlFor={fid("email")} required error={errorText("email")}>
                  <Input
                    id={fid("email")}
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={CONTACT_LIMITS.email}
                    aria-required="true"
                    value={values.email}
                    onChange={update("email")}
                    invalid={Boolean(errors.email)}
                    placeholder={t("contact.form.placeholders.email")}
                  />
                </Field>
                <Field label={t("contact.form.phone")} htmlFor={fid("phone")} error={errorText("phone")}>
                  <Input
                    id={fid("phone")}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={CONTACT_LIMITS.phone}
                    value={values.phone}
                    onChange={update("phone")}
                    invalid={Boolean(errors.phone)}
                    placeholder={t("contact.form.placeholders.phone")}
                  />
                </Field>
              </div>
              <Field label={companyLabel} htmlFor={fid("company")}>
                <Input
                  id={fid("company")}
                  name="company"
                  autoComplete="organization"
                  maxLength={120}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </Field>
              <Field label={t("contact.form.message")} htmlFor={fid("message")} required error={errorText("message")}>
                <Textarea
                  id={fid("message")}
                  name="message"
                  maxLength={CONTACT_LIMITS.message}
                  aria-required="true"
                  value={values.message}
                  onChange={update("message")}
                  invalid={Boolean(errors.message)}
                  placeholder={messagePlaceholder}
                />
              </Field>

              <div className={styles.consent}>
                <div className={styles.consentRow}>
                  <input
                    id={fid("privacyConsent")}
                    name="privacyConsent"
                    type="checkbox"
                    className={styles.consentInput}
                    checked={values.privacyConsent}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setValues((v) => ({ ...v, privacyConsent: checked }));
                      if (errors.privacyConsent)
                        setErrors((er) => ({ ...er, privacyConsent: undefined }));
                      if (sendError) setSendError(null);
                    }}
                    aria-required="true"
                    aria-invalid={errors.privacyConsent ? true : undefined}
                    aria-describedby={
                      errors.privacyConsent ? fid("privacyConsent-error") : undefined
                    }
                  />
                  <label htmlFor={fid("privacyConsent")} className={styles.consentLabel}>
                    {t.rich("contact.form.consent.label", {
                      link: (chunks) => (
                        // Pestaña nueva: el form no pierde lo tipeado.
                        <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                          {chunks}
                          <span className={styles.srOnly}> {t("contact.form.consent.newTab")}</span>
                        </Link>
                      ),
                    })}
                  </label>
                </div>
                {errors.privacyConsent ? (
                  <p id={fid("privacyConsent-error")} className={styles.consentError} role="alert">
                    {t(`contact.form.errors.${errors.privacyConsent}`)}
                  </p>
                ) : null}
              </div>

              <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor={fid("referral")}>Referral code</label>
                <input
                  id={fid("referral")}
                  name="referral"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={referral}
                  onChange={(e) => setReferral(e.target.value)}
                />
              </div>

              {sendError ? (
                <p className={styles.formError} role="alert">
                  {t(`contact.form.error.${sendError}`)}
                </p>
              ) : null}

              <div className={styles.actions}>
                <p className={styles.fine}>{t("contact.form.fine")}</p>
                <Button type="submit" disabled={status === "sending"}>
                  {status === "sending" ? t("contact.form.sending") : t("contact.form.submit")}
                </Button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
