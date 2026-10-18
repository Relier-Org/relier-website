"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { MailIcon, PhoneIcon } from "@/components/icons/ContactIcons";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { DEPARTMENTS } from "@/lib/contact/departments";
import { ContactApiError, sendContactMessage } from "@/lib/contact/api";
import { currentAttribution } from "@/lib/contact/attribution";
import {
  CONTACT_LIMITS,
  INITIAL_CONTACT_VALUES,
  validateContact,
  type ContactFieldErrors,
  type ContactValues,
} from "@/lib/contact/schema";
import { SOCIAL_PROFILES } from "@/lib/social/profiles";
import styles from "./ContactSplit.module.css";

type Status = "idle" | "sending" | "sent";
type SendError = "generic" | "rateLimited";

export default function ContactSplit() {
  const t = useTranslations("pages");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [values, setValues] = useState<ContactValues>(INITIAL_CONTACT_VALUES);
  // Errors travel as message codes so they re-render in the active locale.
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sendError, setSendError] = useState<SendError | null>(null);
  // Honeypot: hidden from humans, irresistible to bots.
  const [referral, setReferral] = useState("");

  const errorText = (key: keyof ContactValues) => {
    const code = errors[key];
    return code ? t(`contact.form.errors.${code}`) : undefined;
  };

  const update = (key: keyof ContactValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
        locale,
        referral,
        attribution: currentAttribution(),
      });
      setStatus("sent");
      setValues(INITIAL_CONTACT_VALUES);
    } catch (error) {
      setStatus("idle");
      if (error instanceof ContactApiError) {
        if (error.reason === "rate_limited") {
          setSendError("rateLimited");
          return;
        }
        if (error.reason === "validation" && error.fields) {
          setErrors(error.fields);
          return;
        }
      }
      setSendError("generic");
    }
  }

  return (
    <section className={styles.section}>
      {/* Figma oct-2026: el form va en una card crema sobre una foto full-bleed
          del S-Class; las líneas directas pasan a ser una banda propia abajo. */}
      <div className={styles.formBand}>
        <div className={styles.photo} aria-hidden="true">
          <Image
            src="/images/contact/sedan.webp"
            alt=""
            fill
            sizes="100vw"
            className={styles.photoImg}
          />
        </div>
        <div className="container">
          <Reveal className={styles.formCard}>
            <header className={styles.formHeader}>
              <p className="section-label">{t("contact.form.label")}</p>
              <h2 className={styles.h2}>{t("contact.form.title")}</h2>
            </header>

            {status === "sent" ? (
              <div className={styles.successCard} role="status">
                <h3>{t("contact.form.success.title")}</h3>
                <p>{t("contact.form.success.body")}</p>
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={() => setStatus("idle")}
                >
                  {t("contact.form.success.again")}
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.row}>
                  <Field
                    label={t("contact.form.firstName")}
                    htmlFor="firstName"
                    required
                    error={errorText("firstName")}
                  >
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      maxLength={CONTACT_LIMITS.firstName}
                      value={values.firstName}
                      onChange={update("firstName")}
                      invalid={Boolean(errors.firstName)}
                      placeholder={t("contact.form.placeholders.firstName")}
                    />
                  </Field>
                  <Field
                    label={t("contact.form.lastName")}
                    htmlFor="lastName"
                    required
                    error={errorText("lastName")}
                  >
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
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
                  <Field
                    label={t("contact.form.email")}
                    htmlFor="email"
                    required
                    error={errorText("email")}
                  >
                    <Input
                      id="email"
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
                  <Field
                    label={t("contact.form.phone")}
                    htmlFor="phone"
                    error={errorText("phone")}
                  >
                    <Input
                      id="phone"
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

                <Field
                  label={t("contact.form.message")}
                  htmlFor="message"
                  required
                  error={errorText("message")}
                >
                  <Textarea
                    id="message"
                    name="message"
                    maxLength={CONTACT_LIMITS.message}
                    value={values.message}
                    onChange={update("message")}
                    invalid={Boolean(errors.message)}
                    placeholder={t("contact.form.placeholders.message")}
                  />
                </Field>

                <div className={styles.honeypot} aria-hidden="true">
                  <label htmlFor="contact-referral">Referral code</label>
                  <input
                    id="contact-referral"
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
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={status === "sending"}
                  >
                    {status === "sending"
                      ? t("contact.form.sending")
                      : t("contact.form.submit")}
                  </Button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>

      <div className="container">
        <Reveal className={styles.lines}>
          <header className={styles.linesHead}>
            <p className="eyebrow">{t("contact.info.label")}</p>
            <h2 className={styles.linesTitle}>
              {t("contact.info.titleLead")}{" "}
              <em>{t("contact.info.titleMuted")}</em>
            </h2>
          </header>

          {/* Un bloque por departamento con sus líneas oficiales (doc del
              cliente, oct-2026): cada consulta va directo al equipo que la
              atiende. */}
          <div className={styles.departments}>
            {DEPARTMENTS.map((d) => (
              <div key={d.id} className={styles.department}>
                <p className={styles.deptName}>
                  {t(`contact.info.departments.${d.id}.name`)}
                </p>
                <p className={styles.deptFor}>
                  {t(`contact.info.departments.${d.id}.for`)}
                </p>
                <ul className={styles.deptList}>
                  <li>
                    <MailIcon className={styles.deptIcon} aria-hidden="true" />
                    <a href={`mailto:${d.email}`} className={styles.deptValue}>
                      {d.email}
                    </a>
                  </li>
                  <li>
                    <PhoneIcon className={styles.deptIcon} aria-hidden="true" />
                    <a href={`tel:${d.phone.tel}`} className={styles.deptValue}>
                      {d.phone.display}
                    </a>
                  </li>
                  {d.whatsapp ? (
                    <li>
                      <WhatsAppIcon className={styles.deptIcon} aria-hidden="true" />
                      <a
                        href={`https://wa.me/${d.whatsapp.number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.deptValue}
                        aria-label={`WhatsApp ${d.whatsapp.display}`}
                      >
                        {d.whatsapp.display}
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.socialBar}>
            <p className={styles.followLabel}>
              {t("contact.info.followLabel")}
            </p>
            <div className={styles.socials}>
              {SOCIAL_PROFILES.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
