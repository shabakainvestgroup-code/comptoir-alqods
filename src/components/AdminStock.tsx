"use client";

import { useEffect, useState } from "react";
import { categories } from "@/data/categories";
import { formatPrice } from "@/lib/formatPrice";
import type { Product } from "@/types/product";

export function AdminStock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [threshold, setThreshold] = useState(10);
  const [category, setCategory] = useState("");
  const [mode, setMode] = useState("all");
  const [search, setSearch] = useState("");
  const [summary, setSummary] = useState({ total: 0, lowStock: 0, outOfStock: 0 });

  async function load() {
    const params = new URLSearchParams({ threshold: String(threshold), mode });
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    const data = await fetch(`/api/admin/stock?${params.toString()}`).then((response) => response.json());
    setProducts(data.products || []);
    setSummary({ total: data.total || 0, lowStock: data.lowStock || 0, outOfStock: data.outOfStock || 0 });
  }

  useEffect(() => {
    load();
  }, [category, mode]);

  async function updateProduct(productId: string, payload: Partial<Product>) {
    const response = await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (response.ok) {
      setProducts((current) => current.map((product) => product.id === productId ? data.product : product));
    }
  }

  async function applyPromotion(product: Product, percent: number) {
    const basePrice = Number(product.oldPrice || product.price);
    const promoPrice = Number((basePrice * (1 - percent / 100)).toFixed(2));
    await updateProduct(product.id, {
      price: promoPrice,
      priceLabel: formatPrice(promoPrice),
      oldPrice: basePrice,
      badge: "Promo"
    });
  }

  async function removePromotion(product: Product) {
    const restoredPrice = Number(product.oldPrice || product.price);
    await updateProduct(product.id, {
      price: restoredPrice,
      priceLabel: formatPrice(restoredPrice),
      oldPrice: undefined,
      badge: "En stock"
    });
  }

  return (
    <section className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
      <div className="grid gap-3 border-b border-line p-5 xl:grid-cols-[160px_220px_200px_1fr_120px]">
        <label className="grid gap-1 text-sm font-bold text-navy">
          Seuil faible
          <input type="number" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" />
        </label>
        <label className="grid gap-1 text-sm font-bold text-navy">
          Catégorie
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise">
            <option value="">Toutes</option>
            {categories.map((item) => <option key={item.slug}>{item.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold text-navy">
          Affichage
          <select value={mode} onChange={(event) => setMode(event.target.value)} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise">
            <option value="all">Stock complet</option>
            <option value="low">Stock faible</option>
            <option value="out">Rupture</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold text-navy">
          Recherche
          <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && load()} placeholder="Nom, marque, référence..." className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" />
        </label>
        <button onClick={load} className="self-end rounded-md bg-turquoise px-4 py-3 font-extrabold text-white">Appliquer</button>
      </div>

      <div className="grid gap-3 border-b border-line bg-soft-bg p-5 md:grid-cols-3">
        <div><p className="text-sm font-bold text-muted">Produits affichés</p><p className="text-3xl font-black text-navy">{summary.total}</p></div>
        <div><p className="text-sm font-bold text-muted">Stock faible</p><p className="text-3xl font-black text-alert">{summary.lowStock}</p></div>
        <div><p className="text-sm font-bold text-muted">Rupture</p><p className="text-3xl font-black text-alert">{summary.outOfStock}</p></div>
      </div>

      <div className="divide-y divide-line">
        {products.map((product) => (
          <div key={product.id} className="grid gap-4 p-4 lg:grid-cols-[86px_1fr_130px_110px_240px] lg:items-center">
            <div className="h-20 w-20 rounded-md border border-line bg-soft-bg bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />
            <div>
              <p className="font-extrabold text-navy">{product.name}</p>
              <p className="text-sm text-muted">{product.category} · {product.subcategory}</p>
              <p className="mt-1 text-sm font-bold text-navy">
                {product.priceLabel}
                {product.oldPrice && <span className="ml-2 text-muted line-through">{formatPrice(product.oldPrice)}</span>}
                {product.badge === "Promo" && <span className="ml-2 rounded-full bg-alert px-2 py-1 text-xs font-extrabold text-white">Promo</span>}
              </p>
            </div>
            <span className="text-sm text-muted">{product.reference || "Sans référence"}</span>
            <strong className={product.stock <= threshold ? "text-alert" : "text-stock"}>Stock {product.stock}</strong>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 gap-2">
                {[10, 15, 20].map((percent) => (
                  <button key={percent} type="button" onClick={() => applyPromotion(product, percent)} className="rounded-md bg-turquoise px-3 py-2 text-sm font-extrabold text-white">-{percent}%</button>
                ))}
              </div>
              {product.badge === "Promo" ? (
                <button type="button" onClick={() => removePromotion(product)} className="rounded-md border border-alert px-3 py-2 text-sm font-extrabold text-alert">Retirer promo</button>
              ) : (
                <p className="text-xs font-bold text-muted">Choisissez un pourcentage pour mettre en promotion.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
