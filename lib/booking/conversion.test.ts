import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BOOKING_CONVERSION_EVENT,
  createBookingConversionTracker,
  isBookingMessage,
  readBookingPurchase,
  readBookingStep,
  createQuoteRequestDetector,
} from "./conversion";

const purchase = { transaction_id: "TEST-BOOKING-1", currency: "USD", value: 240.84 };
const envelope = (parameters: unknown, event_name = "purchase") => ({
  message: JSON.stringify({ gtag_event: { event_name, parameters } }),
});

test("accepts a native purchase and removes passenger/payment/user data", () => {
  assert.deepEqual(readBookingPurchase(envelope({
    ...purchase,
    email: "test@example.invalid",
    user_data: { sha256_email_address: "test-hash" },
    payment_method: "test-payment",
  })), purchase);
  assert.deepEqual(readBookingPurchase(envelope({ ...purchase, transaction_id: 123 })), {
    ...purchase, transaction_id: "123",
  });
});

test("ignores non-purchase events, resize, invalid JSON and invalid envelopes", () => {
  for (const data of [
    null, [], "purchase", {}, { message: "{" }, { message: "null" },
    { message: JSON.stringify({ height: "600px" }) },
    envelope(purchase, "view_item"), envelope(purchase, "begin_checkout"),
    envelope(purchase, "add_payment_info"),
    { message: JSON.stringify({ gtag_event: null }) },
    envelope(null),
  ]) assert.equal(readBookingPurchase(data), null);
});

test("requires an id, valid currency and an actual finite nonnegative amount", () => {
  for (const fields of [
    { transaction_id: "" }, { transaction_id: "   " }, { transaction_id: null },
    { transaction_id: {} }, { transaction_id: "x".repeat(201) },
    { currency: "usd" }, { currency: "US" }, { currency: null },
    { value: "240.84" }, { value: -1 }, { value: null },
  ]) assert.equal(readBookingPurchase(envelope({ ...purchase, ...fields })), null);
  assert.deepEqual(readBookingPurchase(envelope({ ...purchase, value: 0 })), {
    ...purchase, value: 0,
  });
});

test("rejects spoofed origins and other windows on the same provider domain", () => {
  const source = {} as Window;
  const other = {} as Window;
  const frame = { contentWindow: source };
  for (const origin of ["https://relier.addons.la", "https://relier.mylimobiz.com"]) {
    assert.equal(isBookingMessage({ origin, source }, frame), true);
    assert.equal(isBookingMessage({ origin, source: other }, frame), false);
    assert.equal(isBookingMessage({ origin, source }, null), false);
  }
  for (const origin of ["https://evil.example", "https://relier.addons.la.evil.example", "null"]) {
    assert.equal(isBookingMessage({ origin, source }, frame), false);
  }
  assert.equal(isBookingMessage({ origin: "https://relier.addons.la", source: null }, {
    contentWindow: null,
  }), false);
});

test("emits one GTM hook per transaction without emitting another native purchase", () => {
  const track = createBookingConversionTracker();
  const events: Record<string, unknown>[] = [];
  const emit = (event: Record<string, unknown>) => { events.push(event); };
  track(purchase, emit);
  track(purchase, emit);
  track({ ...purchase, transaction_id: "TEST-BOOKING-2" }, emit);
  assert.equal(events.length, 2);
  assert.deepEqual(events[0], {
    event: BOOKING_CONVERSION_EVENT,
    booking_provider: "limo_anywhere",
    ...purchase,
  });
  assert.ok(events.every((event) => event.event !== "purchase"));
});

test("forwards only the name of non-purchase steps", () => {
  assert.equal(readBookingStep(envelope({ email: "test@example.invalid" }, "generate_lead")), "generate_lead");
  assert.equal(readBookingStep(envelope(purchase, "begin_checkout")), "begin_checkout");
  for (const data of [
    envelope(purchase), envelope({}, "page_view"), envelope({}, "set_user_data"),
    envelope({}, "Bad Name"), envelope({}, "x".repeat(41)),
    { message: JSON.stringify({ height: "600px" }) }, { message: "{" }, null,
  ]) assert.equal(readBookingStep(data), null);
});

test("detects the quote-sent screen, not lead creation or the booking path", () => {
  const load = { la_load_request: 1 };
  const lead = envelope({ currency: "USD", value: 0 }, "generate_lead");
  const user = envelope({ user_data: {} }, "set_user_data");

  // Pantalla "has been sent to": carga + generate_lead + set_user_data.
  const sent = createQuoteRequestDetector();
  assert.equal(sent(load, 1000), false);
  assert.equal(sent(lead, 1510), true);
  assert.equal(sent(user, 1511), false);

  // Paso 1: generate_lead sin carga reciente (el form tardó en llenarse).
  const first = createQuoteRequestDetector();
  assert.equal(first(load, 0), false);
  assert.equal(first(lead, 40000), false);

  // Reserva: book.php carga y sigue view_item; un generate_lead posterior no cuenta.
  const book = createQuoteRequestDetector();
  assert.equal(book(load, 0), false);
  assert.equal(book(envelope({}, "view_item"), 800), false);
  assert.equal(book(lead, 1200), false);

  // Volver a la lista con datos: generate_lead + set_user_data sin carga previa.
  const back = createQuoteRequestDetector();
  assert.equal(back(lead, 0), false);
  assert.equal(back(user, 1), false);
});
