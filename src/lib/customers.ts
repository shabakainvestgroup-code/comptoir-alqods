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
    or: `(phone.eq.${value},cni.eq.${value},email.eq.${value})`,
    limit: 1
  });

  return customers[0] || null;
}

export async function getCustomerOrders(customer: Customer) {
  if (!isSupabaseConfigured()) return [];

  return listRows("orders", {
    select: "*",
    order: "created_at.desc",
    or: `(customer->>phone.eq.${customer.phone},customer->>cni.eq.${customer.cni || "__none__"},customer->>email.eq.${customer.email || "__none__"})`,
    limit: 50
  });
}
