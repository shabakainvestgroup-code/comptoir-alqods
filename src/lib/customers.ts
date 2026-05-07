import type { Order } from "@/types/order";
import { isSupabaseConfigured, listRows, upsertRows } from "@/lib/supabaseRest";

export type Customer = {
  id?: string;
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
};

type StoredOrder = {
  id: string;
  order_number: string;
  customer: {
    fullName?: string;
    full_name?: string;
    phone?: string;
    email?: string;
    cni?: string;
    address?: string;
    city?: string;
    district?: string;
    customerType?: string;
    customer_type?: string;
  };
  items: unknown[];
  total: number;
  order_status: string;
  payment_method: string;
  created_at: string;
};

function normalize(value?: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[.\-_/()+]/g, "");
}

function matchesIdentifier(value: string, identifier: string) {
  const normalizedValue = normalize(value);
  const normalizedIdentifier = normalize(identifier);
  return normalizedValue === normalizedIdentifier || normalizedValue.endsWith(normalizedIdentifier);
}

function customerFromStoredOrder(order: StoredOrder): Customer {
  return {
    full_name: order.customer.fullName || order.customer.full_name || "Client Comptoir AlQods",
    phone: order.customer.phone || "",
    email: order.customer.email,
    cni: order.customer.cni,
    address: order.customer.address,
    city: order.customer.city,
    district: order.customer.district,
    customer_type: order.customer.customerType || order.customer.customer_type,
    last_order_at: order.created_at
  };
}

export async function upsertCustomerFromOrder(order: Order) {
  if (!isSupabaseConfigured()) return null;

  const customer: Customer = {
    full_name: order.customer.fullName,
    phone: order.customer.phone,
    email: order.customer.email,
    cni: order.customer.cni,
    address: order.customer.address,
    city: order.customer.city,
    district: order.customer.district,
    customer_type: order.customer.customerType,
    last_order_at: order.createdAt
  };

  const rows = await upsertRows<Customer>("customers", [customer], "phone");
  return rows[0] || null;
}

export async function findCustomerByIdentifier(identifier: string) {
  if (!isSupabaseConfigured()) return null;

  const value = identifier.trim();
  const customers = await listRows<Customer>("customers", {
    select: "*",
    limit: 10000
  });

  const existingCustomer = customers.find((customer) =>
    matchesIdentifier(customer.phone, value) ||
    matchesIdentifier(customer.cni || "", value) ||
    matchesIdentifier(customer.email || "", value)
  );

  if (existingCustomer) return existingCustomer;

  const orders = await findOrdersByIdentifier(value);
  const order = orders[0];
  if (!order) return null;

  const customer = customerFromStoredOrder(order);
  if (!customer.phone) return customer;

  const rows = await upsertRows<Customer>("customers", [customer], "phone");
  return rows[0] || customer;
}

export async function findOrdersByIdentifier(identifier: string) {
  if (!isSupabaseConfigured()) return [];

  const orders = await listRows<StoredOrder>("orders", {
    select: "*",
    order: "created_at.desc",
    limit: 10000
  });

  return orders.filter((order) =>
    matchesIdentifier(order.customer?.phone || "", identifier) ||
    matchesIdentifier(order.customer?.cni || "", identifier) ||
    matchesIdentifier(order.customer?.email || "", identifier)
  );
}

export async function getCustomerOrders(customer: Customer) {
  if (!isSupabaseConfigured()) return [];

  const identifiers = [customer.phone, customer.cni, customer.email].filter(Boolean) as string[];
  const orders = await listRows<StoredOrder>("orders", {
    select: "*",
    order: "created_at.desc",
    limit: 10000
  });

  return orders.filter((order) =>
    identifiers.some((identifier) =>
      matchesIdentifier(order.customer?.phone || "", identifier) ||
      matchesIdentifier(order.customer?.cni || "", identifier) ||
      matchesIdentifier(order.customer?.email || "", identifier)
    )
  );
}
