import { NextResponse } from "next/server";
import type { QuoteResponse } from "@/lib/booking/api";

// TODO(LimoAnywhere): replace mock with real call to
// https://book.mylimobiz.com/api/tenants/<RELIER_API_ID>/quickQuote
// auth: { apiId: process.env.LIMOANYWHERE_API_ID, apiKey: process.env.LIMOANYWHERE_API_KEY, userId: process.env.LIMOANYWHERE_USER_ID }

const MOCK_QUOTES: QuoteResponse["quotes"] = [
  {
    vehicleId: "lyriq",
    vehicleName: "Cadillac Lyriq",
    paxCapacity: 2,
    bagCapacity: 2,
    priceUSD: 145,
    etaMinutes: 12,
  },
  {
    vehicleId: "s-class",
    vehicleName: "Mercedes-Benz S-Class",
    paxCapacity: 2,
    bagCapacity: 2,
    priceUSD: 185,
    etaMinutes: 14,
  },
  {
    vehicleId: "escalade",
    vehicleName: "Cadillac Escalade",
    paxCapacity: 5,
    bagCapacity: 6,
    priceUSD: 215,
    etaMinutes: 16,
  },
  {
    vehicleId: "sprinter",
    vehicleName: "Mercedes-Benz Sprinter",
    paxCapacity: 13,
    bagCapacity: 10,
    priceUSD: 320,
    etaMinutes: 18,
  },
];

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Log for now so we can verify wiring end-to-end.
  // eslint-disable-next-line no-console
  console.log("[booking/quote] payload", body);

  await new Promise((r) => setTimeout(r, 350));

  const response: QuoteResponse = {
    tripId: `mock-${Date.now()}`,
    quotes: MOCK_QUOTES,
  };
  return NextResponse.json(response);
}
