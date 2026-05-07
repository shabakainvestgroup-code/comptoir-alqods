import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getProducts, saveProduct } from "@/lib/productRepository";

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  const products = await getProducts();
  return NextResponse.json({ ok: true, products });
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  const payload = await request.json();
  const product = await saveProduct(payload);
  return NextResponse.json({ ok: true, product });
}
