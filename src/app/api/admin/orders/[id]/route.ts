import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { isSupabaseConfigured, updateRow } from "@/lib/supabaseRest";
import { orderStatuses } from "@/lib/orders";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  const { orderStatus } = await request.json();

  if (!orderStatuses.includes(orderStatus)) {
    return NextResponse.json({ ok: false, message: "Statut invalide." }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, source: "demo", orderStatus });
  }

  const order = await updateRow("orders", params.id, {
    order_status: orderStatus,
    updated_at: new Date().toISOString()
  });

  return NextResponse.json({ ok: true, source: "supabase", order });
}
