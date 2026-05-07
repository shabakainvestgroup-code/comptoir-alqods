import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const payload = await request.json();

  return NextResponse.json({
    ok: true,
    message: "Demande enregistrée. L’envoi email sera activé après configuration RESEND_API_KEY.",
    to: env.adminEmail,
    payload
  });
}
