"use client";

import { useEffect, useState } from "react";
import { Eye, X } from "lucide-react";
import { AdminPager } from "@/components/AdminPager";
import { formatPrice } from "@/lib/formatPrice";

type Item = { name: string; quantity: number; unitPrice?: number; unit_price?: number; totalPrice?: number; total_price?: number };
type Order = {
  id: string;
  orderNumber?: string;
  order_number?: string;
  customer: { fullName?: string; full_name?: string; phone: string; email?: string; address?: string; city: string; district?: string };
  items: Item[];
  subtotal?: number;
  deliveryFee?: number;
  delivery_fee?: number;
  total: number;
  orderStatus?: string;
  order_status?: string;
  paymentMethod?: string;
  payment_method?: string;
};

const statuses = [
  ["", "Tous les statuts"],
  ["pending", "Nouvelle"],
  ["confirmed", "Confirmée"],
  ["preparing", "Préparation"],
  ["shipped", "Expédiée"],
  ["delivered", "Livrée"],
  ["cancelled", "Annulée"]
];

function numberOf(order: Order) {
  return order.orderNumber || order.order_number || "Commande";
}

function nameOf(order: Order) {
  return order.customer.fullName || order.customer.full_name || "Client";
}

function statusOf(order: Order) {
  return order.orderStatus || order.order_status || "pending";
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  async function load() {
    const params = new URLSearchParams({ page: String(page), pageSize: "50" });
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    const data = await fetch(`/api/admin/orders?${params.toString()}`).then((response) => response.json());
    setOrders(data.orders || []);
    setTotalPages(data.totalPages || 1);
  }

  useEffect(() => {
    load();
  }, [page, status]);

  async function updateStatus(id: string, orderStatus: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus })
    });
    await load();
    setSelected((current) => current && current.id === id ? { ...current, orderStatus, order_status: orderStatus } : current);
  }

  return (
    <>
      <section className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
        <div className="grid gap-3 border-b border-line p-5 lg:grid-cols-[1fr_220px_120px]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && load()} placeholder="Rechercher commande, client, téléphone..." className="rounded-md border border-line px-4 py-3 outline-turquoise" />
          <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="rounded-md border border-line px-4 py-3 outline-turquoise">
            {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <button onClick={() => { setPage(1); load(); }} className="rounded-md bg-turquoise px-4 py-3 font-extrabold text-white">Filtrer</button>
        </div>
        <div className="divide-y divide-line">
          {orders.map((order) => (
            <div key={order.id} className="grid gap-3 p-5 md:grid-cols-[130px_1fr_130px_170px_110px] md:items-center">
              <strong className="text-navy">{numberOf(order)}</strong>
              <div><p className="font-bold text-navy">{nameOf(order)}</p><p className="text-sm text-muted">{order.customer.city} · {order.customer.phone}</p></div>
              <strong>{formatPrice(Number(order.total || 0))}</strong>
              <select value={statusOf(order)} onChange={(event) => updateStatus(order.id, event.target.value)} className="rounded-md border border-line px-3 py-2 text-sm font-bold outline-turquoise">
                {statuses.slice(1).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <button onClick={() => setSelected(order)} className="inline-flex items-center justify-center gap-2 rounded-md bg-navy px-3 py-2 text-sm font-extrabold text-white"><Eye size={16} /> Détail</button>
            </div>
          ))}
        </div>
        <AdminPager page={page} totalPages={totalPages} onPageChange={setPage} />
      </section>

      {selected && (
        <div className="fixed inset-0 z-[90]">
          <button className="absolute inset-0 bg-navy-deep/55" onClick={() => setSelected(null)} aria-label="Fermer" />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-soft">
            <div className="flex items-start justify-between gap-4 border-b border-line p-6">
              <div><p className="text-sm font-extrabold uppercase text-turquoise">Détail commande</p><h2 className="mt-1 text-3xl font-black text-navy">{numberOf(selected)}</h2></div>
              <button onClick={() => setSelected(null)} className="grid h-10 w-10 place-items-center rounded-md border border-line"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-line p-4"><h3 className="font-extrabold text-navy">Client</h3><p>{nameOf(selected)}</p><p>{selected.customer.phone}</p><p>{selected.customer.email || "Email non renseigné"}</p></div>
                <div className="rounded-md border border-line p-4"><h3 className="font-extrabold text-navy">Livraison</h3><p>{selected.customer.address || "Adresse non renseignée"}</p><p>{selected.customer.district || ""} {selected.customer.city}</p></div>
              </div>
              <div className="mt-5 overflow-hidden rounded-md border border-line">
                <div className="grid grid-cols-[1fr_70px_110px_110px] gap-3 bg-soft-bg p-3 text-sm font-extrabold text-navy"><span>Produit</span><span>Qté</span><span>PU</span><span>Total</span></div>
                {selected.items.map((item, index) => {
                  const unit = Number(item.unitPrice ?? item.unit_price ?? 0);
                  const total = Number(item.totalPrice ?? item.total_price ?? unit * item.quantity);
                  return <div key={`${item.name}-${index}`} className="grid grid-cols-[1fr_70px_110px_110px] gap-3 border-t border-line p-3 text-sm"><strong>{item.name}</strong><span>{item.quantity}</span><span>{formatPrice(unit)}</span><strong>{formatPrice(total)}</strong></div>;
                })}
              </div>
              <div className="mt-5 rounded-md border border-line p-4">
                <div className="flex justify-between"><span>Sous-total</span><strong>{formatPrice(Number(selected.subtotal || 0))}</strong></div>
                <div className="flex justify-between"><span>Livraison</span><strong>{formatPrice(Number(selected.deliveryFee ?? selected.delivery_fee ?? 0))}</strong></div>
                <div className="flex justify-between text-lg font-black text-navy"><span>Total</span><span>{formatPrice(Number(selected.total || 0))}</span></div>
                <p className="mt-3 text-muted">Paiement : {(selected.paymentMethod || selected.payment_method) === "card" ? "Carte bancaire" : "Paiement à la livraison"}</p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
