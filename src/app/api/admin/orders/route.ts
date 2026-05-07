import { NextResponse } from "next/server";
import { demoOrders } from "@/data/admin";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { isSupabaseConfigured, listRows } from "@/lib/supabaseRest";

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, source: "demo", orders: demoOrders });
  }

  const orders = await listRows("orders", {
    select: "*",
    order: "created_at.desc",
    limit: 50
  });

  return NextResponse.json({ ok: true, source: "supabase", orders });
}
