"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
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
import styles from "./ContactSplit.module.css";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

// Errors travel as message codes so they re-render in the active locale.
type ErrorCode = "required" | "email";
type FormErrors = Partial<Record<keyof FormState, ErrorCode>>;

const INITIAL: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

const SOCIALS = [
  { href: "#", label: "Instagram", Icon: InstagramIcon },
  { href: "#", label: "Facebook", Icon: FacebookIcon },
  { href: "#", label: "LinkedIn", Icon: LinkedInIcon },
  { href: "#", label: "WhatsApp", Icon: WhatsAppIcon },
];

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.firstName.trim()) errors.firstName = "required";
  if (!values.lastName.trim()) errors.lastName = "required";
  if (!values.email.trim()) {
    errors.email = "required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "email";
  }
  if (!values.message.trim()) errors.message = "required";
  return errors;
}

export default function ContactSplit() {
  const t = useTranslations("pages");
  const tc = useTranslations("common");
  const [values, setValues] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const errorText = (key: keyof FormState) => {
    const code = errors[key];
    return code ? t(`contact.form.errors.${code}`) : undefined;
  };

  const update = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setValues(INITIAL);
    }, 700);
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
                      value={values.email}
                      onChange={update("email")}
                      invalid={Boolean(errors.email)}
                      placeholder={t("contact.form.placeholders.email")}
                    />
                  </Field>
                  <Field label={t("contact.form.phone")} htmlFor="phone">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={update("phone")}
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
                    value={values.message}
                    onChange={update("message")}
                    invalid={Boolean(errors.message)}
                    placeholder={t("contact.form.placeholders.message")}
                  />
                </Field>

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
