"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { Product } from "@/types/product";

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const cart = useCart();

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <div className="flex rounded-md border border-line">
        <button className="w-11 font-bold" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
        <input className="w-14 border-x border-line text-center font-bold outline-none" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))} />
        <button className="w-11 font-bold" onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>
      <button onClick={() => cart.add(product, quantity)} className="rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">Ajouter au panier</button>
      <Link href="/commande" onClick={() => cart.add(product, quantity)} className="rounded-md bg-navy px-5 py-3 font-extrabold text-white">Commander maintenant</Link>
    </div>
  );
}
