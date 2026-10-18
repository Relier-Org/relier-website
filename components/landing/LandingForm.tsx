"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { ContactApiError, sendContactMessage } from "@/lib/contact/api";
import { captureAttribution, currentAttribution } from "@/lib/contact/attribution";
import {
  CONTACT_LIMITS,
  INITIAL_CONTACT_VALUES,
  validateContact,
  type ContactFieldErrors,
  type ContactSegment,
  type ContactValues,
} from "@/lib/contact/schema";
import styles from "./LandingForm.module.css";

type Status = "idle" | "sending" | "sent";
type SendError = "generic" | "rateLimited";

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

  useEffect(() => captureAttribution(), []);

  const errorText = (key: keyof ContactValues) => {
    const code = errors[key];
    return code ? t(`contact.form.errors.${code}`) : undefined;
  };

  const update =
    (key: keyof ContactValues) =>
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
      setValues(INITIAL_CONTACT_VALUES);
      setCompany("");
    } catch (error) {
      setStatus("idle");
      if (error instanceof ContactApiError) {
        if (error.reason === "rate_limited") return setSendError("rateLimited");
        if (error.reason === "validation" && error.fields) return setErrors(error.fields);
      }
      setSendError("generic");
    }
  }

  const fid = (name: string) => `${segment}-${name}`;

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
            <div className={styles.success} role="status">
              <h3>{t("contact.form.success.title")}</h3>
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
                  value={values.message}
                  onChange={update("message")}
                  invalid={Boolean(errors.message)}
                  placeholder={messagePlaceholder}
                />
              </Field>

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
