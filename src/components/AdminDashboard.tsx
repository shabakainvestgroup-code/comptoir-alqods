"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock, Package, ShoppingBag, WalletCards } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

type AdminOrder = {
  id: string;
  orderNumber?: string;
  order_number?: string;
  customer: { fullName?: string; full_name?: string; phone: string; city: string };
  items: unknown[];
  total: number;
  orderStatus?: string;
  order_status?: string;
};

type AdminProduct = {
  id: string;
  name: string;
  category: string;
  stock: number;
};

const statuses = [
  { value: "pending", label: "Nouvelle" },
  { value: "confirmed", label: "Confirmée" },
  { value: "preparing", label: "Préparation" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" }
];

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [message, setMessage] = useState("");

  const stats = useMemo(() => {
    const pending = orders.filter((order) => (order.orderStatus || order.order_status) !== "delivered" && (order.orderStatus || order.order_status) !== "cancelled").length;
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    return [
      { label: "Produits", value: products.length, icon: Package },
      { label: "Commandes", value: orders.length, icon: ShoppingBag },
      { label: "À traiter", value: pending, icon: Clock },
      { label: "Total commandes", value: formatPrice(revenue), icon: WalletCards }
    ];
  }, [orders, products]);

  async function loadAdminData() {
    const [ordersResponse, productsResponse] = await Promise.all([
      fetch("/api/admin/orders"),
      fetch("/api/admin/products")
    ]);

    if (ordersResponse.status === 401 || productsResponse.status === 401) {
      setAuthenticated(false);
      return;
    }

    const ordersData = await ordersResponse.json();
    const productsData = await productsResponse.json();
    setOrders(ordersData.orders || []);
    setProducts(productsData.products || []);
    setAuthenticated(true);
  }

  useEffect(() => {
    loadAdminData().catch(() => setAuthenticated(false));
  }, []);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      setMessage("Mot de passe incorrect.");
      return;
    }

    setPassword("");
    await loadAdminData();
  }

  async function updateStatus(id: string, orderStatus: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus })
    });
    await loadAdminData();
  }

  if (!authenticated) {
    return (
      <section className="bg-soft-bg py-12">
        <div className="container-page max-w-md">
          <form onSubmit={login} className="rounded-md border border-line bg-white p-8 shadow-sm">
            <p className="text-sm font-extrabold uppercase text-turquoise">Administration</p>
            <h1 className="mt-2 text-3xl font-black text-navy">Connexion back-office</h1>
            <p className="mt-2 text-sm text-muted">Accès réservé à l’équipe Comptoir AlQods.</p>
            <label className="mt-6 grid gap-2 text-sm font-bold text-navy">
              Mot de passe
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" />
            </label>
            {message && <p className="mt-4 rounded-md bg-alert/10 p-3 text-sm font-bold text-alert">{message}</p>}
            <button className="mt-5 w-full rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">Se connecter</button>
            <Link href="/" className="mt-4 block text-center text-sm font-bold text-navy">Retour boutique</Link>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-soft-bg py-10">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase text-turquoise">Administration</p>
            <h1 className="text-4xl font-black text-navy">Back-office Comptoir AlQods</h1>
            <p className="mt-2 text-muted">Gestion des commandes, statuts, produits et stocks.</p>
          </div>
          <Link href="/" className="rounded-md border border-navy px-5 py-3 font-extrabold text-navy">Retour boutique</Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-md border border-line bg-white p-5 shadow-sm">
              <Icon className="text-turquoise" />
              <p className="mt-4 text-sm font-bold text-muted">{label}</p>
              <p className="mt-1 text-3xl font-black text-navy">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
          <section className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
            <div className="border-b border-line p-5">
              <h2 className="text-2xl font-extrabold text-navy">Commandes</h2>
            </div>
            <div className="divide-y divide-line">
              {orders.map((order) => {
                const status = order.orderStatus || order.order_status || "pending";
                return (
                  <div key={order.id} className="grid gap-3 p-5 md:grid-cols-[120px_1fr_130px_170px] md:items-center">
                    <strong className="text-navy">{order.orderNumber || order.order_number}</strong>
                    <div>
                      <p className="font-bold text-navy">{order.customer.fullName || order.customer.full_name || "Client"}</p>
                      <p className="text-sm text-muted">{order.customer.city} · {order.customer.phone}</p>
                    </div>
                    <strong className="text-navy">{formatPrice(Number(order.total || 0))}</strong>
                    <select value={status} onChange={(event) => updateStatus(order.id, event.target.value)} className="rounded-md border border-line px-3 py-2 text-sm font-bold outline-turquoise">
                      {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-md border border-line bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-extrabold text-navy">Stock faible</h2>
            <div className="mt-4 space-y-3">
              {products.filter((product) => Number(product.stock) <= 12).slice(0, 10).map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-3 border-b border-line pb-3">
                  <div>
                    <p className="font-bold text-navy">{product.name}</p>
                    <p className="text-sm text-muted">{product.category}</p>
                  </div>
                  <span className="rounded-full bg-alert/10 px-3 py-1 text-xs font-extrabold text-alert">Stock {product.stock}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
