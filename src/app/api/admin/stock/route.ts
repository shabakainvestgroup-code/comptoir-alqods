import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getProducts } from "@/lib/productRepository";

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  const url = new URL(request.url);
  const threshold = Math.max(0, Number(url.searchParams.get("threshold") || 10));
  const category = url.searchParams.get("category") || "";
  const mode = url.searchParams.get("mode") || "all";
  const search = (url.searchParams.get("search") || "").trim().toLowerCase();

  const products = (await getProducts()).filter((product) => {
    const matchesCategory = !category || product.category === category;
    const matchesMode = mode === "low" ? product.stock <= threshold && product.stock > 0 : mode === "out" ? product.stock <= 0 : true;
    const searchable = `${product.name} ${product.brand || ""} ${product.reference || ""}`.toLowerCase();
    const matchesSearch = !search || searchable.includes(search);
    return matchesCategory && matchesMode && matchesSearch;
  });

  return NextResponse.json({
    ok: true,
    threshold,
    products,
    total: products.length,
    lowStock: products.filter((product) => product.stock <= threshold && product.stock > 0).length,
    outOfStock: products.filter((product) => product.stock <= 0).length
  });
}
