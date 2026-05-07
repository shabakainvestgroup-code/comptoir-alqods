"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/formatPrice";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button className="absolute inset-0 bg-navy-deep/50" onClick={onClose} aria-label="Fermer le panier" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-line p-5">
          <div>
            <p className="text-xs font-bold uppercase text-turquoise">Panier</p>
            <h2 className="text-xl font-extrabold text-navy">{cart.count} article(s)</h2>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-md border border-line" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5">
          {cart.lines.length === 0 ? (
            <p className="rounded-md bg-soft-bg p-4 text-sm text-muted">Votre panier est vide pour le moment.</p>
          ) : (
            <div className="space-y-4">
              {cart.lines.map((line) => (
                <div key={line.productId} className="flex gap-3 border-b border-line pb-4">
                  <div className="h-16 w-16 shrink-0 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${line.product.image})` }} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy">{line.product.name}</p>
                    <p className="text-sm text-muted">Qté {line.quantity} · {line.product.priceLabel}</p>
                  </div>
                  <button className="text-sm font-semibold text-alert" onClick={() => cart.remove(line.productId)}>Supprimer</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-line p-5">
          <div className="mb-4 flex items-center justify-between text-lg font-extrabold text-navy">
            <span>Total</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/panier" onClick={onClose} className="rounded-md border border-navy px-4 py-3 text-center font-bold text-navy">Voir mon panier</Link>
            <Link href="/commande" onClick={onClose} className="rounded-md bg-turquoise px-4 py-3 text-center font-bold text-white">Commander</Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
