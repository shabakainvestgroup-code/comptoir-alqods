import { NextResponse } from "next/server";
import { demoOrders } from "@/data/admin";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { csvResponse } from "@/lib/csv";
import { isSupabaseConfigured, listRows } from "@/lib/supabaseRest";

type ExportOrder = {
  orderNumber?: string;
  order_number?: string;
  customer?: {
    fullName?: string;
    full_name?: string;
    phone?: string;
    email?: string;
    cni?: string;
    city?: string;
  };
  total?: number;
  orderStatus?: string;
  order_status?: string;
  paymentMethod?: string;
  payment_method?: string;
  paymentStatus?: string;
  payment_status?: string;
  createdAt?: string;
  created_at?: string;
};

function exportOrdersCsv(orders: ExportOrder[]) {
  const rows = [
    ["Numero commande", "Date", "Client", "Telephone", "Email", "CNI", "Ville", "Total TTC", "Statut commande", "Mode paiement", "Statut paiement"],
    ...orders.map((order) => [
      order.orderNumber || order.order_number || "",
      order.createdAt || order.created_at ? new Date(order.createdAt || order.created_at || "").toLocaleDateString("fr-FR") : "",
      order.customer?.fullName || order.customer?.full_name || "",
      order.customer?.phone || "",
      order.customer?.email || "",
      order.customer?.cni || "",
      order.customer?.city || "",
      Number(order.total || 0).toFixed(2),
      order.orderStatus || order.order_status || "",
      order.paymentMethod || order.payment_method || "",
      order.paymentStatus || order.payment_status || ""
    ])
  ];

  return csvResponse(`commandes-comptoir-alqods-${new Date().toISOString().slice(0, 10)}.csv`, rows);
}

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const pageSize = Math.min(100, Math.max(10, Number(url.searchParams.get("pageSize") || 50)));
  const status = url.searchParams.get("status") || "";
  const search = (url.searchParams.get("search") || "").trim().toLowerCase();
  const shouldExport = url.searchParams.get("export") === "csv";
  const offset = (page - 1) * pageSize;

  if (!isSupabaseConfigured()) {
    const filtered = demoOrders.filter((order) => {
      const matchesStatus = !status || order.orderStatus === status;
      const searchable = `${order.orderNumber} ${order.customer.fullName} ${order.customer.phone}`.toLowerCase();
      const matchesSearch = !search || searchable.includes(search);
      return matchesStatus && matchesSearch;
    });

    if (shouldExport) {
      return exportOrdersCsv(filtered);
    }

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

  if (shouldExport) {
    const exportedOrders = await listRows<ExportOrder>("orders", {
      select: "*",
      order: "created_at.desc",
      filters,
      or,
      limit: 10000
    });
    return exportOrdersCsv(exportedOrders);
  }

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
