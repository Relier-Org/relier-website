"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
} from "@/components/icons/SocialIcons";
import { MailIcon, PhoneIcon } from "@/components/icons/ContactIcons";
import { ContactApiError, sendContactMessage } from "@/lib/contact/api";
import {
  CONTACT_LIMITS,
  INITIAL_CONTACT_VALUES,
  validateContact,
  type ContactFieldErrors,
  type ContactValues,
} from "@/lib/contact/schema";
import styles from "./ContactSplit.module.css";

const SOCIALS = [
  { href: "#", label: "Instagram", Icon: InstagramIcon },
  { href: "#", label: "Facebook", Icon: FacebookIcon },
  { href: "#", label: "LinkedIn", Icon: LinkedInIcon },
  { href: "#", label: "WhatsApp", Icon: WhatsAppIcon },
];

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
      await sendContactMessage({ ...values, locale, referral });
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
      <div className="container">
        <div className={styles.grid}>
          <Reveal className={styles.formCol}>
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
                    withArrow
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

          <Reveal className={styles.infoCol}>
            <aside className={styles.infoCard}>
              <p className="section-label">{t("contact.info.label")}</p>
              <h3 className={styles.infoTitle}>
                {t("contact.info.titleLead")}{" "}
                <span className="muted">{t("contact.info.titleMuted")}</span>
              </h3>

              <ul className={styles.infoList}>
                <li>
                  <span className={styles.infoIcon} aria-hidden="true">
                    <PhoneIcon />
                  </span>
                  <div className={styles.infoBody}>
                    <p className={styles.infoLabel}>
                      {t("contact.info.phoneLabel")}
                    </p>
                    <a href="tel:+18447354371" className={styles.infoValue}>
                      {tc("phone")}
                    </a>
                  </div>
                </li>
                <li>
                  <span className={styles.infoIcon} aria-hidden="true">
                    <MailIcon />
                  </span>
                  <div className={styles.infoBody}>
                    <p className={styles.infoLabel}>
                      {t("contact.info.emailLabel")}
                    </p>
                    <a
                      href="mailto:info@relier.com"
                      className={styles.infoValue}
                    >
                      info@relier.com
                    </a>
                  </div>
                </li>
              </ul>

              <div className={styles.socialBar}>
                <p className={styles.infoLabel}>
                  {t("contact.info.followLabel")}
                </p>
                <div className={styles.socials}>
                  {SOCIALS.map(({ href, label, Icon }) => (
                    <a key={label} href={href} aria-label={label}>
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
