"use client";

import { useEffect, useState } from "react";
import { Download, Eye, Search, X } from "lucide-react";
import { AdminPager } from "@/components/AdminPager";
import { formatPrice } from "@/lib/formatPrice";

type CustomerOrder = {
  id: string;
  order_number: string;
  total: number;
  order_status?: string;
  created_at: string;
};

type Customer = {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  cni?: string;
  address?: string;
  city?: string;
  district?: string;
  customer_type?: string;
  phone_verified?: boolean;
  email_verified?: boolean;
  last_order_at?: string;
  orders_count?: number;
  revenue?: number;
  orders?: CustomerOrder[];
};

const verificationFilters = [
  ["", "Tous les clients"],
  ["phone_verified", "Téléphone vérifié"],
  ["phone_unverified", "Téléphone non vérifié"],
  ["email_verified", "Email vérifié"],
  ["email_unverified", "Email non vérifié"]
];

function verificationBadge(value?: boolean) {
  return value ? "bg-stock/10 text-stock" : "bg-alert/10 text-alert";
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [verification, setVerification] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), pageSize: "50" });
    if (search) params.set("search", search);
    if (verification) params.set("verification", verification);
    const data = await fetch(`/api/admin/customers?${params.toString()}`).then((response) => response.json());
    setCustomers(data.customers || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }

  function exportCsv() {
    const params = new URLSearchParams({ export: "csv", pageSize: "100" });
    if (search) params.set("search", search);
    if (verification) params.set("verification", verification);
    window.location.href = `/api/admin/customers?${params.toString()}`;
  }

  useEffect(() => {
    load();
  }, [page, verification]);

  return (
    <>
      <section className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
        <div className="grid gap-3 border-b border-line p-5 lg:grid-cols-[1fr_240px_120px_170px]">
          <label className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && load()} placeholder="Rechercher nom, téléphone, email, CNI..." className="w-full rounded-md border border-line py-3 pl-11 pr-4 outline-turquoise" />
          </label>
          <select value={verification} onChange={(event) => { setVerification(event.target.value); setPage(1); }} className="rounded-md border border-line px-4 py-3 outline-turquoise">
            {verificationFilters.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <button onClick={() => { setPage(1); load(); }} className="rounded-md bg-turquoise px-4 py-3 font-extrabold text-white">Filtrer</button>
          <button onClick={exportCsv} className="inline-flex items-center justify-center gap-2 rounded-md border border-navy px-4 py-3 font-extrabold text-navy"><Download size={18} /> Export CSV</button>
        </div>

        <div className="divide-y divide-line">
          {customers.map((customer) => (
            <div key={customer.id} className="grid gap-3 p-5 md:grid-cols-[1.4fr_1fr_150px_150px_110px] md:items-center">
              <div>
                <p className="font-extrabold text-navy">{customer.full_name}</p>
                <p className="text-sm text-muted">{customer.customer_type || "Client"} · {customer.city || "Ville non renseignée"}</p>
              </div>
              <div className="text-sm text-muted">
                <p>{customer.phone}</p>
                <p>{customer.email || "Email non renseigné"}</p>
                <p>CNI : {customer.cni || "Non renseignée"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${verificationBadge(customer.phone_verified)}`}>Tel {customer.phone_verified ? "OK" : "Non"}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${verificationBadge(customer.email_verified)}`}>Email {customer.email_verified ? "OK" : "Non"}</span>
              </div>
              <div className="text-sm">
                <p><strong>{customer.orders_count || 0}</strong> commande(s)</p>
                <p className="font-extrabold text-navy">{formatPrice(Number(customer.revenue || 0))}</p>
              </div>
              <button onClick={() => setSelected(customer)} className="inline-flex items-center justify-center gap-2 rounded-md bg-navy px-3 py-2 text-sm font-extrabold text-white"><Eye size={16} /> Détail</button>
            </div>
          ))}

          {!loading && customers.length === 0 && <p className="p-5 text-muted">Aucun client trouvé.</p>}
          {loading && <p className="p-5 text-muted">Chargement des clients...</p>}
        </div>

        <AdminPager page={page} totalPages={totalPages} onPageChange={setPage} />
      </section>

      {selected && (
        <div className="fixed inset-0 z-[90]">
          <button className="absolute inset-0 bg-navy-deep/55" onClick={() => setSelected(null)} aria-label="Fermer" />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-soft">
            <div className="flex items-start justify-between gap-4 border-b border-line p-6">
              <div>
                <p className="text-sm font-extrabold uppercase text-turquoise">Fiche client</p>
                <h2 className="mt-1 text-3xl font-black text-navy">{selected.full_name}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="grid h-10 w-10 place-items-center rounded-md border border-line"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-line p-4">
                  <h3 className="font-extrabold text-navy">Identité</h3>
                  <p>Téléphone : {selected.phone}</p>
                  <p>Email : {selected.email || "Non renseigné"}</p>
                  <p>CNI : {selected.cni || "Non renseignée"}</p>
                  <p>Type : {selected.customer_type || "Non renseigné"}</p>
                </div>
                <div className="rounded-md border border-line p-4">
                  <h3 className="font-extrabold text-navy">Adresse</h3>
                  <p>{selected.address || "Adresse non renseignée"}</p>
                  <p>{selected.district || ""} {selected.city || ""}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-md border border-line p-4"><p className="text-sm text-muted">Commandes</p><p className="text-2xl font-black text-navy">{selected.orders_count || 0}</p></div>
                <div className="rounded-md border border-line p-4"><p className="text-sm text-muted">Chiffre d'affaires</p><p className="text-2xl font-black text-navy">{formatPrice(Number(selected.revenue || 0))}</p></div>
                <div className="rounded-md border border-line p-4"><p className="text-sm text-muted">Dernière commande</p><p className="font-extrabold text-navy">{selected.last_order_at ? new Date(selected.last_order_at).toLocaleDateString("fr-FR") : "Aucune"}</p></div>
              </div>

              <div className="mt-5 overflow-hidden rounded-md border border-line">
                <div className="grid grid-cols-[1fr_120px_130px] gap-3 bg-soft-bg p-3 text-sm font-extrabold text-navy"><span>Commande</span><span>Statut</span><span>Total</span></div>
                {(selected.orders || []).map((order) => (
                  <div key={order.id} className="grid grid-cols-[1fr_120px_130px] gap-3 border-t border-line p-3 text-sm">
                    <div><strong>{order.order_number}</strong><p className="text-muted">{new Date(order.created_at).toLocaleDateString("fr-FR")}</p></div>
                    <span className="font-bold text-turquoise">{order.order_status || "pending"}</span>
                    <strong>{formatPrice(Number(order.total || 0))}</strong>
                  </div>
                ))}
                {(selected.orders || []).length === 0 && <p className="p-3 text-sm text-muted">Aucune commande trouvée pour ce client.</p>}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
