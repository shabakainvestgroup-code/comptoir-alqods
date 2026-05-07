import { NextResponse } from "next/server";
import { findCustomerByIdentifier } from "@/lib/customers";
import { sendEmailVerificationCode } from "@/lib/verification";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  const payload = await request.json();
  const turnstile = await verifyTurnstileToken(payload.turnstileToken, request);

  if (!turnstile.success) {
    return NextResponse.json({ ok: false, message: "Vérification humaine invalide." }, { status: 403 });
  }

  const customer = await findCustomerByIdentifier(String(payload.identifier || ""));
  if (!customer || !customer.email) {
    return NextResponse.json({ ok: false, message: "Compte ou email introuvable." }, { status: 404 });
  }

  await sendEmailVerificationCode(customer);

  return NextResponse.json({
    ok: true,
    message: "Code envoyé par email."
  });
}
