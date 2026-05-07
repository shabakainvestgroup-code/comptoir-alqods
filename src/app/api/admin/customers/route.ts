import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { csvResponse } from "@/lib/csv";
import { isSupabaseConfigured, listRows } from "@/lib/supabaseRest";

type Customer = {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  cni?: string;
  address?: string;
  city?: string;
  district?: string;
  customer_type?: string;
  phone_verified?: boolean;
  email_verified?: boolean;
  last_order_at?: string;
  created_at?: string;
};

type Order = {
  id: string;
  order_number: string;
  customer: {
    fullName?: string;
    full_name?: string;
    phone?: string;
    email?: string;
    cni?: string;
  };
  total: number;
  order_status?: string;
  created_at: string;
};

function normalize(value?: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[.\-_/()+]/g, "");
}

function matches(customer: Customer, search: string) {
  if (!search) return true;
  const haystack = [
    customer.full_name,
    customer.phone,
    customer.email,
    customer.cni,
    customer.city,
    customer.customer_type
  ].join(" ").toLowerCase();
  return haystack.includes(search.toLowerCase()) || normalize(haystack).includes(normalize(search));
}

function orderBelongsToCustomer(order: Order, customer: Customer) {
  const identifiers = [customer.phone, customer.email, customer.cni].filter(Boolean).map((value) => normalize(String(value)));
  const orderIdentifiers = [order.customer?.phone, order.customer?.email, order.customer?.cni].filter(Boolean).map((value) => normalize(String(value)));
  return identifiers.some((identifier) => orderIdentifiers.includes(identifier));
}

function exportCustomersCsv(customers: (Customer & { orders_count?: number; revenue?: number })[]) {
  const rows = [
    ["Nom", "Telephone", "Email", "CNI", "Ville", "Quartier", "Type client", "Telephone verifie", "Email verifie", "Commandes", "Total depense TTC", "Derniere commande"],
    ...customers.map((customer) => [
      customer.full_name,
      customer.phone,
      customer.email || "",
      customer.cni || "",
      customer.city || "",
      customer.district || "",
      customer.customer_type || "",
      customer.phone_verified ? "Oui" : "Non",
      customer.email_verified ? "Oui" : "Non",
      customer.orders_count || 0,
      Number(customer.revenue || 0).toFixed(2),
      customer.last_order_at ? new Date(customer.last_order_at).toLocaleDateString("fr-FR") : ""
    ])
  ];

  return csvResponse(`clients-comptoir-alqods-${new Date().toISOString().slice(0, 10)}.csv`, rows);
}

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Non autorisé." }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const pageSize = Math.min(100, Math.max(10, Number(url.searchParams.get("pageSize") || 50)));
  const search = (url.searchParams.get("search") || "").trim();
  const verification = url.searchParams.get("verification") || "";
  const shouldExport = url.searchParams.get("export") === "csv";
  const offset = (page - 1) * pageSize;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      source: "demo",
      customers: [],
      page,
      pageSize,
      total: 0,
      totalPages: 1
    });
  }

  const customers = await listRows<Customer>("customers", {
    select: "*",
    order: "last_order_at.desc",
    limit: 10000
  });

  const orders = await listRows<Order>("orders", {
    select: "id,order_number,customer,total,order_status,created_at",
    order: "created_at.desc",
    limit: 10000
  });

  const filtered = customers.filter((customer) => {
    const matchesSearch = matches(customer, search);
    const matchesVerification =
      !verification ||
      (verification === "phone_verified" && customer.phone_verified) ||
      (verification === "phone_unverified" && !customer.phone_verified) ||
      (verification === "email_verified" && customer.email_verified) ||
      (verification === "email_unverified" && !customer.email_verified);

    return matchesSearch && matchesVerification;
  });

  const enriched = filtered.slice(offset, offset + pageSize).map((customer) => {
    const customerOrders = orders.filter((order) => orderBelongsToCustomer(order, customer));
    const revenue = customerOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);

    return {
      ...customer,
      orders_count: customerOrders.length,
      revenue,
      orders: customerOrders.slice(0, 10)
    };
  });

  if (shouldExport) {
    const exported = filtered.map((customer) => {
      const customerOrders = orders.filter((order) => orderBelongsToCustomer(order, customer));
      const revenue = customerOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
      return {
        ...customer,
        orders_count: customerOrders.length,
        revenue
      };
    });

    return exportCustomersCsv(exported);
  }

  return NextResponse.json({
    ok: true,
    source: "supabase",
    customers: enriched,
    page,
    pageSize,
    total: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / pageSize))
  });
}
