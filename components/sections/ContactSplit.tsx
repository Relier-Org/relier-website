"use client";

import { useState, type FormEvent } from "react";
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

type FormErrors = Partial<Record<keyof FormState, string>>;

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
  if (!values.firstName.trim()) errors.firstName = "Required";
  if (!values.lastName.trim()) errors.lastName = "Required";
  if (!values.email.trim()) {
    errors.email = "Required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email";
  }
  if (!values.message.trim()) errors.message = "Required";
  return errors;
}

export default function ContactSplit() {
  const [values, setValues] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

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
              <p className="section-label">Send a message</p>
              <h2 className={styles.h2}>
                Tell us where you&apos;re going.
              </h2>
            </header>

            {status === "sent" ? (
              <div className={styles.successCard} role="status">
                <h3>Thank you.</h3>
                <p>
                  Your message is on its way to our concierge team. We&apos;ll
                  be in touch within the hour during business times.
                </p>
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={() => setStatus("idle")}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.row}>
                  <Field
                    label="First name"
                    htmlFor="firstName"
                    required
                    error={errors.firstName}
                  >
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={values.firstName}
                      onChange={update("firstName")}
                      invalid={Boolean(errors.firstName)}
                      placeholder="Jane"
                    />
                  </Field>
                  <Field
                    label="Last name"
                    htmlFor="lastName"
                    required
                    error={errors.lastName}
                  >
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={values.lastName}
                      onChange={update("lastName")}
                      invalid={Boolean(errors.lastName)}
                      placeholder="Doe"
                    />
                  </Field>
                </div>

                <div className={styles.row}>
                  <Field
                    label="Email"
                    htmlFor="email"
                    required
                    error={errors.email}
                  >
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={update("email")}
                      invalid={Boolean(errors.email)}
                      placeholder="jane@email.com"
                    />
                  </Field>
                  <Field label="Phone" htmlFor="phone">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={update("phone")}
                      placeholder="+1 555 000 0000"
                    />
                  </Field>
                </div>

                <Field
                  label="Message"
                  htmlFor="message"
                  required
                  error={errors.message}
                >
                  <Textarea
                    id="message"
                    name="message"
                    value={values.message}
                    onChange={update("message")}
                    invalid={Boolean(errors.message)}
                    placeholder="Tell us about your trip — dates, route, party size, any special requests."
                  />
                </Field>

                <div className={styles.actions}>
                  <p className={styles.fine}>
                    By submitting, you agree to be contacted by our team.
                  </p>
                  <Button
                    type="submit"
                    variant="primary"
                    withArrow
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Sending..." : "Submit"}
                  </Button>
                </div>
              </form>
            )}
          </Reveal>

          <Reveal className={styles.infoCol}>
            <aside className={styles.infoCard}>
              <p className="section-label">Concierge</p>
              <h3 className={styles.infoTitle}>
                Direct lines to <span className="muted">our team.</span>
              </h3>

              <ul className={styles.infoList}>
                <li>
                  <span className={styles.infoIcon} aria-hidden="true">
                    <PhoneIcon />
                  </span>
                  <div className={styles.infoBody}>
                    <p className={styles.infoLabel}>Phone bookings</p>
                    <a href="tel:+18447354371" className={styles.infoValue}>
                      +1 (844) 735-4371
                    </a>
                  </div>
                </li>
                <li>
                  <span className={styles.infoIcon} aria-hidden="true">
                    <MailIcon />
                  </span>
                  <div className={styles.infoBody}>
                    <p className={styles.infoLabel}>Email enquiries</p>
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
                <p className={styles.infoLabel}>Follow</p>
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
