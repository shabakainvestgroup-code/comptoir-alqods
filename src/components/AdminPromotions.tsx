"use client";

import { useEffect, useState } from "react";
import { Eye, ImagePlus, Plus, X } from "lucide-react";
import { AdminPager } from "@/components/AdminPager";
import { categories } from "@/data/categories";
import type { Promotion, PromotionPlacement } from "@/types/promotion";

const placements: [PromotionPlacement | "", string][] = [
  ["", "Tous les emplacements"],
  ["popup", "Popup"],
  ["banner", "Bannière"],
  ["page", "Page promotions"],
  ["category", "Catégorie"]
];

const emptyPromotion: Partial<Promotion> = {
  title: "",
  subtitle: "",
  description: "",
  image: "",
  cta_label: "Voir l'offre",
  cta_href: "/promotions",
  placement: "popup",
  category_slug: "",
  starts_at: "",
  ends_at: "",
  is_active: true,
  priority: 0
};

function dateInputValue(value?: string) {
  if (!value) return "";
  return value.slice(0, 16);
}

function toIsoOrEmpty(value?: string) {
  return value ? new Date(value).toISOString() : "";
}

export function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [editing, setEditing] = useState<Partial<Promotion> | null>(null);
  const [preview, setPreview] = useState<Promotion | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [placement, setPlacement] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  async function load() {
    const params = new URLSearchParams({ page: String(page), pageSize: "50" });
    if (placement) params.set("placement", placement);
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    const data = await fetch(`/api/admin/promotions?${params.toString()}`).then((response) => response.json());
    setPromotions(data.promotions || []);
    setTotalPages(data.totalPages || 1);
  }

  useEffect(() => {
    load();
  }, [page, placement, status]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    const payload = {
      ...editing,
      starts_at: toIsoOrEmpty(editing.starts_at),
      ends_at: toIsoOrEmpty(editing.ends_at)
    };
    const url = editing.id ? `/api/admin/promotions/${editing.id}` : "/api/admin/promotions";
    const method = editing.id ? "PATCH" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setEditing(null);
    await load();
  }

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !editing) return;

    setUploadMessage("Upload en cours...");
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/admin/uploads/promotion-image", { method: "POST", body: form });
    const data = await response.json();
    setUploadMessage(data.message || (response.ok ? "Image ajoutée." : "Upload impossible."));
    if (response.ok) setEditing({ ...editing, image: data.url });
  }

  return (
    <>
      <section className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
        <div className="grid gap-3 border-b border-line p-5 xl:grid-cols-[1fr_190px_190px_120px_160px]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && load()} placeholder="Rechercher une promotion..." className="rounded-md border border-line px-4 py-3 outline-turquoise" />
          <select value={placement} onChange={(event) => { setPlacement(event.target.value); setPage(1); }} className="rounded-md border border-line px-4 py-3 outline-turquoise">
            {placements.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="rounded-md border border-line px-4 py-3 outline-turquoise">
            <option value="">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="inactive">Inactives</option>
          </select>
          <button onClick={() => { setPage(1); load(); }} className="rounded-md bg-turquoise px-4 py-3 font-extrabold text-white">Filtrer</button>
          <button onClick={() => { setUploadMessage(""); setEditing(emptyPromotion); }} className="inline-flex items-center justify-center gap-2 rounded-md bg-navy px-4 py-3 font-extrabold text-white"><Plus size={18} /> Ajouter</button>
        </div>

        <div className="divide-y divide-line">
          {promotions.map((promotion) => (
            <div key={promotion.id} className="grid gap-4 p-5 lg:grid-cols-[110px_1fr_140px_130px_160px] lg:items-center">
              <div className="h-20 rounded-md border border-line bg-soft-bg bg-cover bg-center" style={{ backgroundImage: promotion.image ? `url(${promotion.image})` : undefined }} />
              <div>
                <p className="font-extrabold text-navy">{promotion.title}</p>
                <p className="text-sm text-muted">{promotion.subtitle || "Sans sous-titre"}</p>
                <p className="mt-1 text-xs text-muted">Priorité {promotion.priority || 0}</p>
              </div>
              <span className="rounded-full bg-soft-bg px-3 py-1 text-center text-sm font-bold text-navy">{promotion.placement}</span>
              <span className={`rounded-full px-3 py-1 text-center text-sm font-bold ${promotion.is_active ? "bg-stock/10 text-stock" : "bg-alert/10 text-alert"}`}>{promotion.is_active ? "Active" : "Inactive"}</span>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                <button onClick={() => setPreview(promotion)} className="inline-flex items-center justify-center gap-2 rounded-md border border-navy px-3 py-2 text-sm font-extrabold text-navy"><Eye size={16} /> Aperçu</button>
                <button onClick={() => { setUploadMessage(""); setEditing({ ...promotion, starts_at: dateInputValue(promotion.starts_at), ends_at: dateInputValue(promotion.ends_at) }); }} className="rounded-md bg-turquoise px-3 py-2 text-sm font-extrabold text-white">Modifier</button>
              </div>
            </div>
          ))}
          {promotions.length === 0 && <p className="p-5 text-muted">Aucune promotion trouvée.</p>}
        </div>

        <AdminPager page={page} totalPages={totalPages} onPageChange={setPage} />
      </section>

      {editing && (
        <div className="fixed inset-0 z-[95]">
          <button className="absolute inset-0 bg-navy-deep/55" onClick={() => setEditing(null)} aria-label="Fermer" />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-soft">
            <div className="flex items-start justify-between border-b border-line p-6">
              <div>
                <p className="text-sm font-extrabold uppercase text-turquoise">Promotion</p>
                <h2 className="mt-1 text-3xl font-black text-navy">{editing.id ? "Modifier l'offre" : "Ajouter une offre"}</h2>
              </div>
              <button onClick={() => setEditing(null)} className="grid h-10 w-10 place-items-center rounded-md border border-line"><X size={20} /></button>
            </div>
            <form onSubmit={save} className="flex-1 overflow-auto p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-navy md:col-span-2">Titre<input required value={editing.title || ""} onChange={(event) => setEditing({ ...editing, title: event.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
                <label className="grid gap-2 text-sm font-bold text-navy md:col-span-2">Sous-titre<input value={editing.subtitle || ""} onChange={(event) => setEditing({ ...editing, subtitle: event.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
                <label className="grid gap-2 text-sm font-bold text-navy md:col-span-2">Description<textarea rows={4} value={editing.description || ""} onChange={(event) => setEditing({ ...editing, description: event.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
                <label className="grid gap-2 text-sm font-bold text-navy">Bouton<input value={editing.cta_label || ""} onChange={(event) => setEditing({ ...editing, cta_label: event.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
                <label className="grid gap-2 text-sm font-bold text-navy">Lien<input value={editing.cta_href || ""} onChange={(event) => setEditing({ ...editing, cta_href: event.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
                <label className="grid gap-2 text-sm font-bold text-navy">Emplacement<select value={editing.placement || "popup"} onChange={(event) => setEditing({ ...editing, placement: event.target.value as PromotionPlacement })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise">{placements.filter(([value]) => value).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                <label className="grid gap-2 text-sm font-bold text-navy">Catégorie<select value={editing.category_slug || ""} onChange={(event) => setEditing({ ...editing, category_slug: event.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise"><option value="">Toutes</option>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
                <label className="grid gap-2 text-sm font-bold text-navy">Début<input type="datetime-local" value={editing.starts_at || ""} onChange={(event) => setEditing({ ...editing, starts_at: event.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
                <label className="grid gap-2 text-sm font-bold text-navy">Fin<input type="datetime-local" value={editing.ends_at || ""} onChange={(event) => setEditing({ ...editing, ends_at: event.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
                <label className="grid gap-2 text-sm font-bold text-navy">Priorité<input type="number" value={editing.priority || 0} onChange={(event) => setEditing({ ...editing, priority: Number(event.target.value) })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
                <label className="flex items-center gap-2 text-sm font-bold text-navy"><input type="checkbox" checked={editing.is_active ?? true} onChange={(event) => setEditing({ ...editing, is_active: event.target.checked })} className="h-4 w-4 accent-turquoise" /> Promotion active</label>
                <div className="grid gap-3 text-sm font-bold text-navy md:col-span-2">
                  <span>Image promotionnelle</span>
                  <div className="grid gap-4 rounded-md border border-line bg-soft-bg p-4 md:grid-cols-[180px_1fr]">
                    <div className="h-32 rounded-md border border-line bg-white bg-cover bg-center" style={{ backgroundImage: editing.image ? `url(${editing.image})` : undefined }} />
                    <div>
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-navy px-5 py-3 font-extrabold text-white"><ImagePlus size={18} /> Choisir une image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} className="sr-only" /></label>
                      <p className="mt-3 text-sm font-normal text-muted">JPG, PNG ou WebP. Maximum 2 Mo. Format paysage conseillé.</p>
                      {uploadMessage && <p className="mt-3 rounded-md bg-white p-3 text-sm font-bold text-navy">{uploadMessage}</p>}
                    </div>
                  </div>
                </div>
              </div>
              <button className="mt-6 rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">Enregistrer</button>
            </form>
          </aside>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-[96] grid place-items-center bg-navy-deep/60 p-4">
          <div className="w-full max-w-xl overflow-hidden rounded-md bg-white shadow-soft">
            {preview.image && <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url(${preview.image})` }} />}
            <div className="p-6">
              <p className="text-sm font-extrabold uppercase text-turquoise">{preview.subtitle}</p>
              <h3 className="mt-2 text-3xl font-black text-navy">{preview.title}</h3>
              <p className="mt-3 text-muted">{preview.description}</p>
              <div className="mt-5 flex gap-3">
                <a href={preview.cta_href || "/promotions"} className="rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">{preview.cta_label || "Voir l'offre"}</a>
                <button onClick={() => setPreview(null)} className="rounded-md border border-line px-5 py-3 font-extrabold text-navy">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
