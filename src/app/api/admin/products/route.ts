import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getProducts, saveProduct } from "@/lib/productRepository";

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const pageSize = Math.min(100, Math.max(10, Number(url.searchParams.get("pageSize") || 50)));
  const category = url.searchParams.get("category") || "";
  const availability = url.searchParams.get("availability") || "";
  const search = (url.searchParams.get("search") || "").trim().toLowerCase();
  const offset = (page - 1) * pageSize;

  const allProducts = await getProducts();
  const filtered = allProducts.filter((product) => {
    const matchesCategory = !category || product.category === category;
    const matchesAvailability = !availability || (availability === "active" ? product.isAvailable : !product.isAvailable);
    const searchable = `${product.name} ${product.brand || ""} ${product.reference || ""}`.toLowerCase();
    const matchesSearch = !search || searchable.includes(search);
    return matchesCategory && matchesAvailability && matchesSearch;
  });

  return NextResponse.json({
    ok: true,
    products: filtered.slice(offset, offset + pageSize),
    page,
    pageSize,
    total: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / pageSize))
  });
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  const payload = await request.json();
  const product = await saveProduct(payload);
  return NextResponse.json({ ok: true, product });
}
