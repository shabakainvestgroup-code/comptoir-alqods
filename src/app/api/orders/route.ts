import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";
import type { CreateOrderInput } from "@/lib/orders";
import { insertRow, isSupabaseConfigured } from "@/lib/supabaseRest";
import { sendOrderEmails } from "@/lib/email";
import type { Order } from "@/types/order";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CreateOrderInput & { turnstileToken?: string };
    const turnstile = await verifyTurnstileToken(payload.turnstileToken, request);

    if (!turnstile.success) {
      return NextResponse.json({ ok: false, message: "Vérification humaine invalide." }, { status: 403 });
    }

    const order = createOrder(payload);
    let storedOrder = order;

    if (isSupabaseConfigured()) {
      storedOrder = await insertRow<Order>("orders", {
        id: order.id,
        order_number: order.orderNumber,
        customer: order.customer,
        items: order.items,
        subtotal: order.subtotal,
        delivery_fee: order.deliveryFee,
        total: order.total,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        order_status: order.orderStatus,
        created_at: order.createdAt
      });
    }

    await sendOrderEmails(order);

    return NextResponse.json({
      ok: true,
      order: storedOrder
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Impossible de créer la commande."
      },
      { status: 400 }
    );
  }
}
