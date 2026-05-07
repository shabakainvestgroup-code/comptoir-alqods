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
  total: number;
  order_status: string;
  payment_method: string;
  created_at: string;
};

export function AccountLookup() {
  const [identifier, setIdentifier] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  function resetHumanCheck() {
    setTurnstileToken("");
    setTurnstileKey((value) => value + 1);
  }

  async function lookup(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setMessage("");

    if (turnstileEnabled && !turnstileToken) {
      setMessage("Veuillez attendre la validation humaine.");
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
      setMessage(data.message || "Aucun compte trouvé.");
      return;
    }

    setCustomer(data.customer);
    setOrders(data.orders || []);
  }

  async function sendEmailCode() {
    setEmailMessage("");
    if (turnstileEnabled && !turnstileToken) {
      setEmailMessage("Veuillez attendre une nouvelle validation humaine.");
      return;
    }

    const response = await fetch("/api/account/email/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, turnstileToken })
    });
    const data = await response.json();
    resetHumanCheck();
    setEmailMessage(data.message || (response.ok ? "Code envoyé." : "Envoi impossible."));
  }

  async function verifyEmailCode() {
    setEmailMessage("");
    if (turnstileEnabled && !turnstileToken) {
      setEmailMessage("Veuillez attendre une nouvelle validation humaine.");
      return;
    }

    const response = await fetch("/api/account/email/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, code: emailCode, turnstileToken })
    });
    const data = await response.json();
    resetHumanCheck();
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
          <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} required className="rounded-md border border-line px-4 py-3 font-normal outline-turquoise" />
        </label>
        <div className="mt-4">
          <TurnstileWidget key={turnstileKey} action="account_lookup" onVerify={setTurnstileToken} />
        </div>
        {message && <p className="mt-4 rounded-md bg-alert/10 p-3 text-sm font-bold text-alert">{message}</p>}
        <button disabled={loading || (turnstileEnabled && !turnstileToken)} className="mt-5 w-full rounded-md bg-turquoise px-5 py-3 font-extrabold text-white disabled:bg-muted">
          {loading ? "Recherche..." : "Voir mon compte"}
        </button>
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
                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_160px_150px]">
                    <input value={emailCode} onChange={(event) => setEmailCode(event.target.value)} placeholder="Code reçu" className="rounded-md border border-line px-4 py-3 outline-turquoise" />
                    <button type="button" onClick={sendEmailCode} className="rounded-md border border-navy px-4 py-3 font-extrabold text-navy">Envoyer code</button>
                    <button type="button" onClick={verifyEmailCode} className="rounded-md bg-turquoise px-4 py-3 font-extrabold text-white">Valider</button>
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
                  <div key={order.id} className="grid gap-3 p-5 md:grid-cols-[140px_1fr_130px_130px]">
                    <strong className="text-navy">{order.order_number}</strong>
                    <span>{new Date(order.created_at).toLocaleDateString("fr-FR")}</span>
                    <strong>{formatPrice(Number(order.total || 0))}</strong>
                    <span className="font-bold text-turquoise">{order.order_status}</span>
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
