"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BenefitStrip } from "@/components/BenefitStrip";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/formatPrice";

export default function CartPage() {
  const cart = useCart();
  const estimatedDelivery = cart.subtotal > 0 ? 30 : 0;

  return (
    <>
      <Breadcrumb items={[{ label: "Panier" }]} />
      <section className="bg-soft-bg py-10">
        <div className="container-page grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-md border border-line bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-black text-navy">Mon panier</h1>
            <div className="mt-6 space-y-4">
              {cart.lines.length === 0 && <p className="rounded-md bg-soft-bg p-4 text-muted">Votre panier est vide.</p>}
              {cart.lines.map((line) => (
                <div key={line.productId} className="grid gap-4 border-b border-line pb-4 md:grid-cols-[96px_1fr_auto] md:items-center">
                  <div className="h-24 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${line.product.image})` }} />
                  <div>
                    <Link href={`/produit/${line.product.slug}`} className="font-extrabold text-navy">{line.product.name}</Link>
                    <p className="text-sm text-muted">{line.product.priceLabel}</p>
                    <button onClick={() => cart.remove(line.productId)} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-alert"><Trash2 size={16} /> Supprimer</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="grid h-9 w-9 place-items-center rounded-md border border-line" onClick={() => cart.setQuantity(line.productId, line.quantity - 1)}><Minus size={16} /></button>
                    <span className="w-8 text-center font-bold">{line.quantity}</span>
                    <button className="grid h-9 w-9 place-items-center rounded-md border border-line" onClick={() => cart.setQuantity(line.productId, line.quantity + 1)}><Plus size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="h-fit rounded-md border border-line bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-navy">Résumé</h2>
            <div className="mt-5 space-y-3">
              <div className="flex justify-between"><span>Sous-total</span><strong>{formatPrice(cart.subtotal)}</strong></div>
              <div className="flex justify-between"><span>Livraison estimée</span><strong>{formatPrice(estimatedDelivery)}</strong></div>
              <div className="border-t border-line pt-3 flex justify-between text-xl font-black text-navy"><span>Total</span><span>{formatPrice(cart.subtotal + estimatedDelivery)}</span></div>
            </div>
            <Link href="/commande" className="mt-6 block rounded-md bg-turquoise px-5 py-3 text-center font-extrabold text-white">Valider ma commande</Link>
            <Link href="/" className="mt-3 block rounded-md border border-navy px-5 py-3 text-center font-extrabold text-navy">Continuer mes achats</Link>
          </aside>
        </div>
      </section>
      <BenefitStrip />
    </>
  );
}
