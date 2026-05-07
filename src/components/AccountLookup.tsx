"use client";

import { useState } from "react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { formatPrice } from "@/lib/formatPrice";

type Customer = {
  id?: string;
  full_name: string;
  phone: string;
  email?: string;
  cni?: string;
  address?: string;
  city?: string;
  district?: string;
  phone_verified?: boolean;
  email_verified?: boolean;
};

type Order = {
  id: string;
  order_number: string;
  items?: {
    productId?: string;
    product_id?: string;
    name: string;
    quantity: number;
    unitPrice?: number;
    unit_price?: number;
    totalPrice?: number;
    total_price?: number;
  }[];
  subtotal?: number;
  delivery_fee?: number;
  total: number;
  order_status: string;
  payment_status?: string;
  payment_method: string;
  created_at: string;
};

export function AccountLookup() {
  const [identifier, setIdentifier] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [emailTurnstileToken, setEmailTurnstileToken] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [emailTurnstileKey, setEmailTurnstileKey] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  function resetHumanCheck() {
    setTurnstileToken("");
    setTurnstileKey((value) => value + 1);
  }

  function resetEmailHumanCheck() {
    setEmailTurnstileToken("");
    setEmailTurnstileKey((value) => value + 1);
  }

  function handleIdentifierChange(value: string) {
    setIdentifier(value);
    setMessage("");

    if (customer) {
      setCustomer(null);
      setOrders([]);
      setSelectedOrderId(null);
      setEmailCode("");
      setEmailMessage("");
      resetHumanCheck();
      resetEmailHumanCheck();
    }
  }

  async function lookup(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setMessage("");

    if (turnstileEnabled && !turnstileToken) {
      setMessage("Veuillez attendre la validation humaine.");
      setSelectedOrderId(null);
      return;
    }

    setLoading(true);
    const response = await fetch("/api/account/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, turnstileToken })
    });
    const data = await response.json();
    setLoading(false);
    resetHumanCheck();

    if (!response.ok) {
      setCustomer(null);
      setOrders([]);
      setSelectedOrderId(null);
      setMessage(data.message || "Aucun compte trouvé.");
      return;
    }

    setCustomer(data.customer);
    setOrders(data.orders || []);
    setSelectedOrderId(data.orders?.[0]?.id || null);
  }

  async function sendEmailCode() {
    setEmailMessage("");
    if (turnstileEnabled && !emailTurnstileToken) {
      setEmailMessage("Veuillez attendre une nouvelle validation humaine.");
      return;
    }

    const response = await fetch("/api/account/email/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, turnstileToken: emailTurnstileToken })
    });
    const data = await response.json();
    resetEmailHumanCheck();
    setEmailMessage(data.message || (response.ok ? "Code envoyé." : "Envoi impossible."));
  }

  async function verifyEmailCode() {
    setEmailMessage("");
    if (turnstileEnabled && !emailTurnstileToken) {
      setEmailMessage("Veuillez attendre une nouvelle validation humaine.");
      return;
    }

    const response = await fetch("/api/account/email/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, code: emailCode, turnstileToken: emailTurnstileToken })
    });
    const data = await response.json();
    resetEmailHumanCheck();
    setEmailMessage(data.message || (response.ok ? "Email vérifié." : "Code invalide."));
    if (response.ok) await lookup();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <form onSubmit={lookup} className="h-fit rounded-md border border-line bg-white p-6 shadow-sm">
        <p className="text-sm font-extrabold uppercase text-turquoise">Espace client</p>
        <h1 className="mt-2 text-3xl font-black text-navy">Mon compte</h1>
        <p className="mt-2 text-muted">Entrez votre téléphone, votre CNI ou votre email pour retrouver vos commandes.</p>
        <label className="mt-6 grid gap-2 text-sm font-bold text-navy">
          Téléphone, CNI ou email
          <input value={identifier} onChange={(event) => handleIdentifierChange(event.target.value)} required className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" />
        </label>
        {!customer && (
          <div className="mt-4">
            <TurnstileWidget key={turnstileKey} action="account_lookup" onVerify={setTurnstileToken} />
          </div>
        )}
        {message && <p className="mt-4 rounded-md bg-alert/10 p-3 text-sm font-bold text-alert">{message}</p>}
        {!customer ? (
          <button disabled={loading || (turnstileEnabled && !turnstileToken)} className="mt-5 w-full rounded-md bg-turquoise px-5 py-3 font-extrabold text-white disabled:bg-muted">
            {loading ? "Recherche..." : "Voir mon compte"}
          </button>
        ) : (
          <button type="button" onClick={() => handleIdentifierChange("")} className="mt-5 w-full rounded-md border border-navy px-5 py-3 font-extrabold text-navy">
            Nouvelle recherche
          </button>
        )}
      </form>

      <div className="space-y-6">
        {customer ? (
          <>
            <section className="rounded-md border border-line bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-extrabold text-navy">{customer.full_name}</h2>
              <div className="mt-4 grid gap-2 text-muted md:grid-cols-2">
                <p><strong className="text-navy">Téléphone :</strong> {customer.phone}</p>
                <p><strong className="text-navy">Email :</strong> {customer.email || "Non renseigné"}</p>
                <p><strong className="text-navy">CNI :</strong> {customer.cni || "Non renseignée"}</p>
                <p><strong className="text-navy">Adresse :</strong> {customer.address || ""} {customer.district || ""} {customer.city || ""}</p>
                <p><strong className="text-navy">Téléphone vérifié :</strong> {customer.phone_verified ? "Oui" : "Non"}</p>
                <p><strong className="text-navy">Email vérifié :</strong> {customer.email_verified ? "Oui" : "Non"}</p>
              </div>
              {customer.email && !customer.email_verified && (
                <div className="mt-5 rounded-md border border-line bg-soft-bg p-4">
                  <h3 className="font-extrabold text-navy">Vérifier mon email</h3>
                  <p className="mt-1 text-sm text-muted">Recevez un code à 6 chiffres sur {customer.email}. Le code expire après 10 minutes.</p>
                  <div className="mt-4">
                    <TurnstileWidget key={emailTurnstileKey} action="account_email_verify" onVerify={setEmailTurnstileToken} />
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_160px_150px]">
                    <input value={emailCode} onChange={(event) => setEmailCode(event.target.value)} placeholder="Code reçu" className="rounded-md border border-line px-4 py-3 outline-turquoise" />
                    <button type="button" onClick={sendEmailCode} disabled={turnstileEnabled && !emailTurnstileToken} className="rounded-md border border-navy px-4 py-3 font-extrabold text-navy disabled:border-muted disabled:text-muted">Envoyer code</button>
                    <button type="button" onClick={verifyEmailCode} disabled={turnstileEnabled && !emailTurnstileToken} className="rounded-md bg-turquoise px-4 py-3 font-extrabold text-white disabled:bg-muted">Valider</button>
                  </div>
                  {emailMessage && <p className="mt-3 text-sm font-bold text-navy">{emailMessage}</p>}
                </div>
              )}
            </section>
            <section className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
              <div className="border-b border-line p-5">
                <h2 className="text-2xl font-extrabold text-navy">Mes commandes</h2>
              </div>
              <div className="divide-y divide-line">
                {orders.map((order) => (
                  <div key={order.id} className="p-5">
                    <div className="grid gap-3 md:grid-cols-[140px_1fr_130px_130px_120px] md:items-center">
                      <strong className="text-navy">{order.order_number}</strong>
                      <span>{new Date(order.created_at).toLocaleDateString("fr-FR")}</span>
                      <strong>{formatPrice(Number(order.total || 0))}</strong>
                      <span className="font-bold text-turquoise">{order.order_status}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedOrderId(selectedOrderId === order.id ? null : order.id)}
                        className="rounded-md border border-navy px-3 py-2 text-sm font-extrabold text-navy"
                      >
                        {selectedOrderId === order.id ? "Masquer" : "Détail"}
                      </button>
                    </div>
                    {selectedOrderId === order.id && (
                      <div className="mt-4 rounded-md border border-line bg-soft-bg p-4">
                        <div className="grid gap-2 text-sm text-muted md:grid-cols-3">
                          <p><strong className="text-navy">Paiement :</strong> {order.payment_method === "cash_on_delivery" ? "À la livraison" : "Carte bancaire"}</p>
                          <p><strong className="text-navy">Statut paiement :</strong> {order.payment_status || "pending_on_delivery"}</p>
                          <p><strong className="text-navy">Livraison :</strong> {formatPrice(Number(order.delivery_fee || 0))}</p>
                        </div>
                        <div className="mt-4 overflow-hidden rounded-md border border-line bg-white">
                          {(order.items || []).map((item) => {
                            const unitPrice = Number(item.unitPrice ?? item.unit_price ?? 0);
                            const totalPrice = Number(item.totalPrice ?? item.total_price ?? unitPrice * Number(item.quantity || 0));
                            return (
                              <div key={`${order.id}-${item.productId || item.product_id || item.name}`} className="grid gap-2 border-b border-line p-3 text-sm last:border-b-0 md:grid-cols-[1fr_90px_120px_120px]">
                                <span className="font-bold text-navy">{item.name}</span>
                                <span>Qté : {item.quantity}</span>
                                <span>{formatPrice(unitPrice)}</span>
                                <strong>{formatPrice(totalPrice)}</strong>
                              </div>
                            );
                          })}
                          {(order.items || []).length === 0 && <p className="p-3 text-sm text-muted">Détail produit indisponible pour cette commande.</p>}
                        </div>
                        <div className="mt-4 grid gap-2 text-sm md:ml-auto md:max-w-xs">
                          <p className="flex justify-between"><span>Sous-total</span><strong>{formatPrice(Number(order.subtotal || 0))}</strong></p>
                          <p className="flex justify-between"><span>Livraison</span><strong>{formatPrice(Number(order.delivery_fee || 0))}</strong></p>
                          <p className="flex justify-between text-lg font-black text-navy"><span>Total</span><span>{formatPrice(Number(order.total || 0))}</span></p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {orders.length === 0 && <p className="p-5 text-muted">Aucune commande trouvée.</p>}
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-md border border-line bg-white p-8 text-muted shadow-sm">
            Vos informations client et vos commandes apparaîtront ici après recherche.
          </section>
        )}
      </div>
    </div>
  );
}
