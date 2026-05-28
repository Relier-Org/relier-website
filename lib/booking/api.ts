import type { PlaceFeature } from "./mapConfig";

export type BookingPayloadP2P = {
  mode: "point-to-point";
  pickup: PlaceFeature | null;
  dropoff: PlaceFeature | null;
  pickupDate: Date | null;
  pickupTime: string | null;
  returnTrip: boolean;
  returnDate: Date | null;
  returnTime: string | null;
};

export type BookingPayloadHourly = {
  mode: "hourly";
  pickup: PlaceFeature | null;
  durationHours: number | null;
  pickupDate: Date | null;
  pickupTime: string | null;
};

export type BookingPayload = BookingPayloadP2P | BookingPayloadHourly;

export type BookingQuote = {
  vehicleId: string;
  vehicleName: string;
  paxCapacity: number;
  bagCapacity: number;
  priceUSD: number;
  etaMinutes?: number;
};

export type QuoteResponse = {
  tripId: string;
  quotes: BookingQuote[];
};

export type CreateReservationRequest = {
  tripId: string;
  vehicleId: string;
  customer: { fullName: string; email: string; phone: string; notes?: string };
};

export type CreateReservationResponse = {
  confirmationCode: string;
  status: "pending" | "confirmed";
};

export class BookingApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function serializePayload(payload: BookingPayload) {
  return {
    ...payload,
    pickupDate: payload.pickupDate ? payload.pickupDate.toISOString() : null,
    returnDate:
      payload.mode === "point-to-point" && payload.returnDate
        ? payload.returnDate.toISOString()
        : null,
  };
}

export async function requestQuote(payload: BookingPayload): Promise<QuoteResponse> {
  const res = await fetch("/api/booking/quote/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(serializePayload(payload)),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new BookingApiError(body.error ?? "Quote request failed", res.status);
  }
  return res.json() as Promise<QuoteResponse>;
}

export async function createReservation(
  req: CreateReservationRequest
): Promise<CreateReservationResponse> {
  const res = await fetch("/api/booking/create/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new BookingApiError(body.error ?? "Reservation failed", res.status);
  }
  return res.json() as Promise<CreateReservationResponse>;
}
