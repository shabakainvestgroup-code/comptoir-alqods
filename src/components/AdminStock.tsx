"use client";

import { useEffect, useState } from "react";
import { categories } from "@/data/categories";
import type { Product } from "@/types/product";

export function AdminStock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [threshold, setThreshold] = useState(10);
  const [category, setCategory] = useState("");
  const [mode, setMode] = useState("all");
  const [summary, setSummary] = useState({ total: 0, lowStock: 0, outOfStock: 0 });

  async function load() {
    const params = new URLSearchParams({ threshold: String(threshold), mode });
    if (category) params.set("category", category);
    const data = await fetch(`/api/admin/stock?${params.toString()}`).then((response) => response.json());
    setProducts(data.products || []);
    setSummary({ total: data.total || 0, lowStock: data.lowStock || 0, outOfStock: data.outOfStock || 0 });
  }

  useEffect(() => { load(); }, [category, mode]);

  return (
    <section className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
      <div className="grid gap-3 border-b border-line p-5 lg:grid-cols-[160px_220px_200px_120px]">
        <label className="grid gap-1 text-sm font-bold text-navy">Seuil faible<input type="number" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
        <label className="grid gap-1 text-sm font-bold text-navy">Catégorie<select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise"><option value="">Toutes</option>{categories.map((item) => <option key={item.slug}>{item.name}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-bold text-navy">Affichage<select value={mode} onChange={(event) => setMode(event.target.value)} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise"><option value="all">Stock complet</option><option value="low">Stock faible</option><option value="out">Rupture</option></select></label>
        <button onClick={load} className="self-end rounded-md bg-turquoise px-4 py-3 font-extrabold text-white">Appliquer</button>
      </div>
      <div className="grid gap-3 border-b border-line bg-soft-bg p-5 md:grid-cols-3">
        <div><p className="text-sm font-bold text-muted">Produits affichés</p><p className="text-3xl font-black text-navy">{summary.total}</p></div>
        <div><p className="text-sm font-bold text-muted">Stock faible</p><p className="text-3xl font-black text-alert">{summary.lowStock}</p></div>
        <div><p className="text-sm font-bold text-muted">Rupture</p><p className="text-3xl font-black text-alert">{summary.outOfStock}</p></div>
      </div>
      <div className="divide-y divide-line">
        {products.map((product) => <div key={product.id} className="grid gap-3 p-4 md:grid-cols-[1fr_160px_120px_140px] md:items-center"><div><p className="font-extrabold text-navy">{product.name}</p><p className="text-sm text-muted">{product.category} · {product.subcategory}</p></div><span>{product.reference || "Sans référence"}</span><strong className={product.stock <= threshold ? "text-alert" : "text-stock"}>Stock {product.stock}</strong><span className={product.isAvailable ? "font-bold text-stock" : "font-bold text-alert"}>{product.isAvailable ? "Actif" : "Inactif"}</span></div>)}
      </div>
    </section>
  );
}
