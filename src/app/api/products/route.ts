import { NextResponse } from "next/server";
import { getProducts } from "@/lib/productRepository";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ ok: true, products });
}
