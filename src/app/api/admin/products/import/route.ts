import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { importLocalProductsToSupabase } from "@/lib/productRepository";

export async function POST() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  const products = await importLocalProductsToSupabase();
  return NextResponse.json({ ok: true, count: products.length, products });
}
