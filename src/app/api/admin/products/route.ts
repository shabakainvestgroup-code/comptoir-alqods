import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { isSupabaseConfigured, listRows } from "@/lib/supabaseRest";

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, source: "demo", products });
  }

  const rows = await listRows("products", {
    select: "*",
    order: "name.asc",
    limit: 200
  });

  return NextResponse.json({ ok: true, source: "supabase", products: rows });
}
