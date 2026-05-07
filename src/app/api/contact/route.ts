import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  const payload = await request.json();
  const turnstile = await verifyTurnstileToken(payload.turnstileToken, request);

  if (!turnstile.success) {
    return NextResponse.json({ ok: false, message: "Vérification humaine invalide." }, { status: 403 });
  }

  return NextResponse.json({
    ok: true,
    message: "Demande enregistrée. L’envoi email sera activé après configuration RESEND_API_KEY.",
    to: env.adminEmail,
    payload
  });
}
