import { NextResponse } from "next/server";
import { demoOrders } from "@/data/admin";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { isSupabaseConfigured, listRows } from "@/lib/supabaseRest";

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const pageSize = Math.min(100, Math.max(10, Number(url.searchParams.get("pageSize") || 50)));
  const status = url.searchParams.get("status") || "";
  const search = (url.searchParams.get("search") || "").trim().toLowerCase();
  const offset = (page - 1) * pageSize;

  if (!isSupabaseConfigured()) {
    const filtered = demoOrders.filter((order) => {
      const matchesStatus = !status || order.orderStatus === status;
      const searchable = `${order.orderNumber} ${order.customer.fullName} ${order.customer.phone}`.toLowerCase();
      const matchesSearch = !search || searchable.includes(search);
      return matchesStatus && matchesSearch;
    });

    return NextResponse.json({
      ok: true,
      source: "demo",
      orders: filtered.slice(offset, offset + pageSize),
      page,
      pageSize,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize))
    });
  }

  const filters: Record<string, string> = {};
  if (status) filters.order_status = `eq.${status}`;
  const or = search ? `(order_number.ilike.*${search}*,customer->>fullName.ilike.*${search}*,customer->>phone.ilike.*${search}*)` : undefined;

  const allMatching = await listRows("orders", {
    select: "id",
    filters,
    or,
    limit: 10000
  });

  const orders = await listRows("orders", {
    select: "*",
    order: "created_at.desc",
    filters,
    or,
    limit: pageSize,
    offset
  });

  return NextResponse.json({
    ok: true,
    source: "supabase",
    orders,
    page,
    pageSize,
    total: allMatching.length,
    totalPages: Math.max(1, Math.ceil(allMatching.length / pageSize))
  });
}
