"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw, X } from "lucide-react";
import { categories } from "@/data/categories";
import { AdminPager } from "@/components/AdminPager";
import type { Product, ProductBadge } from "@/types/product";

const badges: Array<ProductBadge | ""> = ["", "En stock", "Nouveau", "Promo"];
const emptyProduct: Partial<Product> = { name: "", category: "Électricité", subcategory: "Général", price: 0, stock: 0, badge: "En stock", isAvailable: true, deliveryAvailable: true, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80", description: "Produit disponible chez Comptoir AlQods." };

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  async function load() {
    const params = new URLSearchParams({ page: String(page), pageSize: "50" });
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    const data = await fetch(`/api/admin/products?${params.toString()}`).then((response) => response.json());
    setProducts(data.products || []);
    setTotalPages(data.totalPages || 1);
  }

  useEffect(() => { load(); }, [page, category]);

  async function importProducts() {
    setMessage("Import en cours...");
    const data = await fetch("/api/admin/products/import", { method: "POST" }).then((response) => response.json());
    setMessage(data.ok ? `${data.count} produits importés.` : "Import impossible.");
    await load();
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const response = await fetch(editing.id ? `/api/admin/products/${editing.id}` : "/api/admin/products", { method: editing.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setMessage(response.ok ? "Produit enregistré." : "Enregistrement impossible.");
    if (response.ok) { setEditing(null); await load(); }
  }

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadMessage("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return setUploadMessage("Format refusé : JPG, PNG ou WebP.");
    if (file.size > 2 * 1024 * 1024) return setUploadMessage("Image trop lourde : maximum 2 Mo.");
    const form = new FormData();
    form.append("file", file);
    const data = await fetch("/api/admin/uploads/product-image", { method: "POST", body: form }).then((response) => response.json());
    if (data.ok) { setEditing((current) => ({ ...(current || {}), image: data.url })); setUploadMessage("Image ajoutée. Enregistrez le produit."); }
    else setUploadMessage(data.message || "Upload impossible.");
    event.target.value = "";
  }

  return (
    <>
      <section className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
        <div className="grid gap-3 border-b border-line p-5 lg:grid-cols-[1fr_220px_160px_180px]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && load()} placeholder="Rechercher nom, marque, référence..." className="rounded-md border border-line px-4 py-3 outline-turquoise" />
          <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="rounded-md border border-line px-4 py-3 outline-turquoise"><option value="">Toutes catégories</option>{categories.map((item) => <option key={item.slug}>{item.name}</option>)}</select>
          <button onClick={() => { setPage(1); load(); }} className="rounded-md bg-turquoise px-4 py-3 font-extrabold text-white">Filtrer</button>
          <button onClick={() => setEditing(emptyProduct)} className="inline-flex items-center justify-center gap-2 rounded-md bg-navy px-4 py-3 font-extrabold text-white"><Plus size={18} /> Ajouter</button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-soft-bg px-5 py-3">
          <p className="text-sm font-bold text-navy">{message || "Affichage par pages de 50 produits."}</p>
          <button onClick={importProducts} className="inline-flex items-center gap-2 rounded-md border border-navy px-4 py-2 font-extrabold text-navy"><RefreshCw size={16} /> Importer le catalogue</button>
        </div>
        <div className="divide-y divide-line">
          {products.map((product) => <div key={product.id} className="grid gap-3 p-4 md:grid-cols-[70px_1fr_120px_90px_120px_100px] md:items-center"><div className="h-14 w-14 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} /><div><p className="font-extrabold text-navy">{product.name}</p><p className="text-sm text-muted">{product.category} · {product.subcategory}</p></div><strong>{product.priceLabel}</strong><span>Stock {product.stock}</span><span className={product.isAvailable ? "font-bold text-stock" : "font-bold text-alert"}>{product.isAvailable ? "Actif" : "Inactif"}</span><button onClick={() => setEditing(product)} className="rounded-md border border-navy px-3 py-2 text-sm font-extrabold text-navy">Modifier</button></div>)}
        </div>
        <AdminPager page={page} totalPages={totalPages} onPageChange={setPage} />
      </section>

      {editing && <div className="fixed inset-0 z-[95]"><button className="absolute inset-0 bg-navy-deep/55" onClick={() => setEditing(null)} /><aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-soft"><div className="flex items-start justify-between border-b border-line p-6"><h2 className="text-3xl font-black text-navy">{editing.id ? "Modifier le produit" : "Ajouter un produit"}</h2><button onClick={() => setEditing(null)} className="grid h-10 w-10 place-items-center rounded-md border border-line"><X size={20} /></button></div><form onSubmit={save} className="flex-1 overflow-auto p-6"><div className="grid gap-4 md:grid-cols-2"><label className="grid gap-2 text-sm font-bold text-navy md:col-span-2">Nom<input required value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label><label className="grid gap-2 text-sm font-bold text-navy">Catégorie<select value={editing.category || "Électricité"} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise">{categories.map((item) => <option key={item.slug}>{item.name}</option>)}</select></label><label className="grid gap-2 text-sm font-bold text-navy">Sous-catégorie<input value={editing.subcategory || ""} onChange={(e) => setEditing({ ...editing, subcategory: e.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label><label className="grid gap-2 text-sm font-bold text-navy">Prix DH<input type="number" step="0.01" value={editing.price || 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label><label className="grid gap-2 text-sm font-bold text-navy">Stock<input type="number" value={editing.stock || 0} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label><label className="grid gap-2 text-sm font-bold text-navy">Badge<select value={editing.badge || ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value ? e.target.value as ProductBadge : undefined })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise">{["", "En stock", "Nouveau", "Promo"].map((badge) => <option key={badge} value={badge}>{badge || "Aucun"}</option>)}</select></label><label className="grid gap-2 text-sm font-bold text-navy">Marque<input value={editing.brand || ""} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label><div className="grid gap-3 text-sm font-bold text-navy md:col-span-2"><span>Photo du produit</span><div className="grid gap-4 rounded-md border border-line bg-soft-bg p-4 md:grid-cols-[160px_1fr]"><div className="h-36 rounded-md border border-line bg-white bg-cover bg-center" style={{ backgroundImage: `url(${editing.image || ""})` }} /><div><label className="inline-flex cursor-pointer rounded-md bg-navy px-5 py-3 font-extrabold text-white">Choisir une photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} className="sr-only" /></label><p className="mt-3 text-sm font-normal text-muted">JPG, PNG ou WebP. Maximum 2 Mo. Image carrée ou paysage conseillée.</p>{uploadMessage && <p className="mt-3 rounded-md bg-white p-3 text-sm font-bold text-navy">{uploadMessage}</p>}</div></div></div><label className="grid gap-2 text-sm font-bold text-navy md:col-span-2">Description<textarea rows={4} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label><label className="flex items-center gap-2 text-sm font-bold text-navy"><input type="checkbox" checked={editing.isAvailable ?? true} onChange={(e) => setEditing({ ...editing, isAvailable: e.target.checked })} className="h-4 w-4 accent-turquoise" /> Produit actif</label><label className="flex items-center gap-2 text-sm font-bold text-navy"><input type="checkbox" checked={editing.deliveryAvailable ?? true} onChange={(e) => setEditing({ ...editing, deliveryAvailable: e.target.checked })} className="h-4 w-4 accent-turquoise" /> Livraison disponible</label></div><button className="mt-6 rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">Enregistrer</button></form></aside></div>}
    </>
  );
}
