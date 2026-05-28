import { NextResponse } from "next/server";
import type { CreateReservationResponse } from "@/lib/booking/api";

// TODO(LimoAnywhere): replace mock with real call to
// https://book.mylimobiz.com/api/tenants/<RELIER_API_ID>/createReservation
// auth: { apiId: process.env.LIMOANYWHERE_API_ID, apiKey: process.env.LIMOANYWHERE_API_KEY, userId: process.env.LIMOANYWHERE_USER_ID }

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // eslint-disable-next-line no-console
  console.log("[booking/create] payload", body);

  await new Promise((r) => setTimeout(r, 450));

  const code = `RLR-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const response: CreateReservationResponse = {
    confirmationCode: code,
    status: "pending",
  };
  return NextResponse.json(response);
}
