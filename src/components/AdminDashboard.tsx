"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock, Eye, Package, Plus, RefreshCw, ShoppingBag, WalletCards, X } from "lucide-react";
import { categories } from "@/data/categories";
import { formatPrice } from "@/lib/formatPrice";
import type { Product, ProductBadge } from "@/types/product";

type AdminOrderItem = {
  name: string;
  quantity: number;
  unitPrice?: number;
  unit_price?: number;
  totalPrice?: number;
  total_price?: number;
};

type AdminOrder = {
  id: string;
  orderNumber?: string;
  order_number?: string;
  customer: {
    fullName?: string;
    full_name?: string;
    phone: string;
    email?: string;
    address?: string;
    city: string;
    district?: string;
    customerType?: string;
    customer_type?: string;
  };
  items: AdminOrderItem[];
  subtotal?: number;
  deliveryFee?: number;
  delivery_fee?: number;
  total: number;
  paymentMethod?: string;
  payment_method?: string;
  paymentStatus?: string;
  payment_status?: string;
  orderStatus?: string;
  order_status?: string;
  createdAt?: string;
  created_at?: string;
};

const statuses = [
  { value: "pending", label: "Nouvelle" },
  { value: "confirmed", label: "Confirmée" },
  { value: "preparing", label: "Préparation" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" }
];

const badges: Array<ProductBadge | ""> = ["", "En stock", "Nouveau", "Promo"];

const emptyProduct: Partial<Product> = {
  name: "",
  category: "Électricité",
  subcategory: "Général",
  price: 0,
  stock: 0,
  badge: "En stock",
  isAvailable: true,
  deliveryAvailable: true,
  image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
  description: "Produit disponible chez Comptoir AlQods."
};

function orderNumber(order: AdminOrder) {
  return order.orderNumber || order.order_number || "Commande";
}

function customerName(order: AdminOrder) {
  return order.customer.fullName || order.customer.full_name || "Client";
}

function orderStatus(order: AdminOrder) {
  return order.orderStatus || order.order_status || "pending";
}

function unitPrice(item: AdminOrderItem) {
  return Number(item.unitPrice ?? item.unit_price ?? 0);
}

function totalPrice(item: AdminOrderItem) {
  return Number(item.totalPrice ?? item.total_price ?? item.quantity * unitPrice(item));
}

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productMessage, setProductMessage] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const stats = useMemo(() => {
    const pending = orders.filter((order) => orderStatus(order) !== "delivered" && orderStatus(order) !== "cancelled").length;
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    return [
      { label: "Produits", value: products.length, icon: Package },
      { label: "Commandes", value: orders.length, icon: ShoppingBag },
      { label: "À traiter", value: pending, icon: Clock },
      { label: "Total commandes", value: formatPrice(revenue), icon: WalletCards }
    ];
  }, [orders, products]);

  async function loadAdminData() {
    const [ordersResponse, productsResponse] = await Promise.all([
      fetch("/api/admin/orders"),
      fetch("/api/admin/products")
    ]);

    if (ordersResponse.status === 401 || productsResponse.status === 401) {
      setAuthenticated(false);
      return;
    }

    const ordersData = await ordersResponse.json();
    const productsData = await productsResponse.json();
    setOrders(ordersData.orders || []);
    setProducts(productsData.products || []);
    setAuthenticated(true);
  }

  useEffect(() => {
    loadAdminData().catch(() => setAuthenticated(false));
  }, []);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      setMessage("Mot de passe incorrect.");
      return;
    }

    setPassword("");
    await loadAdminData();
  }

  async function updateStatus(id: string, nextStatus: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: nextStatus })
    });
    await loadAdminData();
    setSelectedOrder((current) => current && current.id === id ? { ...current, orderStatus: nextStatus, order_status: nextStatus } : current);
  }

  async function importProducts() {
    setProductMessage("Import en cours...");
    const response = await fetch("/api/admin/products/import", { method: "POST" });
    const data = await response.json();
    setProductMessage(response.ok ? `${data.count} produits importés dans Supabase.` : "Import impossible.");
    await loadAdminData();
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingProduct) return;

    const isExisting = Boolean(editingProduct.id);
    const response = await fetch(isExisting ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products", {
      method: isExisting ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingProduct)
    });

    setProductMessage(response.ok ? "Produit enregistré." : "Enregistrement impossible.");
    if (response.ok) {
      setEditingProduct(null);
      await loadAdminData();
    }
  }

  async function uploadProductImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadMessage("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadMessage("Format refusé. Utilisez une image JPG, PNG ou WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadMessage("Image trop lourde. La taille maximale est de 2 Mo.");
      event.target.value = "";
      return;
    }

    const form = new FormData();
    form.append("file", file);
    setIsUploading(true);

    try {
      const response = await fetch("/api/admin/uploads/product-image", {
        method: "POST",
        body: form
      });
      const data = await response.json();

      if (!response.ok) {
        setUploadMessage(data.message || "Upload impossible.");
        return;
      }

      setEditingProduct((current) => ({ ...(current || {}), image: data.url }));
      setUploadMessage("Image ajoutée. Pensez à enregistrer le produit.");
    } catch {
      setUploadMessage("Upload impossible pour le moment.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  if (!authenticated) {
    return (
      <section className="bg-soft-bg py-12">
        <div className="container-page max-w-md">
          <form onSubmit={login} className="rounded-md border border-line bg-white p-8 shadow-sm">
            <p className="text-sm font-extrabold uppercase text-turquoise">Administration</p>
            <h1 className="mt-2 text-3xl font-black text-navy">Connexion back-office</h1>
            <p className="mt-2 text-sm text-muted">Accès réservé à l’équipe Comptoir AlQods.</p>
            <label className="mt-6 grid gap-2 text-sm font-bold text-navy">
              Mot de passe
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" />
            </label>
            {message && <p className="mt-4 rounded-md bg-alert/10 p-3 text-sm font-bold text-alert">{message}</p>}
            <button className="mt-5 w-full rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">Se connecter</button>
            <Link href="/" className="mt-4 block text-center text-sm font-bold text-navy">Retour boutique</Link>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-soft-bg py-10">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase text-turquoise">Administration</p>
            <h1 className="text-4xl font-black text-navy">Back-office Comptoir AlQods</h1>
            <p className="mt-2 text-muted">Gestion des commandes, statuts, produits et stocks.</p>
          </div>
          <Link href="/" className="rounded-md border border-navy px-5 py-3 font-extrabold text-navy">Retour boutique</Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-md border border-line bg-white p-5 shadow-sm">
              <Icon className="text-turquoise" />
              <p className="mt-4 text-sm font-bold text-muted">{label}</p>
              <p className="mt-1 text-3xl font-black text-navy">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
          <section className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
            <div className="border-b border-line p-5">
              <h2 className="text-2xl font-extrabold text-navy">Commandes</h2>
            </div>
            <div className="divide-y divide-line">
              {orders.map((order) => (
                <div key={order.id} className="grid gap-3 p-5 md:grid-cols-[120px_1fr_130px_170px_120px] md:items-center">
                  <strong className="text-navy">{orderNumber(order)}</strong>
                  <div>
                    <p className="font-bold text-navy">{customerName(order)}</p>
                    <p className="text-sm text-muted">{order.customer.city} · {order.customer.phone}</p>
                  </div>
                  <strong className="text-navy">{formatPrice(Number(order.total || 0))}</strong>
                  <select value={orderStatus(order)} onChange={(event) => updateStatus(order.id, event.target.value)} className="rounded-md border border-line px-3 py-2 text-sm font-bold outline-turquoise">
                    {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                  <button onClick={() => setSelectedOrder(order)} className="inline-flex items-center justify-center gap-2 rounded-md bg-navy px-3 py-2 text-sm font-extrabold text-white">
                    <Eye size={16} /> Détail
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-line bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-extrabold text-navy">Stock faible</h2>
            <div className="mt-4 space-y-3">
              {products.filter((product) => Number(product.stock) <= 12).slice(0, 10).map((product) => (
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

        <section className="mt-8 overflow-hidden rounded-md border border-line bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5">
            <div>
              <h2 className="text-2xl font-extrabold text-navy">Produits</h2>
              <p className="text-sm text-muted">Importer, ajouter, modifier prix, stock, badge et disponibilité.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={importProducts} className="inline-flex items-center gap-2 rounded-md border border-navy px-4 py-2 font-extrabold text-navy"><RefreshCw size={16} /> Importer le catalogue</button>
              <button onClick={() => setEditingProduct(emptyProduct)} className="inline-flex items-center gap-2 rounded-md bg-turquoise px-4 py-2 font-extrabold text-white"><Plus size={16} /> Ajouter produit</button>
            </div>
          </div>
          {productMessage && <p className="border-b border-line bg-soft-bg px-5 py-3 text-sm font-bold text-navy">{productMessage}</p>}
          <div className="divide-y divide-line">
            {products.map((product) => (
              <div key={product.id} className="grid gap-3 p-4 md:grid-cols-[80px_1fr_120px_90px_130px_110px] md:items-center">
                <div className="h-14 w-14 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />
                <div>
                  <p className="font-extrabold text-navy">{product.name}</p>
                  <p className="text-sm text-muted">{product.category} · {product.subcategory}</p>
                </div>
                <strong className="text-navy">{product.priceLabel}</strong>
                <span className={product.stock <= 5 ? "font-bold text-alert" : "font-bold text-stock"}>Stock {product.stock}</span>
                <span className={`rounded-full px-3 py-1 text-center text-xs font-extrabold ${product.isAvailable ? "bg-stock/10 text-stock" : "bg-alert/10 text-alert"}`}>{product.isAvailable ? "Actif" : "Inactif"}</span>
                <button onClick={() => setEditingProduct(product)} className="rounded-md border border-navy px-3 py-2 text-sm font-extrabold text-navy">Modifier</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-[95]">
          <button className="absolute inset-0 bg-navy-deep/55" onClick={() => setEditingProduct(null)} aria-label="Fermer le produit" />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-soft">
            <div className="flex items-start justify-between gap-4 border-b border-line p-6">
              <div>
                <p className="text-sm font-extrabold uppercase text-turquoise">Produit</p>
                <h2 className="mt-1 text-3xl font-black text-navy">{editingProduct.id ? "Modifier le produit" : "Ajouter un produit"}</h2>
              </div>
              <button onClick={() => setEditingProduct(null)} className="grid h-10 w-10 place-items-center rounded-md border border-line" aria-label="Fermer">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveProduct} className="flex-1 overflow-auto p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-navy md:col-span-2">Nom<input required value={editingProduct.name || ""} onChange={(event) => setEditingProduct({ ...editingProduct, name: event.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
                <label className="grid gap-2 text-sm font-bold text-navy">Catégorie<select value={editingProduct.category || "Électricité"} onChange={(event) => setEditingProduct({ ...editingProduct, category: event.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise">{categories.map((category) => <option key={category.slug}>{category.name}</option>)}</select></label>
                <label className="grid gap-2 text-sm font-bold text-navy">Sous-catégorie<input value={editingProduct.subcategory || ""} onChange={(event) => setEditingProduct({ ...editingProduct, subcategory: event.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
                <label className="grid gap-2 text-sm font-bold text-navy">Prix DH<input type="number" step="0.01" value={editingProduct.price || 0} onChange={(event) => setEditingProduct({ ...editingProduct, price: Number(event.target.value) })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
                <label className="grid gap-2 text-sm font-bold text-navy">Ancien prix DH<input type="number" step="0.01" value={editingProduct.oldPrice || ""} onChange={(event) => setEditingProduct({ ...editingProduct, oldPrice: event.target.value ? Number(event.target.value) : undefined })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
                <label className="grid gap-2 text-sm font-bold text-navy">Stock<input type="number" value={editingProduct.stock || 0} onChange={(event) => setEditingProduct({ ...editingProduct, stock: Number(event.target.value) })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
                <label className="grid gap-2 text-sm font-bold text-navy">Badge<select value={editingProduct.badge || ""} onChange={(event) => setEditingProduct({ ...editingProduct, badge: event.target.value ? event.target.value as ProductBadge : undefined })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise">{badges.map((badge) => <option key={badge} value={badge}>{badge || "Aucun"}</option>)}</select></label>
                <label className="grid gap-2 text-sm font-bold text-navy">Marque<input value={editingProduct.brand || ""} onChange={(event) => setEditingProduct({ ...editingProduct, brand: event.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
                <label className="grid gap-2 text-sm font-bold text-navy">Référence<input value={editingProduct.reference || ""} onChange={(event) => setEditingProduct({ ...editingProduct, reference: event.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
                <div className="grid gap-3 text-sm font-bold text-navy md:col-span-2">
                  <span>Photo du produit</span>
                  <div className="grid gap-4 rounded-md border border-line bg-soft-bg p-4 md:grid-cols-[160px_1fr]">
                    <div className="h-36 rounded-md border border-line bg-white bg-cover bg-center" style={{ backgroundImage: `url(${editingProduct.image || ""})` }} />
                    <div>
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-md bg-navy px-5 py-3 font-extrabold text-white">
                        {isUploading ? "Upload en cours..." : "Choisir une photo"}
                        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadProductImage} disabled={isUploading} className="sr-only" />
                      </label>
                      <p className="mt-3 text-sm font-normal text-muted">Formats acceptés : JPG, PNG ou WebP. Taille maximale : 2 Mo. Format conseillé : image carrée ou paysage, environ 1200 px de large.</p>
                      {uploadMessage && <p className="mt-3 rounded-md bg-white p-3 text-sm font-bold text-navy">{uploadMessage}</p>}
                    </div>
                  </div>
                </div>
                <label className="grid gap-2 text-sm font-bold text-navy md:col-span-2">Description<textarea rows={4} value={editingProduct.description || ""} onChange={(event) => setEditingProduct({ ...editingProduct, description: event.target.value })} className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" /></label>
                <label className="flex items-center gap-2 text-sm font-bold text-navy"><input type="checkbox" checked={editingProduct.isAvailable ?? true} onChange={(event) => setEditingProduct({ ...editingProduct, isAvailable: event.target.checked })} className="h-4 w-4 accent-turquoise" /> Produit actif</label>
                <label className="flex items-center gap-2 text-sm font-bold text-navy"><input type="checkbox" checked={editingProduct.deliveryAvailable ?? true} onChange={(event) => setEditingProduct({ ...editingProduct, deliveryAvailable: event.target.checked })} className="h-4 w-4 accent-turquoise" /> Livraison disponible</label>
              </div>
              <button className="mt-6 rounded-md bg-turquoise px-5 py-3 font-extrabold text-white">Enregistrer le produit</button>
            </form>
          </aside>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-[90]">
          <button className="absolute inset-0 bg-navy-deep/55" onClick={() => setSelectedOrder(null)} aria-label="Fermer le détail commande" />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-soft">
            <div className="flex items-start justify-between gap-4 border-b border-line p-6">
              <div>
                <p className="text-sm font-extrabold uppercase text-turquoise">Récapitulatif commande</p>
                <h2 className="mt-1 text-3xl font-black text-navy">{orderNumber(selectedOrder)}</h2>
                <p className="mt-1 text-sm text-muted">{selectedOrder.createdAt || selectedOrder.created_at || "Date non renseignée"}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="grid h-10 w-10 place-items-center rounded-md border border-line" aria-label="Fermer">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-line p-4">
                  <h3 className="font-extrabold text-navy">Client</h3>
                  <div className="mt-3 space-y-1 text-sm text-muted">
                    <p><strong className="text-navy">Nom :</strong> {customerName(selectedOrder)}</p>
                    <p><strong className="text-navy">Téléphone :</strong> {selectedOrder.customer.phone}</p>
                    <p><strong className="text-navy">Email :</strong> {selectedOrder.customer.email || "Non renseigné"}</p>
                    <p><strong className="text-navy">Type :</strong> {selectedOrder.customer.customerType || selectedOrder.customer.customer_type || "Non renseigné"}</p>
                  </div>
                </div>
                <div className="rounded-md border border-line p-4">
                  <h3 className="font-extrabold text-navy">Livraison</h3>
                  <div className="mt-3 space-y-1 text-sm text-muted">
                    <p><strong className="text-navy">Adresse :</strong> {selectedOrder.customer.address || "Non renseignée"}</p>
                    <p><strong className="text-navy">Quartier :</strong> {selectedOrder.customer.district || "Non renseigné"}</p>
                    <p><strong className="text-navy">Ville :</strong> {selectedOrder.customer.city}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 overflow-hidden rounded-md border border-line">
                <div className="grid grid-cols-[1fr_70px_110px_110px] gap-3 bg-soft-bg p-3 text-sm font-extrabold text-navy">
                  <span>Produit</span><span>Qté</span><span>PU</span><span>Total</span>
                </div>
                {selectedOrder.items.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="grid grid-cols-[1fr_70px_110px_110px] gap-3 border-t border-line p-3 text-sm">
                    <span className="font-bold text-navy">{item.name}</span><span>{item.quantity}</span><span>{formatPrice(unitPrice(item))}</span><span className="font-bold text-navy">{formatPrice(totalPrice(item))}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-md border border-line p-4">
                <h3 className="font-extrabold text-navy">Paiement et total</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span>Sous-total</span><strong>{formatPrice(Number(selectedOrder.subtotal || 0))}</strong></div>
                  <div className="flex justify-between"><span>Livraison</span><strong>{formatPrice(Number(selectedOrder.deliveryFee ?? selectedOrder.delivery_fee ?? 0))}</strong></div>
                  <div className="flex justify-between text-lg font-black text-navy"><span>Total</span><span>{formatPrice(Number(selectedOrder.total || 0))}</span></div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
