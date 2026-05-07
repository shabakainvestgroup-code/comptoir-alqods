import { NextResponse } from "next/server";
import { demoOrders } from "@/data/admin";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getRowById, isSupabaseConfigured } from "@/lib/supabaseRest";
import { renderOrderDocumentHtml } from "@/lib/orderDocument";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type") === "quote" ? "quote" : "invoice";
  const origin = url.origin;

  const order = isSupabaseConfigured()
    ? await getRowById("orders", params.id)
    : demoOrders.find((item) => item.id === params.id);

  if (!order) {
    return NextResponse.json({ ok: false, message: "Commande introuvable." }, { status: 404 });
  }

  return new Response(renderOrderDocumentHtml(order as never, type, origin), {
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}
