/** Public booking fields only. Never forward passenger, billing or user data. */
export type BookingPurchase = {
  transaction_id: string;
  currency: string;
  value: number;
};

export const BOOKING_CONVERSION_EVENT = "relier_reservation_complete";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Decode the provider's documented postMessage envelope, not resize messages. */
export function readBookingPurchase(data: unknown): BookingPurchase | null {
  if (!isRecord(data) || typeof data.message !== "string") return null;

  let message: unknown;
  try {
    message = JSON.parse(data.message);
  } catch {
    return null;
  }
  if (!isRecord(message) || !isRecord(message.gtag_event)) return null;
  const event = message.gtag_event;
  if (event.event_name !== "purchase" || !isRecord(event.parameters)) return null;

  const { transaction_id, currency, value } = event.parameters;
  if (typeof transaction_id !== "string" && typeof transaction_id !== "number") return null;
  if (typeof transaction_id === "number" && !Number.isFinite(transaction_id)) return null;
  const id = String(transaction_id).trim();
  if (!id || id.length > 200) return null;
  if (typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency)) return null;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return null;

  return { transaction_id: id, currency, value };
}

/** Require the message to come from this widget's actual iframe, not just its host. */
export function isBookingMessage(
  event: Pick<MessageEvent, "origin" | "source">,
  frame: Pick<HTMLIFrameElement, "contentWindow"> | null | undefined,
): boolean {
  return Boolean(
    frame?.contentWindow && event.source === frame.contentWindow &&
    (event.origin === "https://relier.addons.la" ||
      event.origin === "https://relier.mylimobiz.com"),
  );
}

/** Keep the idempotency check independent of React mounts and client navigation. */
export function createBookingConversionTracker() {
  const sent = new Set<string>();
  return (purchase: BookingPurchase, emit: (event: Record<string, unknown>) => void) => {
    if (sent.has(purchase.transaction_id)) return;
    emit({
      event: BOOKING_CONVERSION_EVENT,
      booking_provider: "limo_anywhere",
      ...purchase,
    });
    sent.add(purchase.transaction_id);
  };
}

export const BOOKING_STEP_EVENT = "relier_booking_step";

// purchase ya tiene su hook; page_view y set_user_data no son pasos del embudo.
const NOT_A_STEP = new Set(["purchase", "page_view", "set_user_data"]);

/**
 * Nombre de cualquier otro evento nativo del iframe (view_item, begin_checkout,
 * el envío del quote por email...). Sólo el nombre: los parámetros pueden traer
 * datos del pasajero. Flor (performance, 26-oct-2026) lo usa para separar a
 * quien pide el quote por mail de quien termina pagando.
 */
export function readBookingStep(data: unknown): string | null {
  if (!isRecord(data) || typeof data.message !== "string") return null;
  let message: unknown;
  try {
    message = JSON.parse(data.message);
  } catch {
    return null;
  }
  if (!isRecord(message) || !isRecord(message.gtag_event)) return null;
  const name = message.gtag_event.event_name;
  if (typeof name !== "string" || !/^[a-z][a-z0-9_]{0,39}$/.test(name)) return null;
  return NOT_A_STEP.has(name) ? null : name;
}

// The native embed owns GA4's purchase. This separate GTM hook must not call
// gtag('event', 'purchase') or fbq: doing so would duplicate provider/container tags.
export const trackBookingConversion = createBookingConversionTracker();
