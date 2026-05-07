import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";
import type { CreateOrderInput } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CreateOrderInput;
    const order = createOrder(payload);

    return NextResponse.json({
      ok: true,
      order
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
