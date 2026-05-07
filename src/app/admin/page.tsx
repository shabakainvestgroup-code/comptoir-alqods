import type { Metadata } from "next";
import Link from "next/link";
import { Package, ShoppingBag, WalletCards, Clock } from "lucide-react";
import { adminStats, demoOrders } from "@/data/admin";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/formatPrice";

export const metadata: Metadata = {
  title: "Back-office | Comptoir AlQods",
  description: "Back-office de préparation pour la gestion produits et commandes Comptoir AlQods."
};

const cards = [
  { label: "Produits", value: adminStats.products, icon: Package },
  { label: "Commandes aujourd’hui", value: adminStats.ordersToday, icon: ShoppingBag },
  { label: "Commandes à traiter", value: adminStats.pendingOrders, icon: Clock },
  { label: "CA du jour", value: formatPrice(adminStats.revenueToday), icon: WalletCards }
];

export default function AdminPage() {
  return (
    <section className="bg-soft-bg py-10">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase text-turquoise">Administration</p>
            <h1 className="text-4xl font-black text-navy">Back-office Comptoir AlQods</h1>
            <p className="mt-2 text-muted">Préparation de la gestion produits, commandes, statuts, paiement et export.</p>
          </div>
          <Link href="/" className="rounded-md border border-navy px-5 py-3 font-extrabold text-navy">Retour boutique</Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-md border border-line bg-white p-5 shadow-sm">
              <Icon className="text-turquoise" />
              <p className="mt-4 text-sm font-bold text-muted">{label}</p>
              <p className="mt-1 text-3xl font-black text-navy">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <section className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
            <div className="border-b border-line p-5">
              <h2 className="text-2xl font-extrabold text-navy">Commandes récentes</h2>
            </div>
            <div className="divide-y divide-line">
              {demoOrders.map((order) => (
                <div key={order.id} className="grid gap-3 p-5 md:grid-cols-[120px_1fr_140px_120px] md:items-center">
                  <strong className="text-navy">{order.orderNumber}</strong>
                  <div>
                    <p className="font-bold text-navy">{order.customer.fullName}</p>
                    <p className="text-sm text-muted">{order.customer.city} · {order.customer.phone}</p>
                  </div>
                  <strong className="text-navy">{formatPrice(order.total)}</strong>
                  <span className="rounded-full bg-turquoise/10 px-3 py-1 text-center text-xs font-extrabold text-turquoise">{order.orderStatus}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-line bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-extrabold text-navy">Produits à surveiller</h2>
            <div className="mt-4 space-y-3">
              {products.filter((product) => product.stock <= 12).slice(0, 8).map((product) => (
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
