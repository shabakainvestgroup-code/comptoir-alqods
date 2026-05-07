"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/components/CartProvider";

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const badgeColor = product.badge === "Promo" ? "bg-alert" : product.badge === "Nouveau" ? "bg-turquoise" : "bg-stock";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/produit/${product.slug}`} className="relative block h-48 bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }}>
        {product.badge && <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-extrabold text-white ${badgeColor}`}>{product.badge}</span>}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-bold uppercase text-turquoise">{product.category}</p>
        <Link href={`/produit/${product.slug}`} className="mt-1 line-clamp-2 min-h-[48px] font-extrabold text-navy hover:text-turquoise">{product.name}</Link>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-navy">{product.priceLabel}</span>
          {product.oldPrice && <span className="text-sm text-muted line-through">{product.oldPrice.toLocaleString("fr-MA")} DH</span>}
        </div>
        <p className="mt-2 text-sm font-semibold text-stock">En stock</p>
        <button onClick={() => cart.add(product.id)} className="mt-auto inline-flex items-center justify-center gap-2 rounded-md bg-turquoise px-4 py-3 font-bold text-white transition hover:bg-turquoise-light">
          <ShoppingCart size={18} /> Ajouter au panier
        </button>
      </div>
    </article>
  );
}
