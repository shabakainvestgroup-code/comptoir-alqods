"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Boxes, PackageSearch, ShoppingBag, WalletCards } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

type Order = { total: number; order_status?: string; orderStatus?: string };
type Product = { stock: number };

export function AdminHome() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/orders?pageSize=10").then((response) => response.json()),
      fetch("/api/admin/products?pageSize=10").then((response) => response.json())
    ]).then(([ordersData, productsData]) => {
      setOrders(ordersData.orders || []);
      setProducts(productsData.products || []);
    });
  }, []);

  const cards = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const pending = orders.filter((order) => (order.order_status || order.orderStatus) !== "delivered" && (order.order_status || order.orderStatus) !== "cancelled").length;
    const low = products.filter((product) => Number(product.stock) <= 10).length;
    return [
      { label: "Commandes récentes", value: orders.length, icon: ShoppingBag, href: "/admin/commandes" },
      { label: "À traiter", value: pending, icon: ShoppingBag, href: "/admin/commandes?status=pending" },
      { label: "Produits chargés", value: products.length, icon: PackageSearch, href: "/admin/produits" },
      { label: "Stock faible", value: low, icon: Boxes, href: "/admin/stock?mode=low" },
      { label: "Total récent", value: formatPrice(revenue), icon: WalletCards, href: "/admin/commandes" }
    ];
  }, [orders, products]);

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map(({ label, value, icon: Icon, href }) => (
        <Link key={label} href={href} className="rounded-md border border-line bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
          <Icon className="text-turquoise" />
          <p className="mt-4 text-sm font-bold text-muted">{label}</p>
          <p className="mt-1 text-3xl font-black text-navy">{value}</p>
        </Link>
      ))}
    </div>
  );
}
