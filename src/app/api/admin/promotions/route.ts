import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getPromotions, savePromotion } from "@/lib/promotions";

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const pageSize = Math.min(100, Math.max(10, Number(url.searchParams.get("pageSize") || 50)));
  const placement = url.searchParams.get("placement") || "";
  const status = url.searchParams.get("status") || "";
  const search = (url.searchParams.get("search") || "").trim().toLowerCase();
  const offset = (page - 1) * pageSize;

  const promotions = await getPromotions();
  const filtered = promotions.filter((promotion) => {
    const matchesPlacement = !placement || promotion.placement === placement;
    const matchesStatus = !status || (status === "active" ? promotion.is_active : !promotion.is_active);
    const searchable = `${promotion.title} ${promotion.subtitle || ""} ${promotion.description || ""}`.toLowerCase();
    const matchesSearch = !search || searchable.includes(search);
    return matchesPlacement && matchesStatus && matchesSearch;
  });

  return NextResponse.json({
    ok: true,
    promotions: filtered.slice(offset, offset + pageSize),
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
  const promotion = await savePromotion(payload);
  return NextResponse.json({ ok: true, promotion });
}
