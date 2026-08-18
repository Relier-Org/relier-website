// Shared between the client form (ContactSplit) and the API route so both sides
// validate with exactly the same rules. Errors travel as codes, never as prose,
// so the UI can render them in the active locale.

export type ContactValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

export type ContactPayload = ContactValues & {
  /** Active locale, so the concierge team knows which language to reply in. */
  locale?: string;
  /**
   * Honeypot. Real users never see it; bots fill everything they find.
   * Named `referral` on purpose: no browser maps it to an autofill category,
   * so Chrome can't silently poison a legitimate submission the way it would
   * with `company` / `organization`.
   */
  referral?: string;
};

export type ContactErrorCode = "required" | "email" | "tooLong";
export type ContactFieldErrors = Partial<
  Record<keyof ContactValues, ContactErrorCode>
>;

export const CONTACT_LIMITS: Record<keyof ContactValues, number> = {
  firstName: 80,
  lastName: 80,
  email: 160,
  phone: 40,
  message: 4000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const INITIAL_CONTACT_VALUES: ContactValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

export function validateContact(values: ContactValues): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  const firstName = values.firstName.trim();
  if (!firstName) errors.firstName = "required";
  else if (firstName.length > CONTACT_LIMITS.firstName)
    errors.firstName = "tooLong";

  const lastName = values.lastName.trim();
  if (!lastName) errors.lastName = "required";
  else if (lastName.length > CONTACT_LIMITS.lastName)
    errors.lastName = "tooLong";

  const email = values.email.trim();
  if (!email) errors.email = "required";
  else if (email.length > CONTACT_LIMITS.email) errors.email = "tooLong";
  else if (!EMAIL_RE.test(email)) errors.email = "email";

  const phone = values.phone.trim();
  if (phone.length > CONTACT_LIMITS.phone) errors.phone = "tooLong";

  const message = values.message.trim();
  if (!message) errors.message = "required";
  else if (message.length > CONTACT_LIMITS.message) errors.message = "tooLong";

  return errors;
}

/** Trims every field and drops anything the client shouldn't be trusted with. */
export function normalizeContact(input: unknown): ContactPayload {
  const raw = (input ?? {}) as Record<string, unknown>;
  const str = (key: string) =>
    typeof raw[key] === "string" ? (raw[key] as string).trim() : "";

  return {
    firstName: str("firstName"),
    lastName: str("lastName"),
    email: str("email"),
    phone: str("phone"),
    message: str("message"),
    locale: str("locale") || undefined,
    referral: str("referral") || undefined,
  };
}
