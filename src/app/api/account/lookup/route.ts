import { NextResponse } from "next/server";
import { findCustomerByIdentifier, getCustomerOrders } from "@/lib/customers";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  const payload = await request.json();
  const turnstile = await verifyTurnstileToken(payload.turnstileToken, request);

  if (!turnstile.success) {
    return NextResponse.json({ ok: false, message: "Vérification humaine invalide." }, { status: 403 });
  }

  const identifier = String(payload.identifier || "").trim();
  if (!identifier) {
    return NextResponse.json({ ok: false, message: "Identifiant requis." }, { status: 400 });
  }

  const customer = await findCustomerByIdentifier(identifier);
  if (!customer) {
    return NextResponse.json({ ok: false, message: "Aucun compte trouvé." }, { status: 404 });
  }

  const orders = await getCustomerOrders(customer);

  return NextResponse.json({
    ok: true,
    customer,
    orders
  });
}
