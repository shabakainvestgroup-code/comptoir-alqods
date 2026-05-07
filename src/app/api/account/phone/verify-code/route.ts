import { NextResponse } from "next/server";
import { findCustomerByIdentifier } from "@/lib/customers";
import { verifySmsCode } from "@/lib/verification";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  const payload = await request.json();
  const turnstile = await verifyTurnstileToken(payload.turnstileToken, request);

  if (!turnstile.success) {
    return NextResponse.json({ ok: false, message: "Vérification humaine invalide." }, { status: 403 });
  }

  const customer = await findCustomerByIdentifier(String(payload.identifier || ""));
  if (!customer?.id) {
    return NextResponse.json({ ok: false, message: "Compte introuvable." }, { status: 404 });
  }

  const result = await verifySmsCode(customer.id, String(payload.code || ""));
  if (!result.ok) {
    return NextResponse.json({ ok: false, message: "Code invalide ou expiré." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: "Téléphone vérifié."
  });
}
