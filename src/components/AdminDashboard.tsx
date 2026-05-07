"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock, Eye, Package, ShoppingBag, WalletCards, X } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

type AdminOrderItem = {
  productId?: string;
  product_id?: string;
  name: string;
  quantity: number;
  unitPrice?: number;
  unit_price?: number;
  totalPrice?: number;
  total_price?: number;
};

type AdminOrder = {
  id: string;
  orderNumber?: string;
  order_number?: string;
  customer: {
    fullName?: string;
    full_name?: string;
    phone: string;
    email?: string;
    address?: string;
    city: string;
    district?: string;
    customerType?: string;
    customer_type?: string;
  };
  items: AdminOrderItem[];
  subtotal?: number;
  deliveryFee?: number;
  delivery_fee?: number;
  total: number;
  paymentMethod?: string;
  payment_method?: string;
  paymentStatus?: string;
  payment_status?: string;
  orderStatus?: string;
  order_status?: string;
  createdAt?: string;
  created_at?: string;
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

function orderNumber(order: AdminOrder) {
  return order.orderNumber || order.order_number || "Commande";
}

function customerName(order: AdminOrder) {
  return order.customer.fullName || order.customer.full_name || "Client";
}

function orderStatus(order: AdminOrder) {
  return order.orderStatus || order.order_status || "pending";
}

function paymentMethod(order: AdminOrder) {
  return order.paymentMethod || order.payment_method;
}

function paymentStatus(order: AdminOrder) {
  return order.paymentStatus || order.payment_status;
}

function unitPrice(item: AdminOrderItem) {
  return Number(item.unitPrice ?? item.unit_price ?? 0);
}

function totalPrice(item: AdminOrderItem) {
  return Number(item.totalPrice ?? item.total_price ?? item.quantity * unitPrice(item));
}

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [message, setMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const stats = useMemo(() => {
    const pending = orders.filter((order) => orderStatus(order) !== "delivered" && orderStatus(order) !== "cancelled").length;
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

  async function updateStatus(id: string, nextStatus: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: nextStatus })
    });
    await loadAdminData();
    setSelectedOrder((current) => current && current.id === id ? { ...current, orderStatus: nextStatus, order_status: nextStatus } : current);
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
              {orders.map((order) => (
                <div key={order.id} className="grid gap-3 p-5 md:grid-cols-[120px_1fr_130px_170px_120px] md:items-center">
                  <strong className="text-navy">{orderNumber(order)}</strong>
                  <div>
                    <p className="font-bold text-navy">{customerName(order)}</p>
                    <p className="text-sm text-muted">{order.customer.city} · {order.customer.phone}</p>
                  </div>
                  <strong className="text-navy">{formatPrice(Number(order.total || 0))}</strong>
                  <select value={orderStatus(order)} onChange={(event) => updateStatus(order.id, event.target.value)} className="rounded-md border border-line px-3 py-2 text-sm font-bold outline-turquoise">
                    {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                  <button onClick={() => setSelectedOrder(order)} className="inline-flex items-center justify-center gap-2 rounded-md bg-navy px-3 py-2 text-sm font-extrabold text-white">
                    <Eye size={16} /> Détail
                  </button>
                </div>
              ))}
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

      {selectedOrder && (
        <div className="fixed inset-0 z-[90]">
          <button className="absolute inset-0 bg-navy-deep/55" onClick={() => setSelectedOrder(null)} aria-label="Fermer le détail commande" />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-soft">
            <div className="flex items-start justify-between gap-4 border-b border-line p-6">
              <div>
                <p className="text-sm font-extrabold uppercase text-turquoise">Récapitulatif commande</p>
                <h2 className="mt-1 text-3xl font-black text-navy">{orderNumber(selectedOrder)}</h2>
                <p className="mt-1 text-sm text-muted">{selectedOrder.createdAt || selectedOrder.created_at || "Date non renseignée"}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="grid h-10 w-10 place-items-center rounded-md border border-line" aria-label="Fermer">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-line p-4">
                  <h3 className="font-extrabold text-navy">Client</h3>
                  <div className="mt-3 space-y-1 text-sm text-muted">
                    <p><strong className="text-navy">Nom :</strong> {customerName(selectedOrder)}</p>
                    <p><strong className="text-navy">Téléphone :</strong> {selectedOrder.customer.phone}</p>
                    <p><strong className="text-navy">Email :</strong> {selectedOrder.customer.email || "Non renseigné"}</p>
                    <p><strong className="text-navy">Type :</strong> {selectedOrder.customer.customerType || selectedOrder.customer.customer_type || "Non renseigné"}</p>
                  </div>
                </div>
                <div className="rounded-md border border-line p-4">
                  <h3 className="font-extrabold text-navy">Livraison</h3>
                  <div className="mt-3 space-y-1 text-sm text-muted">
                    <p><strong className="text-navy">Adresse :</strong> {selectedOrder.customer.address || "Non renseignée"}</p>
                    <p><strong className="text-navy">Quartier :</strong> {selectedOrder.customer.district || "Non renseigné"}</p>
                    <p><strong className="text-navy">Ville :</strong> {selectedOrder.customer.city}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-md border border-line">
                <div className="grid grid-cols-[1fr_70px_110px_110px] gap-3 bg-soft-bg p-3 text-sm font-extrabold text-navy">
                  <span>Produit</span>
                  <span>Qté</span>
                  <span>PU</span>
                  <span>Total</span>
                </div>
                {selectedOrder.items.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="grid grid-cols-[1fr_70px_110px_110px] gap-3 border-t border-line p-3 text-sm">
                    <span className="font-bold text-navy">{item.name}</span>
                    <span>{item.quantity}</span>
                    <span>{formatPrice(unitPrice(item))}</span>
                    <span className="font-bold text-navy">{formatPrice(totalPrice(item))}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-md border border-line p-4">
                <h3 className="font-extrabold text-navy">Paiement et total</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span>Sous-total</span><strong>{formatPrice(Number(selectedOrder.subtotal || 0))}</strong></div>
                  <div className="flex justify-between"><span>Livraison</span><strong>{formatPrice(Number(selectedOrder.deliveryFee ?? selectedOrder.delivery_fee ?? 0))}</strong></div>
                  <div className="flex justify-between text-lg font-black text-navy"><span>Total</span><span>{formatPrice(Number(selectedOrder.total || 0))}</span></div>
                  <div className="border-t border-line pt-2 text-muted">
                    <p><strong className="text-navy">Mode :</strong> {paymentMethod(selectedOrder) === "card" ? "Carte bancaire" : "Paiement à la livraison"}</p>
                    <p><strong className="text-navy">Statut paiement :</strong> {paymentStatus(selectedOrder) || "Non renseigné"}</p>
                    <p><strong className="text-navy">Statut commande :</strong> {statuses.find((item) => item.value === orderStatus(selectedOrder))?.label || orderStatus(selectedOrder)}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
